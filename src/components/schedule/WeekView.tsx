import { WeeklySchedule, DaySchedule, ScheduleBlock } from '../../types';
import { formatMinutes } from '../../utils/scheduleGenerator';

const DAY_SHORT: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom',
};

function BlockCard({ block }: { block: ScheduleBlock }) {
  return (
    <div className={`rounded-lg p-2 mb-2 last:mb-0 border-l-4 bg-gray-50 ${block.borderColor}`}>
      {/* Subject header */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm flex-shrink-0">{block.icon}</span>
        <span className="font-bold text-gray-800 text-xs flex-shrink-0">{block.shortName}</span>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${block.bgColor} ${block.textColor}`}>
          {formatMinutes(block.durationMinutes)}
        </span>
      </div>
      {/* Lessons list */}
      {block.lessons.length > 0 && (
        <ul className="space-y-1">
          {block.lessons.map((lesson) => (
            <li key={lesson.id} className="flex items-start gap-1">
              <span className="text-gray-400 flex-shrink-0 text-xs mt-0.5">▸</span>
              <span className="text-xs text-gray-600 leading-snug">{lesson.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DayColumn({ day }: { day: DaySchedule }) {
  const isRest = day.totalMinutes === 0;
  return (
    <div
      className={`rounded-xl border flex-shrink-0 overflow-hidden
        ${isRest ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'}
      `}
      style={{ minWidth: '160px', width: '160px' }}
    >
      {/* Header */}
      <div className={`px-3 py-2 ${isRest ? 'bg-gray-100' : 'bg-gray-800'}`}>
        <div className={`font-bold text-sm ${isRest ? 'text-gray-400' : 'text-white'}`}>
          {DAY_SHORT[day.dayKey]}
        </div>
        <div className={`text-xs ${isRest ? 'text-gray-400' : 'text-gray-300'}`}>
          {isRest ? 'Folga' : formatMinutes(day.totalMinutes)}
        </div>
      </div>

      {/* Blocks */}
      <div className="p-2 min-h-[80px]">
        {isRest ? (
          <div className="flex items-center justify-center h-16 text-2xl">😴</div>
        ) : (
          day.blocks.map((block) => <BlockCard key={block.subjectId} block={block} />)
        )}
      </div>
    </div>
  );
}

interface Props {
  week: WeeklySchedule;
}

export default function WeekView({ week }: Props) {
  const studyDays = week.days.filter((d) => d.totalMinutes > 0).length;
  const totalWeekMinutes = week.days.reduce((sum, d) => sum + d.totalMinutes, 0);

  return (
    <div>
      <div className="mb-3">
        <h3 className="font-bold text-gray-800">Semana {week.weekNumber}</h3>
        <p className="text-sm text-gray-500">
          {new Date(week.startDate + 'T12:00:00').toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short',
          })}{' '}
          — {studyDays} dias de estudo · {formatMinutes(totalWeekMinutes)}
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {week.days.map((day) => (
            <DayColumn key={day.dayKey} day={day} />
          ))}
        </div>
      </div>

      {/* Scroll hint on mobile */}
      <p className="text-xs text-gray-400 mt-1 sm:hidden text-center">
        ← deslize para ver todos os dias →
      </p>
    </div>
  );
}
