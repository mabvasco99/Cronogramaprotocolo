export type ENEMArea = 'natureza' | 'matematica' | 'linguagens' | 'humanas';

export type DayKey = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  area: ENEMArea;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  /** Base priority boost applied on top of area weight (>1 for harder subjects) */
  basePriority: number;
}

export interface CourseProfile {
  id: string;
  name: string;
  university?: string;
  description?: string;
  weights: Record<ENEMArea, number>;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  durationMinutes: number;
  topic: string;
  order: number;
}

export interface StudentProfile {
  hoursPerDay: Record<DayKey, number>;
  courseId: string;
  customWeights: Record<ENEMArea, number> | null;
  /** subjectId -> difficulty 1–5 (1 = easy, 5 = very hard) */
  difficultyRatings: Record<string, number>;
  weeksUntilExam: number;
  startDate: string; // ISO date string
}

export interface ScheduleBlock {
  subjectId: string;
  subjectName: string;
  shortName: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  durationMinutes: number;
  lessons: Lesson[];
}

export interface DaySchedule {
  dayKey: DayKey;
  label: string;
  date: string;
  totalMinutes: number;
  blocks: ScheduleBlock[];
}

export interface WeeklySchedule {
  weekNumber: number;
  startDate: string;
  days: DaySchedule[];
  subjectWeeklyMinutes: Record<string, number>;
  subjectWeights: Record<string, number>;
}

export interface ScheduleResult {
  weeks: WeeklySchedule[];
  subjectWeights: Record<string, number>;
  totalMinutesPerSubject: Record<string, number>;
  totalWeeklyMinutes: number;
}
