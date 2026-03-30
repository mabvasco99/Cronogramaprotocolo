import { ScheduleResult } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { formatMinutes } from '../../utils/scheduleGenerator';

interface Props {
  result: ScheduleResult;
}

export default function SubjectSummary({ result }: Props) {
  const { subjectWeights, totalMinutesPerSubject } = result;

  // Sort subjects by total time descending
  const sorted = SUBJECTS
    .map((s) => ({
      ...s,
      weight: subjectWeights[s.id] ?? 0,
      totalMinutes: totalMinutesPerSubject[s.id] ?? 0,
    }))
    .filter((s) => s.totalMinutes > 0)
    .sort((a, b) => b.weight - a.weight);

  const maxMinutes = Math.max(...sorted.map((s) => s.totalMinutes));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Distribuição por Matéria</h3>
      <p className="text-sm text-gray-500 mb-4">
        Tempo total acumulado ao longo de todo o plano de estudos
      </p>

      <div className="space-y-3">
        {sorted.map((subject) => {
          const pct = maxMinutes > 0 ? (subject.totalMinutes / maxMinutes) * 100 : 0;
          const weightPct = Math.round(subject.weight * 100);
          return (
            <div key={subject.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{subject.icon}</span>
                  <span className="font-medium text-gray-700">{subject.name}</span>
                  <span className="text-xs text-gray-400">({weightPct}% do tempo semanal)</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {formatMinutes(subject.totalMinutes)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${subject.bgColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
