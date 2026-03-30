import { useState } from 'react';
import { StudentProfile, ScheduleResult } from './types';
import { SUBJECTS } from './data/subjects';
import { generateSchedule } from './utils/scheduleGenerator';
import StepIndicator from './components/StepIndicator';
import Step1Hours from './components/steps/Step1Hours';
import Step2Goal from './components/steps/Step2Goal';
import Step3Difficulty from './components/steps/Step3Difficulty';
import ScheduleView from './components/schedule/ScheduleView';

const DEFAULT_DIFFICULTY = Object.fromEntries(SUBJECTS.map((s) => [s.id, 3]));

const DEFAULT_PROFILE: StudentProfile = {
  hoursPerDay: {
    seg: 2, ter: 2, qua: 2, qui: 2, sex: 2, sab: 4, dom: 0,
  },
  courseId: '',
  customWeights: null,
  difficultyRatings: DEFAULT_DIFFICULTY,
  weeksUntilExam: 20,
  startDate: new Date().toISOString().slice(0, 10),
};

const STEP_LABELS = [
  'Horas de Estudo',
  'Objetivo / Curso',
  'Dificuldades',
  'Cronograma',
];

export default function App() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [result, setResult] = useState<ScheduleResult | null>(null);

  function handleGenerate() {
    const schedule = generateSchedule(profile);
    setResult(schedule);
    setStep(4);
  }

  function handleReset() {
    setStep(1);
    setResult(null);
    setProfile({ ...DEFAULT_PROFILE, startDate: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">E</div>
          <div>
            <h1 className="font-bold text-gray-900 leading-none">Cronograma ENEM</h1>
            <p className="text-xs text-gray-500">Planejamento Personalizado</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {step < 4 && (
          <div className="mb-8">
            <StepIndicator current={step} total={3} labels={STEP_LABELS.slice(0, 3)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {step === 1 && (
            <Step1Hours
              profile={profile}
              onChange={setProfile}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2Goal
              profile={profile}
              onChange={setProfile}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step3Difficulty
              profile={profile}
              onChange={setProfile}
              onNext={handleGenerate}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && result && (
            <ScheduleView
              result={result}
              profile={profile}
              onReset={handleReset}
            />
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-gray-400">
          Cronograma gerado com base nas aulas da plataforma e no perfil do aluno.
        </footer>
      </main>
    </div>
  );
}
