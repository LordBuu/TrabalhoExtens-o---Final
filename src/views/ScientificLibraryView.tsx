import React, { useState, useMemo } from "react";
import { ScientificSource, EvidenceLevel } from "../types";
import { EvidenceBadge } from "../components/EvidenceBadge";
import { SourceDetailModal } from "../components/SourceDetailModal";
import { Search, Filter, BookOpen, ExternalLink, Bookmark, Sparkles, X, ChevronRight } from "lucide-react";

interface ScientificLibraryViewProps {
  sources: ScientificSource[];
  onFavorite?: (source: ScientificSource) => void;
  favoritedIds?: string[];
}

export const ScientificLibraryView: React.FC<ScientificLibraryViewProps> = ({
  sources,
  onFavorite,
  favoritedIds = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeSourceModal, setActiveSourceModal] = useState<ScientificSource | null>(null);

  const conditions = useMemo(() => {
    const set = new Set<string>();
    sources.forEach((s) => {
      if (s.neurodivergence) set.add(s.neurodivergence);
    });
    return Array.from(set).sort();
  }, [sources]);

  const evidenceLevels = useMemo(() => {
    const set = new Set<string>();
    sources.forEach((s) => {
      if (s.evidenceLevel) set.add(s.evidenceLevel);
    });
    return Array.from(set).sort();
  }, [sources]);

  const filteredSources = useMemo(() => {
    return sources.filter((source) => {
      const matchesCondition = selectedCondition === "all" || source.neurodivergence === selectedCondition;
      const matchesLevel = selectedLevel === "all" || source.evidenceLevel === selectedLevel;

      if (!matchesCondition || !matchesLevel) return false;

      if (!searchTerm.trim()) return true;

      const normSearch = searchTerm.toLowerCase();
      const normTitle = source.title.toLowerCase();
      const normAuthors = source.authors.toLowerCase();
      const normAbstract = (source.abstract || "").toLowerCase();
      const normKeywords = (source.keywords || []).join(" ").toLowerCase();
      const normIntervention = (source.intervention || "").toLowerCase();

      return (
        normTitle.includes(normSearch) ||
        normAuthors.includes(normSearch) ||
        normAbstract.includes(normSearch) ||
        normKeywords.includes(normSearch) ||
        normIntervention.includes(normSearch)
      );
    });
  }, [sources, searchTerm, selectedCondition, selectedLevel]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCondition("all");
    setSelectedLevel("all");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Repositório de Evidências Científicas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Biblioteca Científica NeuroEdu
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Artigos revisados por pares, meta-análises e diretrizes internacionais dedicadas ao apoio de estudantes neurodivergentes com idade entre 13 e 17 anos no Ensino Médio. Todas as fontes contam com dados bibliográficos verificados.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por título, autor, palavra-chave, resumo..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="all">Todas as Condições</option>
              {conditions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="all">Todos os Níveis de Evidência</option>
              {evidenceLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCondition !== "all" || selectedLevel !== "all") && (
              <button
                onClick={resetFilters}
                className="px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Mostrando <strong>{filteredSources.length}</strong> estudos indexados</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Classificação conforme rigor metodológico</span>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredSources.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Nenhum estudo encontrado para os filtros selecionados</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Tente buscar com outros termos ou redefinir os filtros de nível de evidência e condição neurodivergente.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Redefinir filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSources.map((source) => {
            const isFav = favoritedIds.includes(source.id);

            return (
              <div
                key={source.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Badges and tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <EvidenceBadge level={source.evidenceLevel} size="sm" />
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                      {source.neurodivergence}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setActiveSourceModal(source)}
                    className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug cursor-pointer"
                  >
                    {source.title}
                  </h3>

                  {/* Authors, Year & Journal */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p className="font-medium text-slate-700 dark:text-slate-300">{source.authors}</p>
                    <p>
                      {source.year} {source.journal ? `• ${source.journal}` : ""}
                    </p>
                  </div>

                  {/* Abstract preview */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-serif text-[14px]">
                    {source.abstract}
                  </p>

                  {/* Keywords */}
                  {source.keywords && source.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {source.keywords.slice(0, 4).map((kw, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border dark:border-slate-700">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {onFavorite && (
                      <button
                        onClick={() => onFavorite(source)}
                        title={isFav ? "Remover dos favoritos" : "Salvar artigo"}
                        className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          isFav
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-700"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                      </button>
                    )}

                    {source.doi && (
                      <a
                        href={source.url || `https://doi.org/${source.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-mono inline-flex items-center gap-1 transition-colors"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveSourceModal(source)}
                    className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer border dark:border-indigo-800"
                  >
                    <span>Ver fonte</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeSourceModal && (
        <SourceDetailModal
          source={activeSourceModal}
          onClose={() => setActiveSourceModal(null)}
          onFavorite={onFavorite}
          isFavorited={favoritedIds.includes(activeSourceModal.id)}
        />
      )}
    </div>
  );
};
