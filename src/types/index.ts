export type EvidenceLevel =
  | 'Revisão sistemática'
  | 'Meta-análise'
  | 'Ensaio clínico/controlado'
  | 'Estudo observacional'
  | 'Estudo qualitativo'
  | 'Diretriz/consenso'
  | 'Revisão narrativa'
  | 'Fonte institucional';

export type NeurodivergenceCategory =
  | 'TDAH'
  | 'TEA'
  | 'Dislexia'
  | 'Discalculia'
  | 'Funções Executivas'
  | 'TDL'
  | 'Atenção e Memória'
  | 'Regulação Emocional'
  | 'Inclusão & UDL';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  institution?: string;
  subjectArea?: string;
  role: 'teacher' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface ScientificSource {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal?: string;
  doi?: string;
  url?: string;
  abstract: string;
  keywords: string[];
  neurodivergence: string;
  ageRange: string;
  educationalContext: string;
  intervention: string;
  evidenceLevel: EvidenceLevel;
  content: string;
  demo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  situation: string;
  howToApply: string;
  expectedBenefits: string;
  limitations: string;
  category: string;
  referenceIds: string[];
  demo?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StructuredCitation {
  title: string;
  authors: string;
  year: number;
  journal?: string;
  doi?: string;
  url?: string;
  evidenceLevel: string;
  howItSupports: string;
}

export interface PedagogicalAnalysisResult {
  summary: string;
  recommendedStrategies: Array<{
    title: string;
    description: string;
    evidenceLevel?: string;
  }>;
  classroomApplication: Array<{
    step: string;
    example: string;
  }>;
  whatToObserve: Array<{
    indicator: string;
    expectedEffect: string;
  }>;
  cautions: string[];
  whenToEscalate: string;
  hasSufficientEvidence: boolean;
  scientificEvidence: StructuredCitation[];
  generalDisclaimer: string;
}

export interface QuestionHistory {
  id: string;
  userId: string;
  question: string;
  answer: string;
  structuredResult?: PedagogicalAnalysisResult;
  sources: Array<{
    id?: string;
    title: string;
    authors: string;
    year: number;
    evidenceLevel: string;
    doi?: string;
  }>;
  category?: string;
  hasSufficientEvidence?: boolean;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  itemType: 'article' | 'strategy' | 'answer';
  itemId: string;
  title: string;
  snippet: string;
  category?: string;
  createdAt: string;
}
