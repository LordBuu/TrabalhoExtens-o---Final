import React from "react";
import { ScientificSource } from "../types";
import { EvidenceBadge } from "./EvidenceBadge";
import { X, ExternalLink, BookOpen, Sparkles, Check, Bookmark, Calendar, Users, Layers } from "lucide-react";

interface SourceDetailModalProps {
  source: ScientificSource | null;
  onClose: () => void;
  onFavorite?: (source: ScientificSource) => void;
  isFavorited?: boolean;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  onFavorite,
  isFavorited = false,
}) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="space-y-2 max-w-[85%]">
            <div className="flex flex-wrap items-center gap-2">
              <EvidenceBadge level={source.evidenceLevel} size="md" />
              <span className="px-2.5 py-1 text-xs rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-900">
                {source.neurodivergence}
              </span>
              {source.demo && (
                <span className="px-2 py-0.5 text-xs rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                  Exemplo Demonstrativo
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{source.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-600 dark:text-slate-300">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Autores: </span>
                <span className="text-slate-600 dark:text-slate-400">{source.authors}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Ano: </span>
                <span className="text-slate-600 dark:text-slate-400">{source.year} ({source.journal || "Periódico indexado"})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Faixa Etária: </span>
                <span className="text-slate-600 dark:text-slate-400">{source.ageRange || "Adolescentes (13-17 anos)"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Contexto: </span>
                <span className="text-slate-600 dark:text-slate-400">{source.educationalContext}</span>
              </div>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Resumo da Pesquisa
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950/80 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs font-serif text-[15px]">
              {source.abstract}
            </p>
          </div>

          {/* Practical Application / Content */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Achados & Aplicação Pedagógica
            </h3>
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
              {source.content}
            </div>
          </div>

          {/* Intervention summary */}
          {source.intervention && (
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Intervenção estudada: </span>
              <span className="text-slate-600 dark:text-slate-400">{source.intervention}</span>
            </div>
          )}

          {/* Keywords */}
          {source.keywords && source.keywords.length > 0 && (
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">Palavras-chave:</span>
              <div className="flex flex-wrap gap-1.5">
                {source.keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs border dark:border-slate-700">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* DOI / External link */}
          {source.doi && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">DOI: {source.doi}</span>
              <a
                href={source.url || `https://doi.org/${source.doi}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                <span>Acessar no periódico oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          {onFavorite && (
            <button
              onClick={() => onFavorite(source)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors cursor-pointer ${
                isFavorited
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isFavorited ? "Salvo em Favoritos" : "Salvar Artigo"}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
