import React, { useState } from "react";
import { ScientificSource, Strategy, EvidenceLevel } from "../types";
import { addScientificSource, addStrategy } from "../services/scientificSourceService";
import { ShieldAlert, BookOpen, Layers, Plus, CheckCircle, Database, Users, Sparkles, AlertCircle } from "lucide-react";

interface AdminPanelViewProps {
  sources: ScientificSource[];
  strategies: Strategy[];
  onRefreshData: () => Promise<void>;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  sources,
  strategies,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<"sources" | "strategies">("sources");

  // New Source Form
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceAuthors, setSourceAuthors] = useState("");
  const [sourceYear, setSourceYear] = useState<number>(2024);
  const [sourceJournal, setSourceJournal] = useState("");
  const [sourceDoi, setSourceDoi] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceAbstract, setSourceAbstract] = useState("");
  const [sourceKeywords, setSourceKeywords] = useState("");
  const [sourceNeuro, setSourceNeuro] = useState("TDAH");
  const [sourceLevel, setSourceLevel] = useState<EvidenceLevel>("Revisão sistemática");
  const [sourceContent, setSourceContent] = useState("");
  const [sourceSubmitting, setSourceSubmitting] = useState(false);
  const [sourceSuccess, setSourceSuccess] = useState(false);

  // New Strategy Form
  const [stratName, setStratName] = useState("");
  const [stratDesc, setStratDesc] = useState("");
  const [stratAudience, setStratAudience] = useState("");
  const [stratSituation, setStratSituation] = useState("");
  const [stratHowTo, setStratHowTo] = useState("");
  const [stratBenefits, setStratBenefits] = useState("");
  const [stratLimitations, setStratLimitations] = useState("");
  const [stratCategory, setStratCategory] = useState("Funções Executivas e Organização");
  const [stratSubmitting, setStratSubmitting] = useState(false);
  const [stratSuccess, setStratSuccess] = useState(false);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSourceSubmitting(true);
    setSourceSuccess(false);

    try {
      const keywordsArray = sourceKeywords.split(",").map((k) => k.trim()).filter(Boolean);
      await addScientificSource({
        title: sourceTitle.trim(),
        authors: sourceAuthors.trim(),
        year: Number(sourceYear),
        journal: sourceJournal.trim(),
        doi: sourceDoi.trim(),
        url: sourceUrl.trim(),
        abstract: sourceAbstract.trim(),
        keywords: keywordsArray,
        neurodivergence: sourceNeuro,
        ageRange: "13-17 anos",
        educationalContext: "Ensino Médio",
        intervention: "Adaptação Curricular",
        evidenceLevel: sourceLevel,
        content: sourceContent.trim(),
        demo: false,
      });

      setSourceSuccess(true);
      setSourceTitle("");
      setSourceAuthors("");
      setSourceJournal("");
      setSourceDoi("");
      setSourceAbstract("");
      setSourceContent("");
      await onRefreshData();
      setTimeout(() => setSourceSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding source:", err);
    } finally {
      setSourceSubmitting(false);
    }
  };

  const handleAddStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setStratSubmitting(true);
    setStratSuccess(false);

    try {
      await addStrategy({
        name: stratName.trim(),
        description: stratDesc.trim(),
        targetAudience: stratAudience.trim() || "Estudantes neurodivergentes do Ensino Médio",
        situation: stratSituation.trim(),
        howToApply: stratHowTo.trim(),
        expectedBenefits: stratBenefits.trim(),
        limitations: stratLimitations.trim(),
        category: stratCategory,
        referenceIds: [],
        demo: false,
      });

      setStratSuccess(true);
      setStratName("");
      setStratDesc("");
      setStratSituation("");
      setStratHowTo("");
      setStratBenefits("");
      setStratLimitations("");
      await onRefreshData();
      setTimeout(() => setStratSuccess(false), 3000);
    } catch (err) {
      console.error("Error adding strategy:", err);
    } finally {
      setStratSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-purple-900 dark:bg-purple-950 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-3 border dark:border-purple-900/60 transition-colors">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Gestão da Base de Conhecimento RAG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Painel Administrativo NeuroEdu
        </h1>
        <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
          Área restrita para curadoria e homologação de estudos científicos reais, níveis de evidência e estratégias práticas autorizadas para uso pelo modelo Gemini.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-purple-800 dark:border-purple-850 text-xs">
          <div>
            <span className="text-purple-300 block">Artigos Cadastrados</span>
            <span className="text-xl font-extrabold">{sources.length}</span>
          </div>
          <div>
            <span className="text-purple-300 block">Estratégias Práticas</span>
            <span className="text-xl font-extrabold">{strategies.length}</span>
          </div>
          <div>
            <span className="text-purple-300 block">Status Firestore</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Ativo
            </span>
          </div>
          <div>
            <span className="text-purple-300 block">Modelo RAG</span>
            <span className="text-teal-300 font-bold">Gemini 3.8 Flash</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("sources")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "sources"
              ? "bg-purple-700 text-white shadow-xs"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cadastrar Estudo Científico</span>
        </button>

        <button
          onClick={() => setActiveTab("strategies")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "strategies"
              ? "bg-purple-700 text-white shadow-xs"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Cadastrar Nova Estratégia</span>
        </button>
      </div>

      {/* Tab: Add Source */}
      {activeTab === "sources" && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Adicionar Artigo ou Diretriz Científica
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Insira apenas artigos reais de periódicos indexados para manter o rigor científico contra alucinações da IA.
            </p>
          </div>

          {sourceSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Estudo científico cadastrado com sucesso no Firestore!</span>
            </div>
          )}

          <form onSubmit={handleAddSource} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Título da Pesquisa / Publicação</label>
              <input
                type="text"
                required
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                placeholder="Ex: School-Based Interventions for Adolescents with ADHD: A Systematic Review"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Autores (formato acadêmico)</label>
                <input
                  type="text"
                  required
                  value={sourceAuthors}
                  onChange={(e) => setSourceAuthors(e.target.value)}
                  placeholder="DuPaul, G. J., Chronis-Tuscano, A., et al."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ano</label>
                <input
                  type="number"
                  required
                  min={1950}
                  max={2030}
                  value={sourceYear}
                  onChange={(e) => setSourceYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Periódico / Instituição</label>
                <input
                  type="text"
                  value={sourceJournal}
                  onChange={(e) => setSourceJournal(e.target.value)}
                  placeholder="School Psychology Review"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">DOI (ex: 10.1080/...)</label>
                <input
                  type="text"
                  value={sourceDoi}
                  onChange={(e) => setSourceDoi(e.target.value)}
                  placeholder="10.1080/02796015.2019.12087563"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nível de Evidência Científica</label>
                <select
                  value={sourceLevel}
                  onChange={(e) => setSourceLevel(e.target.value as EvidenceLevel)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                >
                  <option value="Revisão sistemática">Revisão sistemática</option>
                  <option value="Meta-análise">Meta-análise</option>
                  <option value="Ensaio clínico/controlado">Ensaio clínico/controlado</option>
                  <option value="Estudo observacional">Estudo observacional</option>
                  <option value="Estudo qualitativo">Estudo qualitativo</option>
                  <option value="Diretriz/consenso">Diretriz/consenso</option>
                  <option value="Revisão narrativa">Revisão narrativa</option>
                  <option value="Fonte institucional">Fonte institucional</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Neurodivergência Principal</label>
                <select
                  value={sourceNeuro}
                  onChange={(e) => setSourceNeuro(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                >
                  <option value="TDAH">TDAH</option>
                  <option value="TEA">TEA (Autismo)</option>
                  <option value="Dislexia">Dislexia</option>
                  <option value="Discalculia">Discalculia</option>
                  <option value="Funções Executivas">Funções Executivas</option>
                  <option value="TDL">TDL (Linguagem)</option>
                  <option value="Inclusão & UDL">Inclusão Geral & UDL</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Palavras-chave (separadas por vírgula)</label>
              <input
                type="text"
                value={sourceKeywords}
                onChange={(e) => setSourceKeywords(e.target.value)}
                placeholder="TDAH, Ensino Médio, Atenção, Adaptação, Provas"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resumo da Pesquisa (Abstract)</label>
              <textarea
                rows={3}
                required
                value={sourceAbstract}
                onChange={(e) => setSourceAbstract(e.target.value)}
                placeholder="Síntese metodológica do artigo e dados observados com adolescentes..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Achados & Aplicação Pedagógica para o RAG</label>
              <textarea
                rows={3}
                required
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                placeholder="Explique detalhadamente como o professor do Ensino Médio aplica esses achados na sala de aula..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={sourceSubmitting}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{sourceSubmitting ? "Salvando no Firestore..." : "Cadastrar Fonte Científica"}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: Add Strategy */}
      {activeTab === "strategies" && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Cadastrar Nova Estratégia Pedagógica
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adicione intervenções práticas e rotinas estruturadas para o catálogo do professor.
            </p>
          </div>

          {stratSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Estratégia adicionada ao catálogo com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleAddStrategy} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nome da Estratégia</label>
              <input
                type="text"
                required
                value={stratName}
                onChange={(e) => setStratName(e.target.value)}
                placeholder="Ex: Checklists Visuais de Auto-Monitoramento"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Categoria</label>
                <select
                  value={stratCategory}
                  onChange={(e) => setStratCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
                >
                  <option value="Funções Executivas e Organização">Funções Executivas e Organização</option>
                  <option value="Comunicação e Linguagem">Comunicação e Linguagem</option>
                  <option value="Metodologia e Ensino Universal (UDL)">Metodologia e Ensino Universal (UDL)</option>
                  <option value="Regulação Atencional e Comportamental">Regulação Atencional e Comportamental</option>
                  <option value="Avaliação Inclusiva">Avaliação Inclusiva</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Público-Alvo Indicado</label>
                <input
                  type="text"
                  value={stratAudience}
                  onChange={(e) => setStratAudience(e.target.value)}
                  placeholder="Estudantes com TDAH e dificuldades organizacionais"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Descrição Sucinta</label>
              <textarea
                rows={2}
                required
                value={stratDesc}
                onChange={(e) => setStratDesc(e.target.value)}
                placeholder="Explique o conceito geral da estratégia em duas frases..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cenário de Sala de Aula Indicado</label>
              <input
                type="text"
                required
                value={stratSituation}
                onChange={(e) => setStratSituation(e.target.value)}
                placeholder="Trabalhos longos de pesquisa ou preparação para provas bimestrais..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Como Aplicar (Passo a Passo Prático)</label>
              <textarea
                rows={4}
                required
                value={stratHowTo}
                onChange={(e) => setStratHowTo(e.target.value)}
                placeholder="1. Elabore a lista com no máximo 5 etapas...&#10;2. Solicite que o aluno marque cada item...&#10;3. Faça verificação rápida em 30 segundos..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Benefícios Esperados</label>
                <textarea
                  rows={2}
                  value={stratBenefits}
                  onChange={(e) => setStratBenefits(e.target.value)}
                  placeholder="Redução de paralisia de início de tarefa e ganho de autonomia..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cuidados e Limitações</label>
                <textarea
                  rows={2}
                  value={stratLimitations}
                  onChange={(e) => setStratLimitations(e.target.value)}
                  placeholder="Não sobrecarregar com listas excessivamente burocráticas..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={stratSubmitting}
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />
              <span>{stratSubmitting ? "Salvando..." : "Cadastrar Estratégia no Catálogo"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
