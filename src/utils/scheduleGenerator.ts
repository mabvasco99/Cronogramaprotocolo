import { SUBJECTS, SUBJECT_MAP } from '../data/subjects';
import { COURSE_MAP } from '../data/courses';
import { LESSONS_BY_SUBJECT } from '../data/lessons';
import type {
  StudentProfile,
  ENEMArea,
  DayKey,
  ScheduleBlock,
  DaySchedule,
  WeeklySchedule,
  ScheduleResult,
  Lesson,
} from '../types';

const DAY_KEYS: DayKey[] = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
const DAY_LABELS: Record<DayKey, string> = {
  seg: 'Segunda-feira',
  ter: 'Terça-feira',
  qua: 'Quarta-feira',
  qui: 'Quinta-feira',
  sex: 'Sexta-feira',
  sab: 'Sábado',
  dom: 'Domingo',
};

// ─── 1. Weight calculation ────────────────────────────────────────────────────

function computeSubjectWeights(profile: StudentProfile): Record<string, number> {
  const courseWeights: Record<ENEMArea, number> =
    profile.customWeights ??
    COURSE_MAP[profile.courseId]?.weights ?? {
      natureza: 2,
      matematica: 2,
      linguagens: 2,
      humanas: 2,
    };

  const rawWeights: Record<string, number> = {};

  for (const subject of SUBJECTS) {
    const areaWeight = courseWeights[subject.area] ?? 1;
    const difficulty = profile.difficultyRatings[subject.id] ?? 3;
    // Normalize difficulty around 1.0: rating 3 → factor 1.0, rating 5 → factor 1.67
    const difficultyFactor = difficulty / 3;
    const priorityBoost = subject.basePriority;

    rawWeights[subject.id] = areaWeight * difficultyFactor * priorityBoost;
  }

  // Normalize so all weights sum to 1
  const total = Object.values(rawWeights).reduce((a, b) => a + b, 0);
  const normalized: Record<string, number> = {};
  for (const id in rawWeights) {
    normalized[id] = rawWeights[id] / total;
  }

  return normalized;
}

// ─── 2. Lesson pool management ────────────────────────────────────────────────

/**
 * Returns the lessons for a given subject starting from the given progress index,
 * cycling back to the beginning if all lessons have been covered.
 */
function pickLessons(
  subjectId: string,
  minutesNeeded: number,
  startIndex: number
): { lessons: Lesson[]; endIndex: number } {
  const pool = LESSONS_BY_SUBJECT[subjectId] ?? [];
  if (pool.length === 0 || minutesNeeded <= 0) return { lessons: [], endIndex: startIndex };

  const lessons: Lesson[] = [];
  let remaining = minutesNeeded;
  let idx = startIndex % pool.length;
  const maxIter = pool.length * 2; // safety cap to prevent infinite loops
  let iter = 0;

  while (remaining > 0 && iter < maxIter) {
    const lesson = pool[idx % pool.length];
    // Include lesson if it fits, or if we haven't started yet
    if (lesson.durationMinutes <= remaining || lessons.length === 0) {
      lessons.push(lesson);
      remaining -= lesson.durationMinutes;
      idx++;
    } else {
      break;
    }
    iter++;
  }

  return { lessons, endIndex: idx % pool.length };
}

// ─── 3. Daily block builder ───────────────────────────────────────────────────

/**
 * Converts raw subject minutes for a day into schedule blocks.
 * Merges subjects with < 15 min into the nearest neighbour to avoid
 * trivially short sessions.
 */
function buildBlocks(
  minutesBySubject: Record<string, number>,
  lessonProgress: Record<string, number>
): ScheduleBlock[] {
  const MIN_BLOCK = 20; // minimum meaningful block in minutes

  // Sort by minutes descending (most important subjects first)
  const entries = Object.entries(minutesBySubject)
    .filter(([, mins]) => mins >= MIN_BLOCK)
    .sort((a, b) => b[1] - a[1]);

  const blocks: ScheduleBlock[] = [];

  for (const [subjectId, minutes] of entries) {
    const subject = SUBJECT_MAP[subjectId];
    if (!subject) continue;

    // Round to nearest 5 minutes
    const rounded = Math.round(minutes / 5) * 5;
    if (rounded < MIN_BLOCK) continue;

    const { lessons, endIndex } = pickLessons(
      subjectId,
      rounded,
      lessonProgress[subjectId] ?? 0
    );
    lessonProgress[subjectId] = endIndex;

    blocks.push({
      subjectId,
      subjectName: subject.name,
      shortName: subject.shortName,
      bgColor: subject.bgColor,
      textColor: subject.textColor,
      borderColor: subject.borderColor,
      icon: subject.icon,
      durationMinutes: rounded,
      lessons,
    });
  }

  return blocks;
}

// ─── 4. Weekly schedule builder ──────────────────────────────────────────────

function buildWeek(
  weekNumber: number,
  startDate: Date,
  profile: StudentProfile,
  subjectWeights: Record<string, number>,
  lessonProgress: Record<string, number>
): WeeklySchedule {
  const days: DaySchedule[] = [];
  const subjectWeeklyMinutes: Record<string, number> = {};

  DAY_KEYS.forEach((dayKey, dayIdx) => {
    const hoursToday = profile.hoursPerDay[dayKey] ?? 0;
    const totalMinutes = hoursToday * 60;

    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIdx);
    const dateStr = date.toISOString().slice(0, 10);

    if (totalMinutes === 0) {
      days.push({
        dayKey,
        label: DAY_LABELS[dayKey],
        date: dateStr,
        totalMinutes: 0,
        blocks: [],
      });
      return;
    }

    // Distribute total minutes proportionally across subjects
    const minutesBySubject: Record<string, number> = {};
    let distributed = 0;

    const subjectIds = Object.keys(subjectWeights).sort(
      (a, b) => subjectWeights[b] - subjectWeights[a]
    );

    for (let i = 0; i < subjectIds.length; i++) {
      const id = subjectIds[i];
      if (i === subjectIds.length - 1) {
        minutesBySubject[id] = totalMinutes - distributed;
      } else {
        minutesBySubject[id] = Math.round(totalMinutes * subjectWeights[id]);
        distributed += minutesBySubject[id];
      }
    }

    const blocks = buildBlocks(minutesBySubject, lessonProgress);

    // Accumulate weekly totals
    for (const block of blocks) {
      subjectWeeklyMinutes[block.subjectId] =
        (subjectWeeklyMinutes[block.subjectId] ?? 0) + block.durationMinutes;
    }

    days.push({
      dayKey,
      label: DAY_LABELS[dayKey],
      date: dateStr,
      totalMinutes,
      blocks,
    });
  });

  return {
    weekNumber,
    startDate: startDate.toISOString().slice(0, 10),
    days,
    subjectWeeklyMinutes,
    subjectWeights,
  };
}

// ─── 5. Main entry point ──────────────────────────────────────────────────────

export function generateSchedule(profile: StudentProfile): ScheduleResult {
  const subjectWeights = computeSubjectWeights(profile);

  // Lesson progress tracker — persists across weeks so each week continues
  // from where the previous left off.
  const lessonProgress: Record<string, number> = {};

  const weeks: WeeklySchedule[] = [];
  const totalMinutesPerSubject: Record<string, number> = {};

  const start = new Date(profile.startDate);
  // Align to the nearest Monday
  const dayOfWeek = start.getDay(); // 0=Sun, 1=Mon ...
  const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  start.setDate(start.getDate() + daysToMonday);

  for (let w = 0; w < profile.weeksUntilExam; w++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + w * 7);

    const week = buildWeek(w + 1, weekStart, profile, subjectWeights, lessonProgress);
    weeks.push(week);

    for (const [subjectId, minutes] of Object.entries(week.subjectWeeklyMinutes)) {
      totalMinutesPerSubject[subjectId] = (totalMinutesPerSubject[subjectId] ?? 0) + minutes;
    }
  }

  const totalWeeklyMinutes = DAY_KEYS.reduce(
    (sum, d) => sum + (profile.hoursPerDay[d] ?? 0) * 60,
    0
  );

  return { weeks, subjectWeights, totalMinutesPerSubject, totalWeeklyMinutes };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function getTotalWeeklyHours(hoursPerDay: Record<DayKey, number>): number {
  return DAY_KEYS.reduce((sum, d) => sum + (hoursPerDay[d] ?? 0), 0);
}

export { computeSubjectWeights };
