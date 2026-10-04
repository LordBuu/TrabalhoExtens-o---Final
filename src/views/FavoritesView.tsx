import React, { useState } from "react";
import { FavoriteItem, ScientificSource, Strategy } from "../types";
import { Bookmark, BookOpen, Layers, Sparkles, Trash2, ArrowRight } from "lucide-react";

interface FavoritesViewProps {
  favorites: FavoriteItem[];
  sources: ScientificSource[];
  strategies: Strategy[];
  onRemoveFavorite: (favId: string) => Promise<void>;
  onViewSource: (sourceId: string) => void;
  onOpenQuestion: (questionText: string) => void;
  onNavigate: (view: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  sources,
  strategies,
  onRemoveFavorite,
  onViewSource,
  onOpenQuestion,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "article" | "strategy" | "answer">("all");

  const filtered = favorites.filter((f) => {
    if (activeTab === "all") return true;
    return f.itemType === activeTab;
  });

  const articleCount = favorites.filter((f) => f.itemType === "article").length;
  const strategyCount = favorites.filter((f) => f.itemType === "strategy").length;
  const answerCount = favorites.filter((f) => f.itemType === "answer").length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Bookmark className="w-4 h-4" />
          <span>Coleção Pessoal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Meus Favoritos
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Seus artigos científicos, estratégias pedagógicas e análises da IA salvos para consulta ágil no seu planejamento.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
            activeTab === "all"
              ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
          }`}
        >
          Todos ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab("article")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "article"
              ? "bg-indigo-600 text-white font-bold"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Artigos ({articleCount})</span>
        </button>
        <button
          onClick={() => setActiveTab("strategy")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "strategy"
              ? "bg-teal-600 text-white font-bold"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Estratégias ({strategyCount})</span>
        </button>
        <button
          onClick={() => setActiveTab("answer")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === "answer"
              ? "bg-purple-600 text-white font-bold"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Respostas IA ({answerCount})</span>
        </button>
      </div>

      {/* Favorites List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm space-y-3 transition-colors">
            <Bookmark className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200">Nenhum item salvo nesta categoria</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              Você pode clicar no ícone de marcador em qualquer artigo, estratégia ou resposta do assistente para adicioná-lo aos seus favoritos.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.itemType === "article"
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                          : item.itemType === "strategy"
                          ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                          : "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      }`}
                    >
                      {item.itemType === "article" && "Artigo Científico"}
                      {item.itemType === "strategy" && "Estratégia Pedagógica"}
                      {item.itemType === "answer" && "Análise do Assistente"}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {item.title}
                  </h3>

                  {item.snippet && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.itemType === "article" && (
                    <button
                      onClick={() => onViewSource(item.itemId)}
                      className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer border dark:border-indigo-800"
                    >
                      <span>Abrir Estudo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {item.itemType === "strategy" && (
                    <button
                      onClick={() => onNavigate("strategies")}
                      className="px-3.5 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer border dark:border-teal-800"
                    >
                      <span>Ver Estratégia</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {item.itemType === "answer" && (
                    <button
                      onClick={() => onNavigate("history")}
                      className="px-3.5 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer border dark:border-purple-800"
                    >
                      <span>Ver Histórico</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    title="Remover dos favoritos"
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
