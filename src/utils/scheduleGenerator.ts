import { SUBJECTS, SUBJECT_MAP } from '../data/subjects';
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

// ─── ENEM date helpers ────────────────────────────────────────────────────────

/** Returns the first Sunday of November for a given year (ENEM day 2). */
export function firstSundayOfNovember(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const dow = nov1.getDay(); // 0=Sun
  const daysToSunday = dow === 0 ? 0 : 7 - dow;
  return new Date(year, 10, 1 + daysToSunday);
}

/** Returns the next upcoming ENEM date (first Sunday of November). */
export function getNextENEMDate(): Date {
  const today = new Date();
  let date = firstSundayOfNovember(today.getFullYear());
  // If this year's ENEM already passed, use next year
  if (today >= date) date = firstSundayOfNovember(today.getFullYear() + 1);
  return date;
}

/** Weeks from today until the next ENEM. */
export function weeksUntilENEM(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const enem = getNextENEMDate();
  const diff = enem.getTime() - today.getTime();
  return Math.max(1, Math.round(diff / (7 * 24 * 60 * 60 * 1000)));
}

// ─── 1. Weight calculation ────────────────────────────────────────────────────

export function computeSubjectWeights(profile: StudentProfile): Record<string, number> {
  const courseWeights: Record<ENEMArea, number> = profile.customWeights ?? {
    natureza: 2,
    matematica: 2,
    linguagens: 2,
    humanas: 2,
  };

  const rawWeights: Record<string, number> = {};

  for (const subject of SUBJECTS) {
    const areaWeight = courseWeights[subject.area] ?? 1;
    const difficulty = profile.difficultyRatings[subject.id] ?? 3;
    // Normalize difficulty around 1.0: rating 3 → 1.0, rating 5 → 1.67
    const difficultyFactor = difficulty / 3;
    const priorityBoost = subject.basePriority;

    rawWeights[subject.id] = areaWeight * difficultyFactor * priorityBoost;
  }

  const total = Object.values(rawWeights).reduce((a, b) => a + b, 0);
  const normalized: Record<string, number> = {};
  for (const id in rawWeights) {
    normalized[id] = rawWeights[id] / total;
  }
  return normalized;
}

// ─── 2. Lesson pool management ────────────────────────────────────────────────

/**
 * Total time a lesson takes = video time + recommended exercise time for the subject.
 */
function lessonTotalMinutes(lesson: Lesson): number {
  const subject = SUBJECT_MAP[lesson.subjectId];
  return lesson.durationMinutes + (subject?.exerciseMinutes ?? 15);
}

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
  const maxIter = pool.length * 2;
  let iter = 0;

  while (remaining > 0 && iter < maxIter) {
    const lesson = pool[idx % pool.length];
    const total = lessonTotalMinutes(lesson);
    if (total <= remaining || lessons.length === 0) {
      lessons.push(lesson);
      remaining -= total;
      idx++;
    } else {
      break;
    }
    iter++;
  }

  return { lessons, endIndex: idx % pool.length };
}

// ─── 3. Daily block builder ───────────────────────────────────────────────────

function buildBlocks(
  minutesBySubject: Record<string, number>,
  lessonProgress: Record<string, number>
): ScheduleBlock[] {
  const MIN_BLOCK = 25;

  const entries = Object.entries(minutesBySubject)
    .filter(([, mins]) => mins >= MIN_BLOCK)
    .sort((a, b) => b[1] - a[1]);

  const blocks: ScheduleBlock[] = [];

  for (const [subjectId, minutes] of entries) {
    const subject = SUBJECT_MAP[subjectId];
    if (!subject) continue;

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
      days.push({ dayKey, label: DAY_LABELS[dayKey], date: dateStr, totalMinutes: 0, blocks: [] });
      return;
    }

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

    for (const block of blocks) {
      subjectWeeklyMinutes[block.subjectId] =
        (subjectWeeklyMinutes[block.subjectId] ?? 0) + block.durationMinutes;
    }

    days.push({ dayKey, label: DAY_LABELS[dayKey], date: dateStr, totalMinutes, blocks });
  });

  return { weekNumber, startDate: startDate.toISOString().slice(0, 10), days, subjectWeeklyMinutes, subjectWeights };
}

// ─── 5. Main entry point ──────────────────────────────────────────────────────

export function generateSchedule(profile: StudentProfile): ScheduleResult {
  const subjectWeights = computeSubjectWeights(profile);
  const lessonProgress: Record<string, number> = {};
  const weeks: WeeklySchedule[] = [];
  const totalMinutesPerSubject: Record<string, number> = {};

  const start = new Date(profile.startDate);
  const dow = start.getDay();
  const daysToMonday = dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow;
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
