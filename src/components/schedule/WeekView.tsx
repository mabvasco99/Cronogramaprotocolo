import { WeeklySchedule, DaySchedule, ScheduleBlock } from '../../types';
import { formatMinutes } from '../../utils/scheduleGenerator';

const DAY_SHORT: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom',
};

function BlockCard({ block }: { block: ScheduleBlock }) {
  return (
    <div
      className={`rounded-lg p-2.5 mb-1.5 last:mb-0 border-l-4 bg-opacity-10 ${block.borderColor}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{block.icon}</span>
          <span className="font-semibold text-gray-800 text-xs">{block.shortName}</span>
        </div>
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${block.bgColor} ${block.textColor}`}>
          {formatMinutes(block.durationMinutes)}
        </span>
      </div>
      {block.lessons.length > 0 && (
        <ul className="space-y-0.5">
          {block.lessons.map((lesson) => (
            <li key={lesson.id} className="text-xs text-gray-600 flex items-start gap-1">
              <span className="text-gray-400 flex-shrink-0 mt-0.5">▸</span>
              <span className="leading-snug">{lesson.title}</span>
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
    <div className={`rounded-xl border ${isRest ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'} overflow-hidden`}>
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
          <div className="flex flex-col items-center justify-center h-20 text-gray-300 text-2xl">
            😴
          </div>
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-800">Semana {week.weekNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(week.startDate + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short',
            })}{' '}
            — {studyDays} dias de estudo · {formatMinutes(totalWeekMinutes)}
          </p>
        </div>
      </div>

      {/* 7-column grid for desktop, 2-col for mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {week.days.map((day) => (
          <DayColumn key={day.dayKey} day={day} />
        ))}
      </div>
    </div>
  );
}
