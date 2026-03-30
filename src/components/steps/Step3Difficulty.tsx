import { StudentProfile } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { AREA_LABELS } from '../../data/subjects';

const DIFFICULTY_LABELS = ['', 'Muito Fácil', 'Fácil', 'Normal', 'Difícil', 'Muito Difícil'];
const DIFFICULTY_COLORS = ['', 'bg-green-500', 'bg-lime-500', 'bg-yellow-400', 'bg-orange-500', 'bg-red-500'];
const DIFFICULTY_EMOJI = ['', '😊', '🙂', '😐', '😤', '😰'];

interface Props {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Difficulty({ profile, onChange, onNext, onBack }: Props) {
  function setDifficulty(subjectId: string, value: number) {
    onChange({
      ...profile,
      difficultyRatings: { ...profile.difficultyRatings, [subjectId]: value },
    });
  }

  // Group subjects by area
  const areas = ['matematica', 'natureza', 'linguagens', 'humanas'] as const;

  const subjectsByArea = areas.map((area) => ({
    area,
    label: AREA_LABELS[area],
    subjects: SUBJECTS.filter((s) => s.area === area),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Como estão suas dificuldades?</h2>
        <p className="mt-1 text-gray-500">
          Avalie cada matéria de 1 (fácil) a 5 (muito difícil). Matérias mais difíceis receberão
          mais tempo no cronograma.
        </p>
        <div className="mt-2 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <span>⚡</span>
          <span>
            <strong>Matemática e Ciências da Natureza</strong> já possuem um bônus de prioridade
            aplicado automaticamente por serem mais conteudistas e desafiadoras.
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {subjectsByArea.map(({ area, label, subjects }) => (
          <div key={area}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              {label}
            </h3>
            <div className="space-y-3">
              {subjects.map((subject) => {
                const difficulty = profile.difficultyRatings[subject.id] ?? 3;
                return (
                  <div
                    key={subject.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200"
                  >
                    <span className="text-xl w-8 flex-shrink-0">{subject.icon}</span>
                    <div className="w-36 flex-shrink-0">
                      <span className="font-semibold text-gray-800 text-sm">{subject.name}</span>
                    </div>

                    {/* Rating buttons */}
                    <div className="flex gap-1.5 flex-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          onClick={() => setDifficulty(subject.id, v)}
                          title={DIFFICULTY_LABELS[v]}
                          className={`flex-1 h-8 rounded-lg border-2 text-xs font-bold transition-all
                            ${difficulty === v
                              ? `${DIFFICULTY_COLORS[v]} text-white border-transparent scale-105`
                              : 'bg-gray-100 border-gray-200 text-gray-400 hover:border-gray-400'
                            }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>

                    {/* Current label */}
                    <div className="hidden sm:flex items-center gap-1 w-28 flex-shrink-0 text-sm">
                      <span>{DIFFICULTY_EMOJI[difficulty]}</span>
                      <span className="text-gray-600 text-xs">{DIFFICULTY_LABELS[difficulty]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick set all */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 mb-2 font-medium">Definir todas as matérias como:</p>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => {
                const ratings: Record<string, number> = {};
                SUBJECTS.forEach((s) => { ratings[s.id] = v; });
                onChange({ ...profile, difficultyRatings: ratings });
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 ${DIFFICULTY_COLORS[v]}`}
            >
              {DIFFICULTY_EMOJI[v]} {DIFFICULTY_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:border-gray-400 transition-all"
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          className="flex-2 flex-grow py-3 rounded-xl bg-brand-600 text-white font-semibold text-lg hover:bg-brand-700 shadow-md transition-all"
        >
          Gerar Cronograma 🚀
        </button>
      </div>
    </div>
  );
}
