import { DayKey, StudentProfile } from '../../types';
import { getTotalWeeklyHours, weeksUntilENEM, getNextENEMDate } from '../../utils/scheduleGenerator';

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'seg', label: 'Segunda-feira' },
  { key: 'ter', label: 'Terça-feira'   },
  { key: 'qua', label: 'Quarta-feira'  },
  { key: 'qui', label: 'Quinta-feira'  },
  { key: 'sex', label: 'Sexta-feira'   },
  { key: 'sab', label: 'Sábado'        },
  { key: 'dom', label: 'Domingo'       },
];

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
  const enemWeeks = weeksUntilENEM();
  const enemDate = getNextENEMDate();
  const enemDateStr = enemDate.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  function setDay(key: DayKey, hours: number) {
    onChange({ ...profile, hoursPerDay: { ...profile.hoursPerDay, [key]: hours } });
  }

  function setWeeks(w: number) {
    const safe = Math.max(1, Math.min(60, w));
    onChange({ ...profile, weeksUntilExam: safe });
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

      {/* ENEM countdown banner */}
      <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <span className="text-3xl">🗓️</span>
        <div>
          <p className="text-sm font-semibold text-red-700">Próximo ENEM</p>
          <p className="text-lg font-bold text-red-900">{enemDateStr}</p>
          <p className="text-sm text-red-600">
            Faltam aproximadamente <strong>{enemWeeks} semanas</strong> para o ENEM!
          </p>
        </div>
      </div>

      {/* Daily hours grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DAYS.map(({ key, label }) => {
          const hours = profile.hoursPerDay[key] ?? 0;
          return (
            <div
              key={key}
              className={`rounded-xl border-2 p-4 transition-all
                ${hours > 0 ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">{label}</span>
                <span
                  className={`text-sm font-bold px-2 py-0.5 rounded-full
                    ${hours > 0 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {formatHours(hours)}
                </span>
              </div>
              <input
                type="range"
                min={0} max={8} step={0.5}
                value={hours}
                onChange={(e) => setDay(key, parseFloat(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0h</span><span>4h</span><span>8h</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border ${
        totalWeekly >= 15 ? 'bg-green-50 border-green-200' :
        totalWeekly >= 8  ? 'bg-blue-50 border-blue-200' :
        'bg-amber-50 border-amber-200'
      }`}>
        <div className="text-3xl">📊</div>
        <div>
          <p className={`text-sm font-medium ${totalWeekly >= 15 ? 'text-green-700' : totalWeekly >= 8 ? 'text-blue-700' : 'text-amber-700'}`}>
            Total semanal de estudos
          </p>
          <p className={`text-2xl font-bold ${totalWeekly >= 15 ? 'text-green-900' : totalWeekly >= 8 ? 'text-blue-900' : 'text-amber-900'}`}>
            {totalWeekly}h / semana
          </p>
        </div>
        <div className="ml-auto text-sm font-semibold">
          {totalWeekly >= 20 && <span className="text-green-600">Dedicação excelente! 🚀</span>}
          {totalWeekly >= 10 && totalWeekly < 20 && <span className="text-blue-600">Bom ritmo! 💪</span>}
          {totalWeekly > 0 && totalWeekly < 10 && <span className="text-amber-600">Tente aumentar um pouco 🔥</span>}
        </div>
      </div>

      {/* Weeks input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Por quantas semanas deseja o cronograma?
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeeks(profile.weeksUntilExam - 1)}
            className="w-10 h-10 rounded-xl border-2 border-gray-300 font-bold text-gray-600 hover:border-brand-400 transition-all flex items-center justify-center text-lg"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={60}
            value={profile.weeksUntilExam}
            onChange={(e) => setWeeks(parseInt(e.target.value) || 1)}
            className="flex-1 text-center text-2xl font-bold border-2 border-brand-400 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 text-brand-700"
          />
          <button
            onClick={() => setWeeks(profile.weeksUntilExam + 1)}
            className="w-10 h-10 rounded-xl border-2 border-gray-300 font-bold text-gray-600 hover:border-brand-400 transition-all flex items-center justify-center text-lg"
          >
            +
          </button>
          <span className="text-gray-600 font-medium">semanas</span>
        </div>

        {/* Quick presets based on ENEM */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { label: `Até o ENEM (${enemWeeks}sem)`, value: enemWeeks },
            { label: '12 semanas', value: 12 },
            { label: '24 semanas', value: 24 },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setWeeks(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all
                ${profile.weeksUntilExam === value
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-400'
                }`}
            >
              {label}
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
