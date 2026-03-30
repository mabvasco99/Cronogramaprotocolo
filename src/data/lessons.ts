import { Lesson } from '../types';

/**
 * Sample platform lessons for each subject.
 * In a real integration, this would come from the platform's API.
 * Each lesson has an estimated duration used for scheduling.
 */
export const LESSONS: Lesson[] = [
  // ── MATEMÁTICA ────────────────────────────────────────────────────────────
  { id: 'mat-01', subjectId: 'matematica', order: 1,  topic: 'Álgebra',           title: 'Expressões Algébricas e Fatoração',         durationMinutes: 60 },
  { id: 'mat-02', subjectId: 'matematica', order: 2,  topic: 'Álgebra',           title: 'Equações do 1º Grau e Sistemas',             durationMinutes: 60 },
  { id: 'mat-03', subjectId: 'matematica', order: 3,  topic: 'Álgebra',           title: 'Equações do 2º Grau — Bhaskara',             durationMinutes: 60 },
  { id: 'mat-04', subjectId: 'matematica', order: 4,  topic: 'Funções',           title: 'Funções: Conceitos e Domínio',               durationMinutes: 60 },
  { id: 'mat-05', subjectId: 'matematica', order: 5,  topic: 'Funções',           title: 'Função Afim e Quadrática',                   durationMinutes: 60 },
  { id: 'mat-06', subjectId: 'matematica', order: 6,  topic: 'Funções',           title: 'Função Exponencial e Logarítmica',           durationMinutes: 60 },
  { id: 'mat-07', subjectId: 'matematica', order: 7,  topic: 'Funções',           title: 'Funções Trigonométricas',                    durationMinutes: 60 },
  { id: 'mat-08', subjectId: 'matematica', order: 8,  topic: 'Geometria Plana',   title: 'Triângulos: Propriedades e Semelhança',      durationMinutes: 60 },
  { id: 'mat-09', subjectId: 'matematica', order: 9,  topic: 'Geometria Plana',   title: 'Círculo, Circunferência e Áreas',            durationMinutes: 60 },
  { id: 'mat-10', subjectId: 'matematica', order: 10, topic: 'Geometria Espacial','title': 'Prismas, Pirâmides e Poliedros',            durationMinutes: 60 },
  { id: 'mat-11', subjectId: 'matematica', order: 11, topic: 'Geometria Espacial','title': 'Cilindro, Cone e Esfera',                  durationMinutes: 60 },
  { id: 'mat-12', subjectId: 'matematica', order: 12, topic: 'Trigonometria',     title: 'Trigonometria no Triângulo Retângulo',       durationMinutes: 60 },
  { id: 'mat-13', subjectId: 'matematica', order: 13, topic: 'Trigonometria',     title: 'Lei dos Senos e Cosenos',                    durationMinutes: 60 },
  { id: 'mat-14', subjectId: 'matematica', order: 14, topic: 'Estatística',       title: 'Medidas de Tendência Central',               durationMinutes: 60 },
  { id: 'mat-15', subjectId: 'matematica', order: 15, topic: 'Estatística',       title: 'Probabilidade e Combinatória',               durationMinutes: 60 },
  { id: 'mat-16', subjectId: 'matematica', order: 16, topic: 'Matrizes',          title: 'Matrizes, Determinantes e Sistemas',         durationMinutes: 60 },
  { id: 'mat-17', subjectId: 'matematica', order: 17, topic: 'Progressões',       title: 'PA e PG — Sequências Numéricas',             durationMinutes: 60 },
  { id: 'mat-18', subjectId: 'matematica', order: 18, topic: 'Revisão ENEM',      title: 'Questões Comentadas de Matemática',          durationMinutes: 90 },

  // ── FÍSICA ────────────────────────────────────────────────────────────────
  { id: 'fis-01', subjectId: 'fisica', order: 1,  topic: 'Mecânica',         title: 'Cinemática: MRU e MRUV',                    durationMinutes: 60 },
  { id: 'fis-02', subjectId: 'fisica', order: 2,  topic: 'Mecânica',         title: 'Leis de Newton e Dinâmica',                 durationMinutes: 60 },
  { id: 'fis-03', subjectId: 'fisica', order: 3,  topic: 'Mecânica',         title: 'Trabalho, Energia e Potência',              durationMinutes: 60 },
  { id: 'fis-04', subjectId: 'fisica', order: 4,  topic: 'Mecânica',         title: 'Quantidade de Movimento e Colisões',        durationMinutes: 60 },
  { id: 'fis-05', subjectId: 'fisica', order: 5,  topic: 'Mecânica',         title: 'Gravitação Universal',                      durationMinutes: 60 },
  { id: 'fis-06', subjectId: 'fisica', order: 6,  topic: 'Termodinâmica',    title: 'Termologia: Temperatura e Calor',           durationMinutes: 60 },
  { id: 'fis-07', subjectId: 'fisica', order: 7,  topic: 'Termodinâmica',    title: 'Leis da Termodinâmica',                     durationMinutes: 60 },
  { id: 'fis-08', subjectId: 'fisica', order: 8,  topic: 'Ondas e Som',      title: 'Ondas Mecânicas, Som e Luz',                durationMinutes: 60 },
  { id: 'fis-09', subjectId: 'fisica', order: 9,  topic: 'Óptica',           title: 'Reflexão e Refração da Luz',                durationMinutes: 60 },
  { id: 'fis-10', subjectId: 'fisica', order: 10, topic: 'Eletrostática',    title: 'Carga Elétrica, Lei de Coulomb e Campo',    durationMinutes: 60 },
  { id: 'fis-11', subjectId: 'fisica', order: 11, topic: 'Eletrodinâmica',   title: 'Corrente Elétrica e Resistência',           durationMinutes: 60 },
  { id: 'fis-12', subjectId: 'fisica', order: 12, topic: 'Eletrodinâmica',   title: 'Circuitos Elétricos e Potência',            durationMinutes: 60 },
  { id: 'fis-13', subjectId: 'fisica', order: 13, topic: 'Magnetismo',       title: 'Campo Magnético e Indução Eletromagnética', durationMinutes: 60 },
  { id: 'fis-14', subjectId: 'fisica', order: 14, topic: 'Física Moderna',   title: 'Relatividade e Efeito Fotoelétrico',        durationMinutes: 60 },
  { id: 'fis-15', subjectId: 'fisica', order: 15, topic: 'Revisão ENEM',     title: 'Questões Comentadas de Física',             durationMinutes: 90 },

  // ── QUÍMICA ───────────────────────────────────────────────────────────────
  { id: 'qui-01', subjectId: 'quimica', order: 1,  topic: 'Química Geral',   title: 'Estrutura Atômica e Tabela Periódica',      durationMinutes: 60 },
  { id: 'qui-02', subjectId: 'quimica', order: 2,  topic: 'Química Geral',   title: 'Ligações Químicas e Polaridade',            durationMinutes: 60 },
  { id: 'qui-03', subjectId: 'quimica', order: 3,  topic: 'Química Geral',   title: 'Funções Inorgânicas: Ácidos e Bases',       durationMinutes: 60 },
  { id: 'qui-04', subjectId: 'quimica', order: 4,  topic: 'Química Geral',   title: 'Sais e Óxidos',                             durationMinutes: 60 },
  { id: 'qui-05', subjectId: 'quimica', order: 5,  topic: 'Estequiometria',  title: 'Estequiometria e Cálculo Químico',          durationMinutes: 60 },
  { id: 'qui-06', subjectId: 'quimica', order: 6,  topic: 'Fisico-Química', 'title': 'Termoquímica e Entalpia',                  durationMinutes: 60 },
  { id: 'qui-07', subjectId: 'quimica', order: 7,  topic: 'Fisico-Química', 'title': 'Cinética Química e Equilíbrio',            durationMinutes: 60 },
  { id: 'qui-08', subjectId: 'quimica', order: 8,  topic: 'Fisico-Química', 'title': 'Soluções e Propriedades Coligativas',      durationMinutes: 60 },
  { id: 'qui-09', subjectId: 'quimica', order: 9,  topic: 'Fisico-Química', 'title': 'Eletroquímica: Pilhas e Eletrólise',       durationMinutes: 60 },
  { id: 'qui-10', subjectId: 'quimica', order: 10, topic: 'Org. Básica',    'title': 'Fundamentos de Química Orgânica',          durationMinutes: 60 },
  { id: 'qui-11', subjectId: 'quimica', order: 11, topic: 'Org. Funções',   'title': 'Funções Orgânicas: Hidrocarbonetos',       durationMinutes: 60 },
  { id: 'qui-12', subjectId: 'quimica', order: 12, topic: 'Org. Funções',   'title': 'Álcoois, Éteres, Ácidos Carboxílicos',     durationMinutes: 60 },
  { id: 'qui-13', subjectId: 'quimica', order: 13, topic: 'Org. Reações',   'title': 'Reações Orgânicas: Adição e Substituição', durationMinutes: 60 },
  { id: 'qui-14', subjectId: 'quimica', order: 14, topic: 'Química Ambiental','title': 'Polímeros, Combustíveis e Meio Ambiente', durationMinutes: 60 },
  { id: 'qui-15', subjectId: 'quimica', order: 15, topic: 'Revisão ENEM',   'title': 'Questões Comentadas de Química',           durationMinutes: 90 },

  // ── BIOLOGIA ──────────────────────────────────────────────────────────────
  { id: 'bio-01', subjectId: 'biologia', order: 1,  topic: 'Citologia',      title: 'Célula: Estrutura e Organelas',             durationMinutes: 60 },
  { id: 'bio-02', subjectId: 'biologia', order: 2,  topic: 'Citologia',      title: 'Divisão Celular: Mitose e Meiose',          durationMinutes: 60 },
  { id: 'bio-03', subjectId: 'biologia', order: 3,  topic: 'Genética',       title: 'Hereditariedade e Leis de Mendel',          durationMinutes: 60 },
  { id: 'bio-04', subjectId: 'biologia', order: 4,  topic: 'Genética',       title: 'Herança Ligada ao Sexo e Mutações',         durationMinutes: 60 },
  { id: 'bio-05', subjectId: 'biologia', order: 5,  topic: 'Genética',       title: 'DNA, RNA e Síntese Proteica',               durationMinutes: 60 },
  { id: 'bio-06', subjectId: 'biologia', order: 6,  topic: 'Evolução',       title: 'Teorias Evolutivas e Seleção Natural',      durationMinutes: 60 },
  { id: 'bio-07', subjectId: 'biologia', order: 7,  topic: 'Ecologia',       title: 'Ecossistemas e Cadeias Alimentares',        durationMinutes: 60 },
  { id: 'bio-08', subjectId: 'biologia', order: 8,  topic: 'Ecologia',       title: 'Ciclos Biogeoquímicos e Biomas',            durationMinutes: 60 },
  { id: 'bio-09', subjectId: 'biologia', order: 9,  topic: 'Fisiologia',     title: 'Sistema Digestório e Respiratório',         durationMinutes: 60 },
  { id: 'bio-10', subjectId: 'biologia', order: 10, topic: 'Fisiologia',     title: 'Sistema Circulatório e Imunológico',        durationMinutes: 60 },
  { id: 'bio-11', subjectId: 'biologia', order: 11, topic: 'Fisiologia',     title: 'Sistema Nervoso e Endócrino',               durationMinutes: 60 },
  { id: 'bio-12', subjectId: 'biologia', order: 12, topic: 'Botânica',       title: 'Plantas: Reprodução e Fisiologia Vegetal',  durationMinutes: 60 },
  { id: 'bio-13', subjectId: 'biologia', order: 13, topic: 'Zoologia',       title: 'Animais Invertebrados e Vertebrados',       durationMinutes: 60 },
  { id: 'bio-14', subjectId: 'biologia', order: 14, topic: 'Revisão ENEM',   title: 'Questões Comentadas de Biologia',           durationMinutes: 90 },

  // ── LÍNGUA PORTUGUESA ─────────────────────────────────────────────────────
  { id: 'por-01', subjectId: 'portugues', order: 1,  topic: 'Interpretação',  title: 'Leitura e Interpretação de Textos',        durationMinutes: 60 },
  { id: 'por-02', subjectId: 'portugues', order: 2,  topic: 'Interpretação',  title: 'Gêneros Textuais e Tipologia',              durationMinutes: 60 },
  { id: 'por-03', subjectId: 'portugues', order: 3,  topic: 'Gramática',      title: 'Morfologia: Classes de Palavras',           durationMinutes: 60 },
  { id: 'por-04', subjectId: 'portugues', order: 4,  topic: 'Gramática',      title: 'Sintaxe: Orações e Períodos',               durationMinutes: 60 },
  { id: 'por-05', subjectId: 'portugues', order: 5,  topic: 'Gramática',      title: 'Concordância Verbal e Nominal',             durationMinutes: 60 },
  { id: 'por-06', subjectId: 'portugues', order: 6,  topic: 'Gramática',      title: 'Regência e Crase',                          durationMinutes: 60 },
  { id: 'por-07', subjectId: 'portugues', order: 7,  topic: 'Gramática',      title: 'Pontuação e Ortografia',                    durationMinutes: 60 },
  { id: 'por-08', subjectId: 'portugues', order: 8,  topic: 'Revisão ENEM',   title: 'Questões Comentadas de Português',          durationMinutes: 90 },

  // ── REDAÇÃO ───────────────────────────────────────────────────────────────
  { id: 'red-01', subjectId: 'redacao', order: 1,  topic: 'Estrutura',        title: 'Estrutura da Redação ENEM',                durationMinutes: 60 },
  { id: 'red-02', subjectId: 'redacao', order: 2,  topic: 'Estrutura',        title: 'Introdução: Tese e Contextualização',       durationMinutes: 60 },
  { id: 'red-03', subjectId: 'redacao', order: 3,  topic: 'Argumentação',     title: 'Desenvolvimento: Argumentos e Evidências',  durationMinutes: 60 },
  { id: 'red-04', subjectId: 'redacao', order: 4,  topic: 'Argumentação',     title: 'Conclusão com Proposta de Intervenção',     durationMinutes: 60 },
  { id: 'red-05', subjectId: 'redacao', order: 5,  topic: 'Competências',     title: 'Coesão e Coerência Textual',                durationMinutes: 60 },
  { id: 'red-06', subjectId: 'redacao', order: 6,  topic: 'Prática',          title: 'Prática: Redação com Tema de Direitos',     durationMinutes: 90 },
  { id: 'red-07', subjectId: 'redacao', order: 7,  topic: 'Prática',          title: 'Prática: Redação com Tema Ambiental',       durationMinutes: 90 },
  { id: 'red-08', subjectId: 'redacao', order: 8,  topic: 'Prática',          title: 'Prática: Redação com Tema Social',          durationMinutes: 90 },

  // ── LITERATURA ────────────────────────────────────────────────────────────
  { id: 'lit-01', subjectId: 'literatura', order: 1,  topic: 'Estilos',       title: 'Trovadorismo e Humanismo',                 durationMinutes: 50 },
  { id: 'lit-02', subjectId: 'literatura', order: 2,  topic: 'Estilos',       title: 'Classicismo e Barroco',                     durationMinutes: 50 },
  { id: 'lit-03', subjectId: 'literatura', order: 3,  topic: 'Estilos',       title: 'Arcadismo e Romantismo',                    durationMinutes: 50 },
  { id: 'lit-04', subjectId: 'literatura', order: 4,  topic: 'Estilos',       title: 'Realismo, Naturalismo e Parnasianismo',     durationMinutes: 50 },
  { id: 'lit-05', subjectId: 'literatura', order: 5,  topic: 'Estilos',       title: 'Simbolismo e Pré-Modernismo',               durationMinutes: 50 },
  { id: 'lit-06', subjectId: 'literatura', order: 6,  topic: 'Modernismo',    title: 'Modernismo: 1ª e 2ª Fases',                durationMinutes: 50 },
  { id: 'lit-07', subjectId: 'literatura', order: 7,  topic: 'Modernismo',    title: 'Modernismo: 3ª Fase e Literatura Contemporânea', durationMinutes: 50 },

  // ── INGLÊS ────────────────────────────────────────────────────────────────
  { id: 'ing-01', subjectId: 'ingles', order: 1,  topic: 'Reading',           title: 'Estratégias de Leitura em Inglês',          durationMinutes: 50 },
  { id: 'ing-02', subjectId: 'ingles', order: 2,  topic: 'Reading',           title: 'Vocabulário Contextual e Falsos Cognatos',  durationMinutes: 50 },
  { id: 'ing-03', subjectId: 'ingles', order: 3,  topic: 'Grammar',           title: 'Tempos Verbais em Inglês',                  durationMinutes: 50 },
  { id: 'ing-04', subjectId: 'ingles', order: 4,  topic: 'Grammar',           title: 'Phrasal Verbs e Expressões Idiomáticas',    durationMinutes: 50 },
  { id: 'ing-05', subjectId: 'ingles', order: 5,  topic: 'Revisão ENEM',      title: 'Questões Comentadas de Inglês no ENEM',     durationMinutes: 60 },

  // ── HISTÓRIA ──────────────────────────────────────────────────────────────
  { id: 'his-01', subjectId: 'historia', order: 1,  topic: 'Brasil Colonial',  title: 'Brasil Colônia: Exploração e Resistência',  durationMinutes: 55 },
  { id: 'his-02', subjectId: 'historia', order: 2,  topic: 'Brasil Imperial',  title: 'Brasil Imperial e a Independência',         durationMinutes: 55 },
  { id: 'his-03', subjectId: 'historia', order: 3,  topic: 'Brasil República', title: 'República Velha e a Era Vargas',             durationMinutes: 55 },
  { id: 'his-04', subjectId: 'historia', order: 4,  topic: 'Brasil República', title: 'Ditadura Militar e Redemocratização',        durationMinutes: 55 },
  { id: 'his-05', subjectId: 'historia', order: 5,  topic: 'História Mundo',   title: 'Revoluções Industriais e Capitalismo',      durationMinutes: 55 },
  { id: 'his-06', subjectId: 'historia', order: 6,  topic: 'História Mundo',   title: 'Primeira e Segunda Guerra Mundial',         durationMinutes: 55 },
  { id: 'his-07', subjectId: 'historia', order: 7,  topic: 'História Mundo',   title: 'Guerra Fria e Descolonização',               durationMinutes: 55 },
  { id: 'his-08', subjectId: 'historia', order: 8,  topic: 'Contemporâneo',    title: 'Globalização e Mundo Contemporâneo',        durationMinutes: 55 },

  // ── GEOGRAFIA ─────────────────────────────────────────────────────────────
  { id: 'geo-01', subjectId: 'geografia', order: 1,  topic: 'Física',          title: 'Geomorfologia: Relevos e Hidrografia',      durationMinutes: 55 },
  { id: 'geo-02', subjectId: 'geografia', order: 2,  topic: 'Física',          title: 'Climatologia: Climas e Biomas',             durationMinutes: 55 },
  { id: 'geo-03', subjectId: 'geografia', order: 3,  topic: 'Brasil',          title: 'Regiões Brasileiras e Desigualdades',       durationMinutes: 55 },
  { id: 'geo-04', subjectId: 'geografia', order: 4,  topic: 'Brasil',          title: 'Urbanização e Industrialização no Brasil',  durationMinutes: 55 },
  { id: 'geo-05', subjectId: 'geografia', order: 5,  topic: 'Humana',          title: 'Fluxos Migratórios e Populações',           durationMinutes: 55 },
  { id: 'geo-06', subjectId: 'geografia', order: 6,  topic: 'Humana',          title: 'Geopolítica: Conflitos e Blocos',           durationMinutes: 55 },
  { id: 'geo-07', subjectId: 'geografia', order: 7,  topic: 'Ambiental',       title: 'Questões Ambientais e Sustentabilidade',    durationMinutes: 55 },

  // ── FILOSOFIA ─────────────────────────────────────────────────────────────
  { id: 'fil-01', subjectId: 'filosofia', order: 1,  topic: 'Antiga',          title: 'Filosofia Grega: Sócrates, Platão e Aristóteles', durationMinutes: 50 },
  { id: 'fil-02', subjectId: 'filosofia', order: 2,  topic: 'Moderna',         title: 'Filosofia Moderna: Descartes, Locke e Kant', durationMinutes: 50 },
  { id: 'fil-03', subjectId: 'filosofia', order: 3,  topic: 'Política',        title: 'Filosofia Política: Contratualismo',        durationMinutes: 50 },
  { id: 'fil-04', subjectId: 'filosofia', order: 4,  topic: 'Contemporânea',   title: 'Marxismo, Existencialismo e Positivismo',   durationMinutes: 50 },
  { id: 'fil-05', subjectId: 'filosofia', order: 5,  topic: 'Ética',           title: 'Ética e Direitos Humanos',                  durationMinutes: 50 },

  // ── SOCIOLOGIA ────────────────────────────────────────────────────────────
  { id: 'soc-01', subjectId: 'sociologia', order: 1,  topic: 'Clássicos',      title: 'Durkheim, Weber e Marx',                   durationMinutes: 50 },
  { id: 'soc-02', subjectId: 'sociologia', order: 2,  topic: 'Temas',          title: 'Cultura, Identidade e Diversidade',         durationMinutes: 50 },
  { id: 'soc-03', subjectId: 'sociologia', order: 3,  topic: 'Temas',          title: 'Cidadania, Democracia e Movimentos Sociais', durationMinutes: 50 },
  { id: 'soc-04', subjectId: 'sociologia', order: 4,  topic: 'Temas',          title: 'Desigualdades Sociais e Racismo',           durationMinutes: 50 },
  { id: 'soc-05', subjectId: 'sociologia', order: 5,  topic: 'Temas',          title: 'Trabalho, Família e Meios de Comunicação',  durationMinutes: 50 },
];

export const LESSONS_BY_SUBJECT: Record<string, Lesson[]> = LESSONS.reduce(
  (acc, lesson) => {
    if (!acc[lesson.subjectId]) acc[lesson.subjectId] = [];
    acc[lesson.subjectId].push(lesson);
    return acc;
  },
  {} as Record<string, Lesson[]>
);
