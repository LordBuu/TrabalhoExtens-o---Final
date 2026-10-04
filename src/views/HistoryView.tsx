import React, { useState } from "react";
import { QuestionHistory } from "../types";
import { History, Search, Trash2, ArrowRight, BookOpen, Clock, Calendar, CheckCircle, ChevronDown, ChevronUp, AlertTriangle, X } from "lucide-react";
import { EvidenceBadge } from "../components/EvidenceBadge";

interface HistoryViewProps {
  questions: QuestionHistory[];
  onDeleteQuestion: (id: string) => Promise<void>;
  onReopenQuestion: (questionText: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  questions,
  onDeleteQuestion,
  onReopenQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<QuestionHistory | null>(null);

  const filtered = questions.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return q.question.toLowerCase().includes(term) || (q.category || "").toLowerCase().includes(term);
  });

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    const id = questionToDelete.id;
    setDeletingId(id);
    try {
      await onDeleteQuestion(id);
      setQuestionToDelete(null);
    } catch (err) {
      console.error("Error deleting question:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Consultas Realizadas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Histórico de Perguntas ao Assistente
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Reveja as situações pedagógicas analisadas anteriormente e as estratégias científicas recomendadas para sua sala de aula.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar em seu histórico de perguntas..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm space-y-2 transition-colors">
            <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Nenhuma consulta encontrada no histórico.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Faça uma pergunta no Assistente de IA para registrar seu histórico pedagógico.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const res = item.structuredResult;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-600 transition-all overflow-hidden"
              >
                {/* Item Summary Bar */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")} às {new Date(item.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{item.category || "Geral"}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      "{item.question}"
                    </h3>

                    {res?.summary && !isExpanded && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {res.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuestionToDelete(item);
                      }}
                      title="Excluir pergunta"
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="p-2 text-slate-400 dark:text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-6 text-xs text-slate-700 dark:text-slate-300">
                    {res ? (
                      <>
                        {/* Resumo */}
                        <div className="space-y-1">
                          <h4 className="font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[11px]">
                            Compreensão Pedagógica
                          </h4>
                          <p className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-serif text-[15px] leading-relaxed">
                            {res.summary}
                          </p>
                        </div>

                        {/* Estratégias */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider text-[11px]">
                            Estratégias Recomendadas
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {res.recommendedStrategies.map((s, idx) => (
                              <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                                <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{idx + 1}. {s.title}</p>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{s.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Fontes */}
                        {item.sources && item.sources.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                              Fontes Científicas Utilizadas
                            </h4>
                            <div className="space-y-1.5">
                              {item.sources.map((s, idx) => (
                                <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.title}</span>
                                    <span className="text-slate-500 dark:text-slate-400 ml-1">({s.authors}, {s.year})</span>
                                  </div>
                                  <EvidenceBadge level={s.evidenceLevel} size="sm" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-line text-xs">
                        {item.answer}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onReopenQuestion(item.question)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>Reabrir e Refinar no Assistente</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal (In-UI, doesn't use blocked window.confirm) */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Excluir Pergunta?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Esta ação removerá a análise do seu histórico.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuestionToDelete(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic line-clamp-3">
              "{questionToDelete.question}"
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                disabled={deletingId !== null}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirmar Exclusão</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
