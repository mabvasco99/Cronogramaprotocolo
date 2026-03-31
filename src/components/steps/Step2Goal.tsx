import { useState } from 'react';
import { StudentProfile, ENEMArea } from '../../types';
import { COURSES } from '../../data/courses';
import { AREA_LABELS } from '../../data/subjects';

const AREA_ORDER: ENEMArea[] = ['matematica', 'natureza', 'linguagens', 'humanas', 'redacao'];

const AREA_ICONS: Record<ENEMArea, string> = {
  matematica: '📐',
  natureza:   '🔬',
  linguagens: '📖',
  humanas:    '🌍',
  redacao:    '✍️',
};

const AREA_DESCRIPTIONS: Record<ENEMArea, string> = {
  matematica: 'Matemática — 1 prova inteira (45 questões)',
  natureza:   'Física, Química e Biologia',
  linguagens: 'Português, Literatura, Inglês',
  humanas:    'História, Geografia, Filosofia, Sociologia',
  redacao:    'Redação — 200 pts exclusivos (nota própria no ENEM)',
};

const WEIGHT_LABELS: Record<number, string> = {
  1: 'Peso 1 — Pouco cobrado',
  2: 'Peso 2 — Cobrado',
  3: 'Peso 3 — Médio',
  4: 'Peso 4 — Muito cobrado',
  5: 'Peso 5 — Altíssimo peso',
};

const DEFAULT_WEIGHTS: Record<ENEMArea, number> = {
  matematica: 2,
  natureza: 2,
  linguagens: 2,
  humanas: 2,
  redacao: 2,
};

interface Props {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Goal({ profile, onChange, onNext, onBack }: Props) {
  const [showPresets, setShowPresets] = useState(false);
  const [search, setSearch] = useState('');

  const weights = profile.customWeights ?? DEFAULT_WEIGHTS;

  function setWeight(area: ENEMArea, value: number) {
    onChange({
      ...profile,
      courseId: 'custom',
      customWeights: { ...weights, [area]: value } as Record<import('../../types').ENEMArea, number>,
    });
  }

  function applyPreset(courseId: string) {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return;
    onChange({
      ...profile,
      courseId: course.id,
      customWeights: { ...course.weights },
    });
    setShowPresets(false);
  }

  const filteredCourses = COURSES.filter(
    (c) =>
      c.id !== 'custom' &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.university ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const canProceed = true; // always valid since weights always have a default

  // Find if current weights match any preset (for display)
  const matchedPreset = COURSES.find(
    (c) =>
      c.id !== 'custom' &&
      c.weights.matematica === weights.matematica &&
      c.weights.natureza === weights.natureza &&
      c.weights.linguagens === weights.linguagens &&
      c.weights.humanas === weights.humanas
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Qual é o peso de cada área?</h2>
        <p className="mt-1 text-gray-500">
          Defina o peso de cada área do ENEM de acordo com o curso e universidade que você deseja entrar.
        </p>
      </div>

      {/* SISU tip */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <span className="text-2xl flex-shrink-0">💡</span>
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Dica: como descobrir os pesos da sua faculdade?</p>
          <p>
            Pesquise no Google:{' '}
            <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-xs">
              termo de adesão sisu + [nome do curso] + [nome da faculdade]
            </span>
          </p>
          <p className="mt-1 text-blue-600 text-xs">
            Ex: "termo de adesão sisu medicina UFRJ" — você vai encontrar o documento oficial com os pesos exatos!
          </p>
        </div>
      </div>

      {/* Manual weight sliders */}
      <div className="space-y-4">
        {AREA_ORDER.map((area) => {
          const w = weights[area];
          return (
            <div key={area} className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-brand-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{AREA_ICONS[area]}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{AREA_LABELS[area]}</p>
                    <p className="text-xs text-gray-400">{AREA_DESCRIPTIONS[area]}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-700 bg-brand-100 px-3 py-1 rounded-lg flex-shrink-0 ml-2">
                  Peso {w}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={w}
                onChange={(e) => setWeight(area, parseInt(e.target.value))}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 — Pouco cobrado</span>
                <span className="text-center text-gray-500 font-medium">{WEIGHT_LABELS[w]}</span>
                <span>5 — Altíssimo peso</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current weights summary */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 flex-wrap">
        <span className="text-sm text-gray-500 font-medium">Pesos configurados:</span>
        {AREA_ORDER.map((area) => (
          <span key={area} className="flex items-center gap-1 text-sm">
            <span>{AREA_ICONS[area]}</span>
            <span className="font-bold text-gray-700">{weights[area]}</span>
          </span>
        ))}
        {matchedPreset && (
          <span className="ml-auto text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
            ✓ Igual ao preset: {matchedPreset.name} {matchedPreset.university ? `— ${matchedPreset.university}` : ''}
          </span>
        )}
      </div>

      {/* Presets (collapsible) */}
      <div>
        <button
          onClick={() => setShowPresets((v) => !v)}
          className="flex items-center gap-2 text-sm text-brand-600 font-semibold hover:text-brand-800 transition-all"
        >
          <span>{showPresets ? '▲' : '▼'}</span>
          {showPresets ? 'Ocultar sugestões' : 'Ver sugestões de pesos por curso'}
        </button>

        {showPresets && (
          <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar curso... (ex: Medicina, Direito, Engenharia)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => applyPreset(course.id)}
                  className="w-full text-left px-4 py-3 hover:bg-brand-50 transition-all flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-medium text-gray-800 text-sm">{course.name}</span>
                    {course.university && (
                      <span className="ml-2 text-xs text-gray-500">({course.university})</span>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs text-gray-500 flex-shrink-0">
                    {AREA_ORDER.map((a) => (
                      <span key={a}>{AREA_ICONS[a]}<strong className="text-gray-700">{course.weights[a]}</strong></span>
                    ))}
                  </div>
                </button>
              ))}
              {filteredCourses.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-400">Nenhum curso encontrado.</p>
              )}
            </div>
          </div>
        )}
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
          disabled={!canProceed}
          className="flex-grow py-3 rounded-xl bg-brand-600 text-white font-semibold text-lg hover:bg-brand-700 shadow-md transition-all"
        >
          Próxima etapa →
        </button>
      </div>
    </div>
  );
}
