import { CourseProfile } from '../types';

export const COURSES: CourseProfile[] = [
  // ── Medicina ──────────────────────────────────────────────
  {
    id: 'medicina_ufrj',
    name: 'Medicina',
    university: 'UFRJ',
    description: 'Peso alto em Natureza e Matemática',
    weights: { natureza: 4, matematica: 2, linguagens: 2, humanas: 1 },
  },
  {
    id: 'medicina_usp',
    name: 'Medicina',
    university: 'USP',
    description: 'Peso alto em Natureza e Matemática',
    weights: { natureza: 3, matematica: 3, linguagens: 2, humanas: 1 },
  },
  {
    id: 'medicina_unifesp',
    name: 'Medicina',
    university: 'UNIFESP',
    description: 'Distribuição equilibrada com foco em Natureza',
    weights: { natureza: 3, matematica: 2, linguagens: 2, humanas: 2 },
  },
  // ── Engenharia ────────────────────────────────────────────
  {
    id: 'engenharia_civil',
    name: 'Engenharia Civil',
    university: 'Geral',
    description: 'Foco em Matemática e Ciências Exatas',
    weights: { natureza: 3, matematica: 4, linguagens: 1, humanas: 1 },
  },
  {
    id: 'engenharia_computacao',
    name: 'Engenharia de Computação',
    university: 'Geral',
    description: 'Foco intenso em Matemática',
    weights: { natureza: 2, matematica: 4, linguagens: 1, humanas: 1 },
  },
  {
    id: 'engenharia_mecanica',
    name: 'Engenharia Mecânica',
    university: 'Geral',
    description: 'Peso alto em Física e Matemática',
    weights: { natureza: 3, matematica: 4, linguagens: 1, humanas: 1 },
  },
  // ── Ciências Exatas ───────────────────────────────────────
  {
    id: 'ciencias_computacao',
    name: 'Ciências da Computação',
    university: 'Geral',
    description: 'Foco em Matemática e Lógica',
    weights: { natureza: 2, matematica: 4, linguagens: 2, humanas: 1 },
  },
  {
    id: 'matematica_licenciatura',
    name: 'Matemática (Licenciatura)',
    university: 'Geral',
    description: 'Ênfase total em Matemática',
    weights: { natureza: 2, matematica: 4, linguagens: 2, humanas: 1 },
  },
  // ── Direito ───────────────────────────────────────────────
  {
    id: 'direito_usp',
    name: 'Direito',
    university: 'USP',
    description: 'Forte peso em Humanas e Linguagens',
    weights: { natureza: 1, matematica: 1, linguagens: 3, humanas: 4 },
  },
  {
    id: 'direito_geral',
    name: 'Direito',
    university: 'Geral',
    description: 'Ênfase em Humanas e Linguagens',
    weights: { natureza: 1, matematica: 1, linguagens: 3, humanas: 3 },
  },
  // ── Saúde ─────────────────────────────────────────────────
  {
    id: 'enfermagem',
    name: 'Enfermagem',
    university: 'Geral',
    description: 'Foco em Biologia e Química',
    weights: { natureza: 3, matematica: 2, linguagens: 2, humanas: 1 },
  },
  {
    id: 'farmacia',
    name: 'Farmácia',
    university: 'Geral',
    description: 'Ênfase em Química e Biologia',
    weights: { natureza: 3, matematica: 2, linguagens: 1, humanas: 1 },
  },
  {
    id: 'odontologia',
    name: 'Odontologia',
    university: 'Geral',
    description: 'Foco em Ciências da Natureza',
    weights: { natureza: 3, matematica: 2, linguagens: 2, humanas: 1 },
  },
  // ── Humanas ───────────────────────────────────────────────
  {
    id: 'psicologia',
    name: 'Psicologia',
    university: 'Geral',
    description: 'Equilíbrio entre Humanas e Linguagens',
    weights: { natureza: 2, matematica: 1, linguagens: 3, humanas: 3 },
  },
  {
    id: 'pedagogia',
    name: 'Pedagogia',
    university: 'Geral',
    description: 'Foco em Humanas e Linguagens',
    weights: { natureza: 1, matematica: 1, linguagens: 3, humanas: 3 },
  },
  {
    id: 'historia_licenciatura',
    name: 'História (Licenciatura)',
    university: 'Geral',
    description: 'Ênfase total em Humanas',
    weights: { natureza: 1, matematica: 1, linguagens: 2, humanas: 4 },
  },
  // ── Administração / Economia ──────────────────────────────
  {
    id: 'administracao',
    name: 'Administração',
    university: 'Geral',
    description: 'Equilíbrio com foco em Matemática',
    weights: { natureza: 1, matematica: 3, linguagens: 2, humanas: 2 },
  },
  {
    id: 'economia',
    name: 'Economia',
    university: 'Geral',
    description: 'Foco em Matemática e Humanas',
    weights: { natureza: 1, matematica: 3, linguagens: 2, humanas: 2 },
  },
  // ── Personalizado ─────────────────────────────────────────
  {
    id: 'custom',
    name: 'Personalizado',
    description: 'Defina seus próprios pesos por área',
    weights: { natureza: 2, matematica: 2, linguagens: 2, humanas: 2 },
  },
];

export const COURSE_MAP: Record<string, CourseProfile> = Object.fromEntries(
  COURSES.map((c) => [c.id, c])
);
