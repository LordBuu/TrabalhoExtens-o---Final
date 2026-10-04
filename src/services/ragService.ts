import { ScientificSource, PedagogicalAnalysisResult } from "../types";
import { getCachedSources, fetchScientificSources } from "./scientificSourceService";

export interface RagRetrievalResult {
  matchedSources: ScientificSource[];
  confidence: 'high' | 'medium' | 'low';
  identifiedKeywords: string[];
}

// Normalize strings for robust Portuguese accent-insensitive token matching
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, " ");
}

export function retrieveRelevantSources(question: string, sourcesPool: ScientificSource[]): RagRetrievalResult {
  const normQ = normalizeText(question);
  const qTokens = normQ.split(/\s+/).filter((t) => t.length > 2);

  const matchedKeywords = new Set<string>();

  // Keyword dictionary with weights
  const domainLexicon: Record<string, string[]> = {
    TDAH: ["tdah", "desatencao", "hiperatividade", "concentracao", "foco", "distracao", "inquietacao", "50 minutos", "tempo de aula"],
    TEA: ["tea", "autismo", "autista", "espectro", "previsibilidade", "rotina", "sensorial", "sobrecarga", "literal", "transicao"],
    Dislexia: ["dislexia", "dislexico", "leitura", "fonologica", "decodificacao", "ortografia", "texto longo", "leitor"],
    Discalculia: ["discalculia", "matematica", "calculo", "aritmetica", "senso numerico", "tabela", "calculadora", "algebra"],
    "Funções Executivas": ["funcoes executivas", "organizacao", "iniciar", "iniciar tarefas", "memoria de trabalho", "planejamento", "procrastinacao", "checklist", "prazos"],
    TDL: ["tdl", "linguagem", "enunciado", "compreensao", "vocabulario", "sintaxe"],
    "Avaliação Inclusiva": ["avaliacao", "prova", "teste", "tempo adicional", "adaptacao", "rubrica", "nota", "criterios"],
    "Inclusão & UDL": ["dua", "udl", "universal", "inclusao", "metodologia", "acessibilidade", "diversidade"]
  };

  // Identify domain matches in question
  for (const [domain, terms] of Object.entries(domainLexicon)) {
    for (const term of terms) {
      const normTerm = normalizeText(term);
      if (normQ.includes(normTerm)) {
        matchedKeywords.add(domain);
        matchedKeywords.add(term);
      }
    }
  }

  // Calculate score for each scientific source
  const scoredSources = sourcesPool.map((source) => {
    let score = 0;
    const normTitle = normalizeText(source.title);
    const normAbstract = normalizeText(source.abstract || "");
    const normNeuro = normalizeText(source.neurodivergence || "");
    const normIntervention = normalizeText(source.intervention || "");

    // Check domain tag
    if (matchedKeywords.has(source.neurodivergence)) {
      score += 10;
    }

    // Direct token matching
    qTokens.forEach((token) => {
      if (normTitle.includes(token)) score += 5;
      if (normNeuro.includes(token)) score += 6;
      if (normIntervention.includes(token)) score += 3;
      if (normAbstract.includes(token)) score += 2;
    });

    // Keywords array matching
    if (source.keywords && Array.isArray(source.keywords)) {
      source.keywords.forEach((kw) => {
        const normKw = normalizeText(kw);
        if (normQ.includes(normKw)) {
          score += 4;
          matchedKeywords.add(kw);
        }
      });
    }

    return { source, score };
  });

  // Filter sources with relevance score threshold
  const matched = scoredSources
    .filter((item) => item.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.source);

  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (matched.length >= 2) confidence = 'high';
  else if (matched.length === 1) confidence = 'medium';

  return {
    matchedSources: matched,
    confidence,
    identifiedKeywords: Array.from(matchedKeywords).slice(0, 8),
  };
}

export async function executeRagPedagogicalAnalysis(
  question: string,
  teacherContext?: { subjectArea?: string; gradeLevel?: string }
): Promise<{
  result: PedagogicalAnalysisResult;
  retrievedSources: ScientificSource[];
  retrievalMetadata: RagRetrievalResult;
}> {
  // Ensure sources are loaded
  let sources = getCachedSources();
  if (!sources || sources.length === 0) {
    sources = await fetchScientificSources();
  }

  // Step 1: Retrieval Augmented Generation (RAG) retrieval
  const retrieval = retrieveRelevantSources(question, sources);

  // Step 2: Call secure server-side Gemini API
  const response = await fetch("/api/gemini/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      teacherContext,
      retrievedSources: retrieval.matchedSources,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro na comunicação com a API: status ${response.status}`);
  }

  const result: PedagogicalAnalysisResult = await response.json();

  return {
    result,
    retrievedSources: retrieval.matchedSources,
    retrievalMetadata: retrieval,
  };
}
