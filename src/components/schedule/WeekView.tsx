import { WeeklySchedule, DaySchedule, ScheduleBlock } from '../../types';
import { formatMinutes } from '../../utils/scheduleGenerator';

const DAY_SHORT: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom',
};

function SessionCard({ block }: { block: ScheduleBlock }) {
  return (
    <div className={`rounded-xl border-2 overflow-hidden mb-2 last:mb-0 ${block.borderColor}`}>
      {/* Subject header */}
      <div className={`px-3 py-2 flex items-center gap-2 ${block.bgColor}`}>
        <span className="text-base">{block.icon}</span>
        <span className={`font-bold text-sm flex-1 ${block.textColor}`}>{block.subjectName}</span>
        <span className={`text-xs font-semibold ${block.textColor} opacity-80`}>
          {formatMinutes(block.durationMinutes)}
        </span>
      </div>

      {/* Teoria row */}
      <div className="flex items-start gap-2 px-3 py-2 border-b border-gray-100 bg-white">
        <span className="text-sm flex-shrink-0 mt-0.5">📺</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-700 mb-0.5">
            Teoria — {formatMinutes(block.teoriaMinutes)}
          </div>
          {block.lesson ? (
            <a
              href={block.lesson.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:text-brand-800 hover:underline leading-snug block"
            >
              {block.lesson.title}
            </a>
          ) : (
            <div className="text-xs text-gray-400">Aula da plataforma</div>
          )}
        </div>
      </div>

      {/* Exercícios row */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50">
        <span className="text-sm flex-shrink-0">✏️</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-700">
            Exercícios — {formatMinutes(block.exerciciosMinutes)}
          </div>
          <div className="text-xs text-gray-400">Lista de questões da plataforma</div>
        </div>
      </div>
    </div>
  );
}

function DayColumn({ day }: { day: DaySchedule }) {
  const isRest = day.totalMinutes === 0;
  const dayTotal = day.blocks.reduce((s, b) => s + b.durationMinutes, 0);

  return (
    <div
      className={`rounded-xl border flex-shrink-0 overflow-hidden
        ${isRest ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'}`}
      style={{ minWidth: '200px', width: '200px' }}
    >
      {/* Header */}
      <div className={`px-3 py-2 ${isRest ? 'bg-gray-100' : 'bg-gray-800'}`}>
        <div className={`font-bold text-sm ${isRest ? 'text-gray-400' : 'text-white'}`}>
          {DAY_SHORT[day.dayKey]}
        </div>
        <div className={`text-xs ${isRest ? 'text-gray-400' : 'text-gray-300'}`}>
          {isRest ? 'Folga' : `${day.blocks.length} ${day.blocks.length === 1 ? 'matéria' : 'matérias'} · ${formatMinutes(dayTotal)}`}
        </div>
      </div>

      {/* Sessions */}
      <div className="p-2 min-h-[60px]">
        {isRest ? (
          <div className="flex items-center justify-center h-16 text-2xl">😴</div>
        ) : day.blocks.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-xs text-gray-400">
            Sem sessões esta semana
          </div>
        ) : (
          day.blocks.map((block) => (
            <SessionCard key={block.subjectId} block={block} />
          ))
        )}
      </div>
    </div>
  );
}

interface Props {
  week: WeeklySchedule;
}

export default function WeekView({ week }: Props) {
  const studyDays = week.days.filter((d) => d.totalMinutes > 0 && d.blocks.length > 0).length;
  const totalSessions = week.days.reduce((s, d) => s + d.blocks.length, 0);
  const totalMinutes = week.days.reduce(
    (s, d) => s + d.blocks.reduce((ss, b) => ss + b.durationMinutes, 0), 0
  );

  return (
    <div>
      <div className="mb-3">
        <h3 className="font-bold text-gray-800">Semana {week.weekNumber}</h3>
        <p className="text-sm text-gray-500">
          {new Date(week.startDate + 'T12:00:00').toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short',
          })}
          {' '}— {studyDays} dias · {totalSessions} sessões · {formatMinutes(totalMinutes)}
        </p>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {week.days.map((day) => (
            <DayColumn key={day.dayKey} day={day} />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-1 sm:hidden text-center">
        ← deslize para ver todos os dias →
      </p>
    </div>
  );
}
