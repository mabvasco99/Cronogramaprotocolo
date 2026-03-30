import { useState, useRef } from 'react';
import { ScheduleResult, StudentProfile } from '../../types';
import { COURSES } from '../../data/courses';
import { formatMinutes, getTotalWeeklyHours } from '../../utils/scheduleGenerator';
import SubjectSummary from './SubjectSummary';
import WeekView from './WeekView';

interface Props {
  result: ScheduleResult;
  profile: StudentProfile;
  onReset: () => void;
}

export default function ScheduleView({ result, profile, onReset }: Props) {
  const [weekIndex, setWeekIndex] = useState(0);
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const course = COURSES.find((c) => c.id === profile.courseId);
  const weeklyHours = getTotalWeeklyHours(profile.hoursPerDay);
  const currentWeek = result.weeks[weekIndex];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Header card */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">Seu Cronograma ENEM</h2>
            <p className="text-brand-200 mt-1">
              {course
                ? `${course.name}${course.university ? ` — ${course.university}` : ''}`
                : 'Personalizado'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl text-sm font-semibold transition-all"
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl text-sm font-semibold transition-all"
            >
              ✏️ Editar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="bg-white bg-opacity-15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{weeklyHours}h</div>
            <div className="text-xs text-brand-200">por semana</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{profile.weeksUntilExam}</div>
            <div className="text-xs text-brand-200">semanas de plano</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{result.weeks.length}</div>
            <div className="text-xs text-brand-200">semanas geradas</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">
              {formatMinutes(Object.values(result.totalMinutesPerSubject).reduce((a, b) => a + b, 0))}
            </div>
            <div className="text-xs text-brand-200">total de estudos</div>
          </div>
        </div>
      </div>

      {/* Subject distribution */}
      <SubjectSummary result={result} />

      {/* Weekly navigator */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-lg font-bold text-gray-800">Visualizar por Semana</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
              disabled={weekIndex === 0}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              ← Anterior
            </button>
            <select
              value={weekIndex}
              onChange={(e) => setWeekIndex(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              {result.weeks.map((w, i) => (
                <option key={i} value={i}>
                  Semana {w.weekNumber} — {new Date(w.startDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </option>
              ))}
            </select>
            <button
              onClick={() => setWeekIndex((i) => Math.min(result.weeks.length - 1, i + 1))}
              disabled={weekIndex === result.weeks.length - 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              Próxima →
            </button>
          </div>
        </div>

        {currentWeek && <WeekView week={currentWeek} />}
      </div>

      {/* All weeks toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowAllWeeks((v) => !v)}
          className="px-6 py-2.5 border-2 border-brand-400 text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-all"
        >
          {showAllWeeks ? '▲ Ocultar todas as semanas' : '▼ Ver cronograma completo'}
        </button>
      </div>

      {showAllWeeks && (
        <div className="space-y-8">
          {result.weeks.map((week, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <WeekView week={week} />
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-bold text-amber-900 mb-3">💡 Dicas para o seu cronograma</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• <strong>Matemática e Ciências</strong> estão com mais horas — são as matérias mais conteudistas. Não pule essas sessões!</li>
          <li>• <strong>Redação</strong> deve ser praticada toda semana com tema inédito. Use os temas sugeridos nas aulas.</li>
          <li>• A cada 2 semanas, faça uma revisão dos tópicos já estudados antes de avançar.</li>
          <li>• Nos fins de semana, prefira resolver questões antigas do ENEM para fixar o conteúdo.</li>
          <li>• Mantenha intervalos de 10 min a cada 50 min de estudo (Técnica Pomodoro).</li>
        </ul>
      </div>
    </div>
  );
}
