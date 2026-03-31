import { SUBJECTS, SUBJECT_MAP } from '../data/subjects';
import { getLessons, type PlatformLesson } from '../data/platformLessons';
import type {
  StudentProfile,
  ENEMArea,
  DayKey,
  ScheduleBlock,
  DaySchedule,
  WeeklySchedule,
  ScheduleResult,
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
  return new Date(year, 10, 1 + (dow === 0 ? 0 : 7 - dow));
}

export function getNextENEMDate(): Date {
  const today = new Date();
  let d = firstSundayOfNovember(today.getFullYear());
  if (today >= d) d = firstSundayOfNovember(today.getFullYear() + 1);
  return d;
}

export function weeksUntilENEM(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = getNextENEMDate().getTime() - today.getTime();
  return Math.max(1, Math.round(diff / (7 * 24 * 60 * 60 * 1000)));
}

// ─── 1. Weight calculation ────────────────────────────────────────────────────

export function computeSubjectWeights(profile: StudentProfile): Record<string, number> {
  const areaWeights: Record<ENEMArea, number> = profile.customWeights ?? {
    natureza: 2, matematica: 2, linguagens: 2, humanas: 2, redacao: 2,
  };

  const raw: Record<string, number> = {};
  for (const s of SUBJECTS) {
    const aw = areaWeights[s.area] ?? 1;
    const df = (profile.difficultyRatings[s.id] ?? 3) / 3;
    raw[s.id] = aw * df * s.basePriority;
  }

  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const out: Record<string, number> = {};
  for (const id in raw) out[id] = raw[id] / total;
  return out;
}

// ─── 2. Session building ──────────────────────────────────────────────────────

interface Session {
  subjectId: string;
  lesson: PlatformLesson | null;
  teoriaMinutes: number;
  exerciciosMinutes: number;
}

/**
 * Assigns sessions to days for one week.
 *
 * Rules:
 * - A day's total session time NEVER exceeds that day's available minutes.
 * - Matemática: appears on at most 3 days/week.
 * - All other subjects: appear on at most 2 days/week.
 * - Within a day a subject appears at most once (one teoria + exercícios block).
 * - High-weight subjects are assigned first; days with most remaining time are preferred.
 */
function buildWeekSessions(
  studyDays: DayKey[],
  hoursPerDay: Record<DayKey, number>,
  subjectWeights: Record<string, number>,
  lessonProgress: Record<string, number>,
): Record<DayKey, Session[]> {
  const TEORIA = 50; // ~50 min per lesson video

  // Remaining available minutes per study day
  const remaining: Record<string, number> = {};
  for (const d of studyDays) remaining[d] = Math.floor((hoursPerDay[d] ?? 0) * 60);

  const result: Record<string, Session[]> = {};
  for (const d of studyDays) result[d] = [];

  // Sort subjects by weight descending so highest-priority subjects get best slots
  const sorted = SUBJECTS
    .filter(s => getLessons(s.id).length > 0 && (subjectWeights[s.id] ?? 0) > 0)
    .sort((a, b) => (subjectWeights[b.id] ?? 0) - (subjectWeights[a.id] ?? 0));

  for (const s of sorted) {
    const sessionLen = TEORIA + s.exerciseMinutes;
    const lessons = getLessons(s.id);

    // Max days this subject can appear in a single week
    const maxDays = s.id === 'matematica'
      ? Math.min(3, studyDays.length)
      : Math.min(2, studyDays.length);

    // Pick days that have enough time, preferring days with the most remaining time
    const candidates = studyDays
      .filter(d => remaining[d] >= sessionLen)
      .sort((a, b) => remaining[b] - remaining[a])
      .slice(0, maxDays);

    for (const d of candidates) {
      if (remaining[d] < sessionLen) continue;

      const idx = (lessonProgress[s.id] ?? 0) % lessons.length;
      result[d].push({
        subjectId: s.id,
        lesson: lessons[idx],
        teoriaMinutes: TEORIA,
        exerciciosMinutes: s.exerciseMinutes,
      });
      lessonProgress[s.id] = (lessonProgress[s.id] ?? 0) + 1;
      remaining[d] -= sessionLen;
    }
  }

  // Sort each day's blocks: highest weight first
  for (const d of studyDays) {
    result[d].sort((a, b) => (subjectWeights[b.subjectId] ?? 0) - (subjectWeights[a.subjectId] ?? 0));
  }

  return result as Record<DayKey, Session[]>;
}

// ─── 3. Build a full week ─────────────────────────────────────────────────────

function buildWeek(
  weekNumber: number,
  startDate: Date,
  profile: StudentProfile,
  subjectWeights: Record<string, number>,
  lessonProgress: Record<string, number>
): WeeklySchedule {
  const studyDays = DAY_KEYS.filter(d => (profile.hoursPerDay[d] ?? 0) > 0);
  const weekSessions = buildWeekSessions(studyDays, profile.hoursPerDay, subjectWeights, lessonProgress);

  const days: DaySchedule[] = [];
  const subjectWeeklyMinutes: Record<string, number> = {};

  DAY_KEYS.forEach((dayKey, di) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + di);
    const dateStr = date.toISOString().slice(0, 10);
    const totalMinutes = (profile.hoursPerDay[dayKey] ?? 0) * 60;

    if (totalMinutes === 0 || !weekSessions[dayKey]) {
      days.push({ dayKey, label: DAY_LABELS[dayKey], date: dateStr, totalMinutes: 0, blocks: [] });
      return;
    }

    const blocks: ScheduleBlock[] = (weekSessions[dayKey] ?? []).map(sess => {
      const subj = SUBJECT_MAP[sess.subjectId]!;
      const total = sess.teoriaMinutes + sess.exerciciosMinutes;
      subjectWeeklyMinutes[sess.subjectId] = (subjectWeeklyMinutes[sess.subjectId] ?? 0) + total;
      return {
        subjectId: sess.subjectId,
        subjectName: subj.name,
        shortName: subj.shortName,
        bgColor: subj.bgColor,
        textColor: subj.textColor,
        borderColor: subj.borderColor,
        icon: subj.icon,
        durationMinutes: total,
        teoriaMinutes: sess.teoriaMinutes,
        exerciciosMinutes: sess.exerciciosMinutes,
        lesson: sess.lesson,
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
  start.setDate(start.getDate() + (dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow));

  for (let w = 0; w < profile.weeksUntilExam; w++) {
    const ws = new Date(start);
    ws.setDate(start.getDate() + w * 7);
    const week = buildWeek(w + 1, ws, profile, subjectWeights, lessonProgress);
    weeks.push(week);
    for (const [id, m] of Object.entries(week.subjectWeeklyMinutes)) {
      totalMinutesPerSubject[id] = (totalMinutesPerSubject[id] ?? 0) + m;
    }
  }

  const totalWeeklyMinutes = DAY_KEYS.reduce((s, d) => s + (profile.hoursPerDay[d] ?? 0) * 60, 0);
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
  return DAY_KEYS.reduce((s, d) => s + (hoursPerDay[d] ?? 0), 0);
}
