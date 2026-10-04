import React, { useState, useEffect } from "react";
import { useAuth } from "../services/authContext";
import { executeRagPedagogicalAnalysis } from "../services/ragService";
import { saveQuestionToHistory } from "../services/historyService";
import { addFavorite, removeFavoriteByItemId } from "../services/favoriteService";
import { PedagogicalAnalysisResult, ScientificSource } from "../types";
import { EvidenceBadge } from "../components/EvidenceBadge";
import { SourceDetailModal } from "../components/SourceDetailModal";
import {
  Sparkles,
  Send,
  Shield,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Copy,
  Printer,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";

interface AssistantViewProps {
  initialQuestion?: string;
  onOpenPrivacy: () => void;
  onOpenAuth: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  initialQuestion = "",
  onOpenPrivacy,
  onOpenAuth,
}) => {
  const { user, profile } = useAuth();
  const [question, setQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [ragStep, setRagStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentResult, setCurrentResult] = useState<PedagogicalAnalysisResult | null>(null);
  const [retrievedSources, setRetrievedSources] = useState<ScientificSource[]>([]);
  const [activeQuestionText, setActiveQuestionText] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Modal to inspect full scientific paper
  const [selectedSource, setSelectedSource] = useState<ScientificSource | null>(null);

  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      setQuestion(initialQuestion);
      handleAnalyze(initialQuestion);
    }
  }, [initialQuestion]);

  const quickPrompts = [
    "Tenho uma aluna com TDAH que tem dificuldade para permanecer concentrada durante aulas de 50 minutos. O que posso fazer?",
    "Como posso adaptar uma atividade de matemática para um aluno com TEA?",
    "Um aluno apresenta dificuldade para iniciar atividades e organizar as tarefas. Quais estratégias podem ajudar?",
    "Como posso organizar uma avaliação para um estudante neurodivergente sem prejudicar os objetivos pedagógicos?",
  ];

  const handleAnalyze = async (queryText?: string) => {
    const textToSearch = queryText || question;
    if (!textToSearch.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setCurrentResult(null);
    setRetrievedSources([]);
    setIsSaved(false);
    setActiveQuestionText(textToSearch);

    // Simulate RAG progress stages for transparency
    setRagStep(1); // Identifying keywords
    const stepTimer1 = setTimeout(() => setRagStep(2), 600); // Searching scientific repository
    const stepTimer2 = setTimeout(() => setRagStep(3), 1200); // Calling Gemini

    try {
      const { result, retrievedSources } = await executeRagPedagogicalAnalysis(textToSearch, {
        subjectArea: profile?.subjectArea,
      });

      setCurrentResult(result);
      setRetrievedSources(retrievedSources);

      // Save to Firestore history if user is logged in
      if (user?.uid || profile?.id) {
        const uid = user?.uid || profile?.id || "demo-user";
        try {
          await saveQuestionToHistory(uid, textToSearch, result, retrievedSources);
        } catch (e) {
          console.warn("Could not save to history Firestore:", e);
        }
      }
    } catch (err: any) {
      console.error("RAG Error:", err);
      setErrorMsg(err.message || "Não foi possível concluir a análise. Verifique sua conexão e tente novamente.");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setRagStep(0);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user && !profile) {
      onOpenAuth();
      return;
    }
    const uid = user?.uid || profile?.id || "demo-user";
    const itemId = `ans-${Date.now()}`;

    if (!isSaved && currentResult) {
      try {
        await addFavorite(
          uid,
          "answer",
          itemId,
          `Resposta: ${activeQuestionText.substring(0, 70)}...`,
          currentResult.summary.substring(0, 200),
          "Assistente IA"
        );
        setIsSaved(true);
      } catch (e) {
        console.warn("Error favoriting:", e);
      }
    } else {
      setIsSaved(false);
    }
  };

  const handleCopy = () => {
    if (!currentResult) return;
    const formatted = `[NeuroEdu - Análise Pedagógica]
Dúvida: "${activeQuestionText}"

RESUMO:
${currentResult.summary}

ESTRATÉGIAS RECOMENDADAS:
${currentResult.recommendedStrategies.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join("\n")}

COMO APLICAR EM SALA:
${currentResult.classroomApplication.map((c) => `- ${c.step}: ${c.example}`).join("\n")}

O QUE OBSERVAR:
${currentResult.whatToObserve.map((o) => `- ${o.indicator}: ${o.expectedEffect}`).join("\n")}

ATENÇÃO E LIMITAÇÕES:
${currentResult.cautions.join("\n")}
Quando encaminhar: ${currentResult.whenToEscalate}

EVIDÊNCIAS CIENTÍFICAS:
${currentResult.scientificEvidence.map((e) => `- ${e.title} (${e.authors}, ${e.year}). ${e.evidenceLevel}. DOI: ${e.doi || "N/A"}`).join("\n")}

Aviso: ${currentResult.generalDisclaimer}`;

    navigator.clipboard.writeText(formatted);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner with Ethical Guidance */}
      <div className="p-4 bg-slate-100/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300 no-print transition-colors">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Diretriz Ética:</strong> Esta plataforma não diagnostica estudantes nem emite laudos clínicos. Utilize descrições pedagógicas anônimas.
          </span>
        </div>
        <button
          onClick={onOpenPrivacy}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold underline shrink-0 cursor-pointer"
        >
          Saiba mais
        </button>
      </div>

      {/* Input Box Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 no-print transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Pergunte ao Assistente Pedagógico (RAG)</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Respostas fundamentadas em fontes científicas do Ensino Médio
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Descreva a situação observada em sala de aula (Ex: Tenho um aluno com dificuldade para manter o foco em aulas teóricas de 50 minutos...)"
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed shadow-inner"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              💡 <em>Evite nomes de alunos ou dados cadastrais para cumprir as regras da LGPD escolar.</em>
            </p>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xs hover:shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>Analisar Situação</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Ou escolha um exemplo prático:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(p);
                  handleAnalyze(p);
                }}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 border border-slate-200/80 dark:border-slate-700 transition-colors text-left cursor-pointer"
              >
                {p.length > 60 ? `${p.substring(0, 60)}...` : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading RAG Indicator */}
      {loading && (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-indigo-900/60 shadow-sm space-y-6 text-center animate-pulse transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Analisando sua pergunta e buscando evidências...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Nossa inteligência artificial não usa apenas conhecimento genérico: estamos resgatando estudos científicos correspondentes para fundamentar a resposta.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left text-xs">
            <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${ragStep >= 1 ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-medium" : "text-slate-400 dark:text-slate-500"}`}>
              <CheckCircle className={`w-4 h-4 ${ragStep >= 1 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-300 dark:text-slate-600"}`} />
              <span>1. Identificando palavras-chave e contexto da sala de aula</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${ragStep >= 2 ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium" : "text-slate-400 dark:text-slate-500"}`}>
              <CheckCircle className={`w-4 h-4 ${ragStep >= 2 ? "text-teal-600 dark:text-teal-400" : "text-slate-300 dark:text-slate-600"}`} />
              <span>2. Consultando evidências científicas no repositório Firestore</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${ragStep >= 3 ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium" : "text-slate-400 dark:text-slate-500"}`}>
              <CheckCircle className={`w-4 h-4 ${ragStep >= 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`} />
              <span>3. Sintetizando estratégias e diretrizes pedagógicas com Gemini 3.8</span>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Não foi possível processar a consulta</span>
          </div>
          <p className="text-xs text-rose-800 dark:text-rose-300">{errorMsg}</p>
        </div>
      )}

      {/* Result Display */}
      {currentResult && !loading && (
        <div className="space-y-6 printable-card">
          {/* Header Action Bar */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-4 no-print transition-colors">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Situação Analisada</span>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-2">
                "{activeQuestionText}"
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFavoriteToggle}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSaved
                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
                <span>{isSaved ? "Salvo" : "Salvar"}</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{copyFeedback ? "Copiado!" : "Copiar"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Imprimir / Exportar</span>
              </button>
            </div>
          </div>

          {/* Insufficient Evidence Warning Banner */}
          {!currentResult.hasSufficientEvidence && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Aviso sobre a base científica:</p>
                <p className="mt-0.5">
                  Não encontramos evidências específicas suficientes na biblioteca da plataforma para esta situação precisa. As recomendações abaixo refletem princípios educacionais gerais prudentes e devem ser aplicadas com observação redobrada.
                </p>
              </div>
            </div>
          )}

          {/* Main Structured Response Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8 transition-colors">
            {/* Section 1: Resumo */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Resumo e Compreensão Pedagógica
                </h3>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-serif text-[16px] leading-relaxed">
                {currentResult.summary}
              </div>
            </div>

            {/* Section 2: Estratégias Recomendadas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
                  Estratégias Recomendadas para Sala de Aula
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentResult.recommendedStrategies.map((strat, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {idx + 1}. {strat.title}
                      </h4>
                      {strat.evidenceLevel && (
                        <EvidenceBadge level={strat.evidenceLevel} size="sm" showIcon={false} />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {strat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Como aplicar em sala */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Como Aplicar na Rotina da Aula (Passo a Passo)
                </h3>
              </div>

              <div className="space-y-3">
                {currentResult.classroomApplication.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-start gap-4"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 text-xs">
                      <h5 className="font-bold text-slate-900 dark:text-slate-100">{app.step}</h5>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{app.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: O que observar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  O que Observar (Indicadores de Eficácia)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {currentResult.whatToObserve.map((obs, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{obs.indicator}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                      {obs.expectedEffect}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Atenção e Limitações */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Atenção e Limitações Pedagógicas
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-3 text-xs text-amber-950 dark:text-amber-200">
                <ul className="space-y-1.5 list-disc pl-5">
                  {currentResult.cautions.map((caution, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {caution}
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-200">Quando encaminhar ou dialogar: </span>
                  <span className="text-amber-950 dark:text-amber-300">{currentResult.whenToEscalate}</span>
                </div>
              </div>
            </div>

            {/* Section 6: Evidências Científicas Utilizadas */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Evidências Científicas Utilizadas ({currentResult.scientificEvidence.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Fontes recuperadas da biblioteca NeuroEdu
                </span>
              </div>

              {currentResult.scientificEvidence.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  Nenhuma fonte direta indexada foi vinculada.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentResult.scientificEvidence.map((ev, idx) => {
                    const matchedSource = retrievedSources.find(
                      (s) => s.title.toLowerCase().includes(ev.title.toLowerCase().substring(0, 20))
                    );

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                            {ev.title}
                          </h4>
                          <EvidenceBadge level={ev.evidenceLevel} size="sm" />
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong>Autores:</strong> {ev.authors} ({ev.year}) {ev.journal ? `• ${ev.journal}` : ""}
                        </p>

                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-750">
                          <strong>Como fundamenta a resposta:</strong> {ev.howItSupports}
                        </p>

                        <div className="flex items-center justify-between text-xs pt-1">
                          {ev.doi && (
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              DOI: {ev.doi}
                            </span>
                          )}

                          <div className="flex items-center gap-2 ml-auto">
                            {matchedSource && (
                              <button
                                onClick={() => setSelectedSource(matchedSource)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>Ver detalhes completos</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {(ev.url || ev.doi) && (
                              <a
                                href={ev.url || `https://doi.org/${ev.doi}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                              >
                                <span>Periódico oficial</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Disclaimer footer */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              {currentResult.generalDisclaimer}
            </div>
          </div>
        </div>
      )}

      {/* Source Detail Modal */}
      {selectedSource && (
        <SourceDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
};
