import React, { useState } from "react";
import { useAuth } from "../services/authContext";
import { ScientificSource, Strategy, QuestionHistory } from "../types";
import { EvidenceBadge } from "../components/EvidenceBadge";
import { Sparkles, ArrowRight, BookOpen, Layers, History, Bookmark, Shield, AlertCircle, Clock, CheckCircle } from "lucide-react";

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onAskQuestion: (query: string) => void;
  recentQuestions: QuestionHistory[];
  sources: ScientificSource[];
  strategies: Strategy[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onAskQuestion,
  recentQuestions,
  sources,
  strategies,
}) => {
  const { profile, user } = useAuth();
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onAskQuestion(quickQuery.trim());
  };

  const teacherName = profile?.name || user?.displayName || "Professor(a)";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Olá, {teacherName} 👋
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
              {profile?.subjectArea || "Ensino Médio"}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Qual situação ou desafio de adaptação pedagógica você gostaria de analisar hoje?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("library")}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{sources.length} Fontes Científicas</span>
          </button>
          <button
            onClick={() => onNavigate("strategies")}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{strategies.length} Estratégias</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Ask Box */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden border dark:border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 text-teal-300 text-xs font-semibold border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistente Pedagógico RAG</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">
            Descreva sua situação ou dúvida de sala de aula
          </h2>

          <form onSubmit={handleQuickSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                rows={3}
                placeholder="Exemplo: Tenho um estudante que tem dificuldade para iniciar atividades e organizar o caderno durante aulas de 50 minutos. Quais adaptações posso aplicar?"
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-hidden focus:ring-4 focus:ring-teal-400/30 border dark:border-slate-700 font-normal leading-relaxed shadow-inner"
              />
            </div>

            {/* Privacy Alert */}
            <div className="flex items-start gap-2 text-[11px] text-indigo-100 dark:text-slate-300 bg-white/10 dark:bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Shield className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                <strong>Privacidade do estudante:</strong> Evite inserir nome, CPF, diagnóstico, endereço ou outras informações que identifiquem diretamente um estudante. Utilize descrições pedagógicas anônimas.
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-indigo-200 dark:text-slate-400 hidden sm:block">
                A IA consulta o banco de evidências antes de formular a resposta.
              </p>
              <button
                type="submit"
                disabled={!quickQuery.trim()}
                className="px-6 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer ml-auto"
              >
                <span>Perguntar à IA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Grid: Recent History & Recommended Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Questions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Histórico de Consultas</h3>
            </div>
            <button
              onClick={() => onNavigate("history")}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Ver todas ({recentQuestions.length})
            </button>
          </div>

          {recentQuestions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs">Você ainda não realizou perguntas ao Assistente.</p>
              <button
                onClick={() => onNavigate("assistant")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                Faça sua primeira consulta agora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentQuestions.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  onClick={() => onAskQuestion(q.question)}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    "{q.question}"
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{new Date(q.createdAt).toLocaleDateString("pt-BR")}</span>
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                      Ver resposta <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Strategies */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Estratégias Práticas em Destaque</h3>
            </div>
            <button
              onClick={() => onNavigate("strategies")}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Explorar catálogo
            </button>
          </div>

          <div className="space-y-3">
            {strategies.slice(0, 3).map((strat) => (
              <div
                key={strat.id}
                onClick={() => onNavigate("strategies")}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                    {strat.name}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium border border-teal-200/60 dark:border-teal-800">
                    {strat.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {strat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
