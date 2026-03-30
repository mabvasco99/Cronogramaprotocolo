import { useState } from 'react';
import { StudentProfile, ENEMArea } from '../../types';
import { COURSES } from '../../data/courses';
import { AREA_LABELS } from '../../data/subjects';

const AREA_ORDER: ENEMArea[] = ['natureza', 'matematica', 'linguagens', 'humanas'];

const AREA_ICONS: Record<ENEMArea, string> = {
  natureza:   '🔬',
  matematica: '📐',
  linguagens: '📖',
  humanas:    '🌍',
};

interface Props {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Goal({ profile, onChange, onNext, onBack }: Props) {
  const [search, setSearch] = useState('');

  const filteredCourses = COURSES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.university ?? '').toLowerCase().includes(search.toLowerCase())
  );

  function selectCourse(id: string) {
    const course = COURSES.find((c) => c.id === id);
    if (!course) return;
    onChange({
      ...profile,
      courseId: id,
      customWeights: id === 'custom' ? { ...course.weights } : null,
    });
  }

  function setCustomWeight(area: ENEMArea, value: number) {
    onChange({
      ...profile,
      customWeights: { ...(profile.customWeights ?? { natureza: 2, matematica: 2, linguagens: 2, humanas: 2 }), [area]: value },
    });
  }

  const activeWeights =
    profile.customWeights ??
    COURSES.find((c) => c.id === profile.courseId)?.weights ?? {
      natureza: 2, matematica: 2, linguagens: 2, humanas: 2,
    };

  const canProceed = !!profile.courseId;

  // Group courses by category
  const categories: { label: string; courses: typeof COURSES }[] = [
    { label: 'Medicina', courses: filteredCourses.filter((c) => c.name === 'Medicina') },
    { label: 'Engenharia', courses: filteredCourses.filter((c) => c.name.startsWith('Engenharia')) },
    { label: 'Ciências Exatas', courses: filteredCourses.filter((c) => ['Ciências da Computação', 'Matemática (Licenciatura)'].includes(c.name)) },
    { label: 'Saúde', courses: filteredCourses.filter((c) => ['Enfermagem', 'Farmácia', 'Odontologia'].includes(c.name)) },
    { label: 'Direito & Humanas', courses: filteredCourses.filter((c) => ['Direito', 'Psicologia', 'Pedagogia', 'História (Licenciatura)'].includes(c.name)) },
    { label: 'Negócios', courses: filteredCourses.filter((c) => ['Administração', 'Economia'].includes(c.name)) },
    { label: 'Personalizado', courses: filteredCourses.filter((c) => c.id === 'custom') },
  ].filter((cat) => cat.courses.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Qual é o seu objetivo?</h2>
        <p className="mt-1 text-gray-500">
          Selecione o curso desejado para que o cronograma priorize as áreas mais cobradas na seleção.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-700"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* Course list */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {categories.map((cat) => (
          <div key={cat.label}>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{cat.label}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cat.courses.map((course) => {
                const selected = profile.courseId === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => selectCourse(course.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all
                      ${selected
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 bg-white hover:border-brand-300'
                      }`}
                  >
                    <div className="font-semibold text-gray-800 text-sm">{course.name}</div>
                    {course.university && (
                      <div className="text-xs text-gray-500">{course.university}</div>
                    )}
                    {course.description && (
                      <div className="text-xs text-gray-400 mt-0.5">{course.description}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Weight preview / editor */}
      {canProceed && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            {profile.courseId === 'custom' ? 'Defina os pesos por área:' : 'Pesos por área do ENEM:'}
          </h3>
          <div className="space-y-3">
            {AREA_ORDER.map((area) => {
              const w = activeWeights[area];
              return (
                <div key={area} className="flex items-center gap-3">
                  <span className="text-lg w-7">{AREA_ICONS[area]}</span>
                  <span className="text-sm font-medium text-gray-700 w-44 flex-shrink-0">
                    {AREA_LABELS[area]}
                  </span>
                  {profile.courseId === 'custom' ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={w}
                        onChange={(e) => setCustomWeight(area, parseInt(e.target.value))}
                        className="flex-1 accent-brand-600"
                      />
                      <span className="w-12 text-center text-sm font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-lg">
                        Peso {w}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`h-3 rounded-full transition-all ${
                            dot <= w ? 'bg-brand-600' : 'bg-gray-200'
                          }`}
                          style={{ flex: 1 }}
                        />
                      ))}
                      <span className="ml-2 text-sm font-bold text-brand-700 w-12 text-center">
                        Peso {w}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:border-gray-400 transition-all"
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-3 rounded-xl text-white font-semibold text-lg transition-all
            ${canProceed
              ? 'bg-brand-600 hover:bg-brand-700 shadow-md'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Próxima etapa →
        </button>
      </div>
    </div>
  );
}
