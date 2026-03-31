// ENEMArea includes 'redacao' as its own weighted area (200pts on its own)
export type ENEMArea = 'natureza' | 'matematica' | 'linguagens' | 'humanas' | 'redacao';

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
  basePriority: number;
  /** Time for exercises after each lesson (minutes) */
  exerciseMinutes: number;
}

export interface StudentProfile {
  hoursPerDay: Record<DayKey, number>;
  courseId: string;
  customWeights: Record<ENEMArea, number> | null;
  difficultyRatings: Record<string, number>;
  weeksUntilExam: number;
  startDate: string;
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
  teoriaMinutes: number;
  exerciciosMinutes: number;
  lesson: { id: string; title: string; url: string; section: string } | null;
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

export interface CourseProfile {
  id: string;
  name: string;
  university?: string;
  description?: string;
  weights: Record<ENEMArea, number>;
}

export interface ScheduleResult {
  weeks: WeeklySchedule[];
  subjectWeights: Record<string, number>;
  totalMinutesPerSubject: Record<string, number>;
  totalWeeklyMinutes: number;
}
