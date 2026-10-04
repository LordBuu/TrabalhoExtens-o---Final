import React, { useState, useMemo } from "react";
import { Strategy, ScientificSource } from "../types";
import { Layers, Search, Bookmark, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Sparkles, BookOpen } from "lucide-react";

interface StrategiesViewProps {
  strategies: Strategy[];
  sources: ScientificSource[];
  onFavorite?: (strategy: Strategy) => void;
  favoritedIds?: string[];
  onViewSource?: (sourceId: string) => void;
}

export const StrategiesView: React.FC<StrategiesViewProps> = ({
  strategies,
  sources,
  onFavorite,
  favoritedIds = [],
  onViewSource,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    strategies.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [strategies]);

  const filteredStrategies = useMemo(() => {
    return strategies.filter((st) => {
      const matchesCat = selectedCategory === "all" || st.category === selectedCategory;
      if (!matchesCat) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();

      return (
        st.name.toLowerCase().includes(term) ||
        st.description.toLowerCase().includes(term) ||
        st.targetAudience.toLowerCase().includes(term) ||
        st.situation.toLowerCase().includes(term) ||
        st.howToApply.toLowerCase().includes(term)
      );
    });
  }, [strategies, searchTerm, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Acomodações e Desenho Universal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Biblioteca de Estratégias Pedagógicas
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Catálogo prático de adaptações metodológicas, rotinas de sala de aula e desenhos avaliativos universais testados para adolescentes de 13 a 17 anos no Ensino Médio.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar estratégias por nome, público-alvo ou aplicação..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
        >
          <option value="all">Todas as Categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Strategies List */}
      <div className="space-y-4">
        {filteredStrategies.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
            Nenhuma estratégia encontrada com esses termos.
          </div>
        ) : (
          filteredStrategies.map((strat) => {
            const isExpanded = expandedId === strat.id;
            const isFav = favoritedIds.includes(strat.id);

            const linkedSources = sources.filter((s) => (strat.referenceIds || []).includes(s.id));

            return (
              <div
                key={strat.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 shadow-2xs transition-all overflow-hidden"
              >
                {/* Collapsible Header */}
                <div
                  onClick={() => toggleExpand(strat.id)}
                  className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                        {strat.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>Público:</strong> {strat.targetAudience}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {strat.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-serif text-[15px]">
                      {strat.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    {onFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFavorite(strat);
                        }}
                        title={isFav ? "Remover dos favoritos" : "Salvar estratégia"}
                        className={`p-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                          isFav
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    )}

                    <div className="p-2 text-slate-400 dark:text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 sm:px-6 space-y-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-850/30 pt-5 text-xs text-slate-700 dark:text-slate-300">
                    {/* Situação em que pode ser utilizada */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] block">
                        Cenário de Sala de Aula Indicado
                      </span>
                      <p className="leading-relaxed text-slate-600 dark:text-slate-300">{strat.situation}</p>
                    </div>

                    {/* Como aplicar (Passo a passo) */}
                    <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 space-y-2">
                      <span className="font-bold text-teal-950 dark:text-teal-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                        Como Aplicar na Prática do Ensino Médio
                      </span>
                      <div className="space-y-1 text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-normal">
                        {strat.howToApply}
                      </div>
                    </div>

                    {/* Grid Benefícios e Limitações */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
                        <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Benefícios Esperados
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{strat.expectedBenefits}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                        <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          Cuidados e Limitações
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{strat.limitations}</p>
                      </div>
                    </div>

                    {/* Referências científicas vinculadas */}
                    {linkedSources.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          Fundamentação Científica Vinculada
                        </span>
                        <div className="space-y-1.5">
                          {linkedSources.map((ls) => (
                            <div
                              key={ls.id}
                              onClick={() => onViewSource && onViewSource(ls.id)}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2 cursor-pointer transition-colors"
                            >
                              <div className="overflow-hidden">
                                <p className="font-semibold text-xs truncate text-indigo-900 dark:text-indigo-300">
                                  {ls.title}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {ls.authors} ({ls.year}) • {ls.evidenceLevel}
                                </p>
                              </div>
                              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                                Ver artigo →
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
