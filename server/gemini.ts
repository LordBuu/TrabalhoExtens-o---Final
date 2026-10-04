import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface ScientificSourceInput {
  id?: string;
  title: string;
  authors: string;
  year: number;
  journal?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  evidenceLevel: string;
  neurodivergence?: string;
  ageRange?: string;
  educationalContext?: string;
  intervention?: string;
  content?: string;
  demo?: boolean;
}

export interface RagAnalyzePayload {
  question: string;
  teacherContext?: {
    subjectArea?: string;
    gradeLevel?: string;
  };
  retrievedSources: ScientificSourceInput[];
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
  scientificEvidence: Array<{
    title: string;
    authors: string;
    year: number;
    journal?: string;
    doi?: string;
    url?: string;
    evidenceLevel: string;
    howItSupports: string;
  }>;
  generalDisclaimer: string;
}

const SYSTEM_INSTRUCTION = `Você é um assistente especializado em apoio pedagógico e educação inclusiva no sistema NeuroEdu.
Sua função é auxiliar professores que trabalham com estudantes adolescentes no Ensino Médio, aproximadamente entre 13 e 17 anos.
Você deve fornecer estratégias pedagógicas práticas baseadas PRIORITARIAMENTE nas fontes científicas fornecidas no contexto pelo sistema (RAG).

DIRETRIZES ÉTICAS E CIENTÍFICAS CRÍTICAS:
1. Nunca invente artigos científicos, autores, DOI ou resultados de pesquisas que não constem nas fontes fornecidas.
2. Se as fontes fornecidas forem insuficientes ou não cobrirem a situação com rigor, marque "hasSufficientEvidence": false e forneça apenas orientações pedagógicas gerais e prudentes de sala de aula, deixando essa limitação explícita.
3. JAMAIS realize diagnóstico clínico ou afirme que o estudante tem determinada patologia ou transtorno a partir do relato do professor.
4. JAMAIS prescreva ou discuta medicações ou tratamentos médicos.
5. Utilize sempre linguagem educacional e pedagógica acessível, clara para professores sem especialização prévia em neurociência.
6. Associe cada estratégia recomendada à sua respectiva fonte científica resgatada sempre que houver correspondência.
7. Enfatize que estudantes neurodivergentes são heterogêneos: o que funciona para um pode requerer ajustes para outro.
8. Evite qualquer linguagem estigmatizante, capacitista ou determinista.
9. Oriente claramente quando é o momento de dialogar com a coordenação pedagógica, orientador educacional, família e especialistas clínicos.`;

export async function analyzePedagogicalQuestion(payload: RagAnalyzePayload): Promise<PedagogicalAnalysisResult> {
  const { question, teacherContext, retrievedSources } = payload;

  const sourcesContextText = retrievedSources && retrievedSources.length > 0
    ? retrievedSources.map((s, idx) => `
[FONTE ${idx + 1}]
Título: ${s.title}
Autores: ${s.authors} (${s.year})
Periódico/Instituição: ${s.journal || "Não informado"}
Nível de Evidência: ${s.evidenceLevel}
Condição/Espectro: ${s.neurodivergence || "Geral"}
Faixa Etária: ${s.ageRange || "Adolescentes 13-17 anos"}
Contexto: ${s.educationalContext || "Ensino Médio"}
Resumo/Conteúdo Científico: ${s.abstract || s.content || "Sem resumo disponível"}
DOI: ${s.doi || "N/A"}
Link: ${s.url || "N/A"}
Demonstração: ${s.demo ? "Sim (exemplo pedagógico)" : "Não"}
`).join("\n---\n")
    : "NENHUMA FONTE CIENTÍFICA ESPECÍFICA ENCONTRADA NA BIBLIOTECA PARA ESTA CONSULTA.";

  const userPrompt = `DÚVIDA DO PROFESSOR (Ensino Médio, 13 a 17 anos):
"${question}"

${teacherContext?.subjectArea ? `Área/Disciplina: ${teacherContext.subjectArea}` : ""}
${teacherContext?.gradeLevel ? `Ano Escolar: ${teacherContext.gradeLevel}` : ""}

FONTES CIENTÍFICAS RECUPERADAS DA BIBLIOTECA NEUROEDU:
${sourcesContextText}

Por favor, analise a situação e gere a resposta estruturada para o professor com base nas fontes científicas recuperadas.
Se não houver fontes suficientes na biblioteca, sinalize hasSufficientEvidence = false e forneça apenas orientações gerais seguras e éticas.`;

  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2, // Low temperature for high factual alignment and zero hallucinations
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Compreensão empática e clara da situação descrita pelo professor",
              },
              recommendedStrategies: {
                type: Type.ARRAY,
                description: "Lista de estratégias pedagógicas práticas de sala de aula",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    evidenceLevel: { type: Type.STRING },
                  },
                  required: ["title", "description"],
                },
              },
              classroomApplication: {
                type: Type.ARRAY,
                description: "Exemplos concretos de como aplicar as estratégias na rotina do Ensino Médio",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    example: { type: Type.STRING },
                  },
                  required: ["step", "example"],
                },
              },
              whatToObserve: {
                type: Type.ARRAY,
                description: "Sinais de eficácia ou necessidade de ajustes na estratégia",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    indicator: { type: Type.STRING },
                    expectedEffect: { type: Type.STRING },
                  },
                  required: ["indicator", "expectedEffect"],
                },
              },
              cautions: {
                type: Type.ARRAY,
                description: "Cuidados pedagógicos, limitações da intervenção e prevenção de sobrecarga",
                items: { type: Type.STRING },
              },
              whenToEscalate: {
                type: Type.STRING,
                description: "Orientações sobre quando envolver equipe pedagógica, família ou profissionais de saúde",
              },
              hasSufficientEvidence: {
                type: Type.BOOLEAN,
                description: "Verdadeiro se foram encontradas evidências específicas na base fornecida",
              },
              scientificEvidence: {
                type: Type.ARRAY,
                description: "Fontes científicas efetivamente utilizadas na resposta (nunca inventar)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    authors: { type: Type.STRING },
                    year: { type: Type.NUMBER },
                    journal: { type: Type.STRING },
                    doi: { type: Type.STRING },
                    url: { type: Type.STRING },
                    evidenceLevel: { type: Type.STRING },
                    howItSupports: { type: Type.STRING },
                  },
                  required: ["title", "authors", "year", "evidenceLevel", "howItSupports"],
                },
              },
              generalDisclaimer: {
                type: Type.STRING,
                description: "Aviso ético de que a ferramenta não substitui avaliação clínica nem diagnóstico",
              },
            },
            required: [
              "summary",
              "recommendedStrategies",
              "classroomApplication",
              "whatToObserve",
              "cautions",
              "whenToEscalate",
              "hasSufficientEvidence",
              "scientificEvidence",
              "generalDisclaimer",
            ],
          },
        },
      });

      const text = response.text || "{}";
      return JSON.parse(text) as PedagogicalAnalysisResult;
    } catch (err: any) {
      console.warn(`Attempt with ${model} failed:`, err?.message || err);
      lastError = err;
      // Sleep 300ms before attempting next candidate model
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  throw new Error(lastError?.message || "Não foi possível gerar a resposta com os modelos disponíveis.");
}
