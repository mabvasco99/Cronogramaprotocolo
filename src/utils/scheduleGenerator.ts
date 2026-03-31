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

export function firstSundayOfNovember(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const dow = nov1.getDay();
  const daysToSunday = dow === 0 ? 0 : 7 - dow;
  return new Date(year, 10, 1 + daysToSunday);
}

export function getNextENEMDate(): Date {
  const today = new Date();
  let date = firstSundayOfNovember(today.getFullYear());
  if (today >= date) date = firstSundayOfNovember(today.getFullYear() + 1);
  return date;
}

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
    natureza: 2, matematica: 2, linguagens: 2, humanas: 2,
  };

  const rawWeights: Record<string, number> = {};
  for (const subject of SUBJECTS) {
    const areaWeight = courseWeights[subject.area] ?? 1;
    const difficulty = profile.difficultyRatings[subject.id] ?? 3;
    const difficultyFactor = difficulty / 3;
    rawWeights[subject.id] = areaWeight * difficultyFactor * subject.basePriority;
  }

  const total = Object.values(rawWeights).reduce((a, b) => a + b, 0);
  const normalized: Record<string, number> = {};
  for (const id in rawWeights) normalized[id] = rawWeights[id] / total;
  return normalized;
}

// ─── 2. Session-based weekly planner ─────────────────────────────────────────
//
// One "session" = 1 lesson video (~50min) + exercises (varies per subject).
// Each study day receives 2–3 sessions, max 4 on long days (≥ 3.5h).
// The same subject does NOT appear twice on the same day.

interface RawSession {
  subjectId: string;
  lesson: Lesson;
  teoriaMinutes: number;
  exerciciosMinutes: number;
}

function buildWeekDays(
  studyDays: DayKey[],
  hoursPerDay: Record<DayKey, number>,
  subjectWeights: Record<string, number>,
  lessonProgress: Record<string, number>,
  totalWeeklyMinutes: number
): Record<DayKey, RawSession[]> {
  // ── Step A: decide how many sessions per subject this week ──────────────────
  const LESSON_VIDEO_MINUTES = 50; // all platform lessons are ~50min

  const sessionsPool: RawSession[] = [];

  for (const subject of SUBJECTS) {
    const subjectMinutes = totalWeeklyMinutes * subjectWeights[subject.id];
    const sessionTotal = LESSON_VIDEO_MINUTES + subject.exerciseMinutes;
    const numSessions = Math.max(0, Math.round(subjectMinutes / sessionTotal));
    const pool = LESSONS_BY_SUBJECT[subject.id] ?? [];
    if (pool.length === 0) continue;

    for (let i = 0; i < numSessions; i++) {
      const idx = (lessonProgress[subject.id] ?? 0) % pool.length;
      const lesson = pool[idx];
      sessionsPool.push({
        subjectId: subject.id,
        lesson,
        teoriaMinutes: lesson.durationMinutes,
        exerciciosMinutes: subject.exerciseMinutes,
      });
      lessonProgress[subject.id] = (idx + 1) % pool.length;
    }
  }

  // Sort pool: higher-weight subjects first so they get assigned to prime days
  sessionsPool.sort(
    (a, b) => (subjectWeights[b.subjectId] ?? 0) - (subjectWeights[a.subjectId] ?? 0)
  );

  // ── Step B: determine how many sessions each day can hold ───────────────────
  // A session is ~sessionTotal minutes. Day capacity = clamp 1–4.
  const avgSession = 75; // representative average across subjects
  const dayCapacity = {} as Record<DayKey, number>;
  for (const day of studyDays) {
    const mins = (hoursPerDay[day] ?? 0) * 60;
    const raw = Math.floor(mins / avgSession);
    dayCapacity[day] = Math.min(4, Math.max(1, raw));
  }

  // ── Step C: assign sessions to days ────────────────────────────────────────
  const result = {} as Record<DayKey, RawSession[]>;
  for (const day of studyDays) result[day] = [];

  let sessionIdx = 0;
  let pass = 0;

  // Two passes: first try to cap at 3, second pass fills remaining capacity
  for (const cap of [3, 4]) {
    let dayIdx = 0;
    let maxIter = sessionsPool.length * studyDays.length * 2;
    let iter = 0;

    while (sessionIdx < sessionsPool.length && iter < maxIter) {
      const day = studyDays[dayIdx % studyDays.length];
      const session = sessionsPool[sessionIdx];
      const daySlots = result[day];
      const alreadyOnDay = daySlots.some((s) => s.subjectId === session.subjectId);
      const notFull = daySlots.length < Math.min(cap, dayCapacity[day]);

      if (notFull && !alreadyOnDay) {
        daySlots.push(session);
        sessionIdx++;
      }
      dayIdx++;
      iter++;
    }

    if (sessionIdx >= sessionsPool.length) break;
    pass++;
    if (pass > 1) break; // avoid infinite loop
  }

  // ── Step D: sort within each day (high weight → low weight) ────────────────
  for (const day of studyDays) {
    result[day].sort(
      (a, b) => (subjectWeights[b.subjectId] ?? 0) - (subjectWeights[a.subjectId] ?? 0)
    );
  }

  return result;
}

// ─── 3. Build a full week ─────────────────────────────────────────────────────

function buildWeek(
  weekNumber: number,
  startDate: Date,
  profile: StudentProfile,
  subjectWeights: Record<string, number>,
  lessonProgress: Record<string, number>
): WeeklySchedule {
  const totalWeeklyMinutes =
    DAY_KEYS.reduce((s, d) => s + (profile.hoursPerDay[d] ?? 0), 0) * 60;

  const studyDays = DAY_KEYS.filter((d) => (profile.hoursPerDay[d] ?? 0) > 0);

  const weekSessions = buildWeekDays(
    studyDays,
    profile.hoursPerDay,
    subjectWeights,
    lessonProgress,
    totalWeeklyMinutes
  );

  const days: DaySchedule[] = [];
  const subjectWeeklyMinutes: Record<string, number> = {};

  DAY_KEYS.forEach((dayKey, dayIdx) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIdx);
    const dateStr = date.toISOString().slice(0, 10);
    const totalMinutes = (profile.hoursPerDay[dayKey] ?? 0) * 60;

    if (totalMinutes === 0 || !weekSessions[dayKey]) {
      days.push({ dayKey, label: DAY_LABELS[dayKey], date: dateStr, totalMinutes: 0, blocks: [] });
      return;
    }

    const blocks: ScheduleBlock[] = weekSessions[dayKey].map((session) => {
      const subject = SUBJECT_MAP[session.subjectId]!;
      const total = session.teoriaMinutes + session.exerciciosMinutes;

      subjectWeeklyMinutes[session.subjectId] =
        (subjectWeeklyMinutes[session.subjectId] ?? 0) + total;

      return {
        subjectId: session.subjectId,
        subjectName: subject.name,
        shortName: subject.shortName,
        bgColor: subject.bgColor,
        textColor: subject.textColor,
        borderColor: subject.borderColor,
        icon: subject.icon,
        durationMinutes: total,
        teoriaMinutes: session.teoriaMinutes,
        exerciciosMinutes: session.exerciciosMinutes,
        lesson: session.lesson,
      };
    });

    days.push({ dayKey, label: DAY_LABELS[dayKey], date: dateStr, totalMinutes, blocks });
  });

  return { weekNumber, startDate: startDate.toISOString().slice(0, 10), days, subjectWeeklyMinutes, subjectWeights };
}

// ─── 4. Main entry point ──────────────────────────────────────────────────────

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

    for (const [id, mins] of Object.entries(week.subjectWeeklyMinutes)) {
      totalMinutesPerSubject[id] = (totalMinutesPerSubject[id] ?? 0) + mins;
    }
  }

  const totalWeeklyMinutes = DAY_KEYS.reduce(
    (s, d) => s + (profile.hoursPerDay[d] ?? 0) * 60, 0
  );

  return { weeks, subjectWeights, totalMinutesPerSubject, totalWeeklyMinutes };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m}min`;
}

export function getTotalWeeklyHours(hoursPerDay: Record<DayKey, number>): number {
  return DAY_KEYS.reduce((sum, d) => sum + (hoursPerDay[d] ?? 0), 0);
}
