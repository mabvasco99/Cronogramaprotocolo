import { DayKey, StudentProfile } from '../../types';
import { getTotalWeeklyHours } from '../../utils/scheduleGenerator';

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'seg', label: 'Segunda-feira', short: 'Seg' },
  { key: 'ter', label: 'Terça-feira',   short: 'Ter' },
  { key: 'qua', label: 'Quarta-feira',  short: 'Qua' },
  { key: 'qui', label: 'Quinta-feira',  short: 'Qui' },
  { key: 'sex', label: 'Sexta-feira',   short: 'Sex' },
  { key: 'sab', label: 'Sábado',        short: 'Sáb' },
  { key: 'dom', label: 'Domingo',       short: 'Dom' },
];

const HOUR_OPTIONS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8];

interface Props {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onNext: () => void;
}

function formatHours(h: number) {
  if (h === 0) return 'Folga';
  if (h < 1) return `${h * 60}min`;
  if (h % 1 === 0) return `${h}h`;
  return `${Math.floor(h)}h30min`;
}

export default function Step1Hours({ profile, onChange, onNext }: Props) {
  const totalWeekly = getTotalWeeklyHours(profile.hoursPerDay);

  function setDay(key: DayKey, hours: number) {
    onChange({ ...profile, hoursPerDay: { ...profile.hoursPerDay, [key]: hours } });
  }

  function setWeeks(weeks: number) {
    onChange({ ...profile, weeksUntilExam: weeks });
  }

  const canProceed = totalWeekly >= 1;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Quanto tempo você tem para estudar?</h2>
        <p className="mt-1 text-gray-500">
          Configure as horas disponíveis por dia. Coloque zero nos dias de descanso.
        </p>
      </div>

      {/* Daily hours grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DAYS.map(({ key, label, short }) => {
          const hours = profile.hoursPerDay[key] ?? 0;
          return (
            <div
              key={key}
              className={`rounded-xl border-2 p-4 transition-all
                ${hours > 0
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-gray-200 bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-semibold text-gray-800">{label}</span>
                  <span className="ml-2 text-xs text-gray-400 uppercase tracking-wide">({short})</span>
                </div>
                <span
                  className={`text-sm font-bold px-2 py-0.5 rounded-full
                    ${hours > 0 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {formatHours(hours)}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={8}
                step={0.5}
                value={hours}
                onChange={(e) => setDay(key, parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />

              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0h</span>
                <span>4h</span>
                <span>8h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="text-3xl">📊</div>
        <div>
          <p className="text-sm text-blue-700 font-medium">Total semanal de estudos</p>
          <p className="text-2xl font-bold text-blue-900">{totalWeekly}h / semana</p>
        </div>
        {totalWeekly >= 20 && (
          <div className="ml-auto text-green-600 font-semibold text-sm">
            Ótima dedicação! 🚀
          </div>
        )}
        {totalWeekly > 0 && totalWeekly < 10 && (
          <div className="ml-auto text-amber-600 font-semibold text-sm">
            Considere aumentar um pouco 💪
          </div>
        )}
      </div>

      {/* Weeks until exam */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Quantas semanas até o ENEM?
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {[4, 8, 12, 16, 20, 24, 30, 36, 40, 48].map((w) => (
            <button
              key={w}
              onClick={() => setWeeks(w)}
              className={`py-2 rounded-lg border-2 text-sm font-semibold transition-all
                ${profile.weeksUntilExam === w
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-400'
                }`}
            >
              {w} sem.
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all
          ${canProceed
            ? 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'
            : 'bg-gray-300 cursor-not-allowed'
          }`}
      >
        Próxima etapa →
      </button>
      {!canProceed && (
        <p className="text-center text-sm text-red-500">
          Configure pelo menos 1 hora de estudo por semana para continuar.
        </p>
      )}
    </div>
  );
}
