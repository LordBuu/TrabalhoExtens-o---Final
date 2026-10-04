import React from "react";
import { Sparkles, ArrowRight, BookOpen, Layers, ShieldCheck, CheckCircle2, AlertTriangle, Users, Award, Brain, Compass, HelpCircle } from "lucide-react";

interface HomePageProps {
  onNavigate: (view: string) => void;
  onSelectSampleQuestion: (question: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectSampleQuestion }) => {
  const samplePrompts = [
    {
      title: "Concentração em aulas longas",
      tag: "TDAH",
      text: "Tenho uma aluna com TDAH que tem dificuldade para permanecer concentrada durante aulas de 50 minutos. O que posso fazer?",
    },
    {
      title: "Adaptação de prova e atividade",
      tag: "TEA",
      text: "Como posso adaptar uma atividade de matemática para um aluno com TEA?",
    },
    {
      title: "Início de tarefas e organização",
      tag: "Funções Executivas",
      text: "Um aluno apresenta dificuldade para iniciar atividades e organizar as tarefas. Quais estratégias podem ajudar?",
    },
    {
      title: "Avaliação justa e inclusiva",
      tag: "Avaliação & UDL",
      text: "Como posso organizar uma avaliação para um estudante neurodivergente sem prejudicar os objetivos pedagógicos?",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Educação Inclusiva no Ensino Médio (13 a 17 anos)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
            NeuroEdu — Apoio inteligente para professores
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Estratégias pedagógicas baseadas em evidências para apoiar estudantes neurodivergentes no Ensino Médio.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("assistant")}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pergunte ao Assistente</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate("strategies")}
              className="px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Explorar estratégias</span>
            </button>
          </div>

          {/* Quick Questions Interactive Showcase */}
          <div className="pt-10 max-w-4xl mx-auto text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center sm:text-left">
              Situações reais de sala de aula (clique para consultar):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSampleQuestion(sample.text)}
                  className="p-3.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-indigo-900">
                      {sample.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    "{sample.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Fluxo Transparente</span>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Como funciona o NeuroEdu?</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Uma ponte rigorosa entre a literatura científica revisada por pares e a prática pedagógica diária do Ensino Médio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-extrabold text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">O professor descreve sua dúvida.</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Você relata a situação concreta vivenciada em sala com linguagem simples, sem necessidade de dados pessoais do aluno.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-xs relative space-y-4 ring-1 ring-indigo-500/10">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center font-extrabold text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              A inteligência artificial analisa a situação e consulta conteúdos científicos.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              O sistema utiliza a arquitetura RAG (Geração Aumentada por Recuperação) para localizar estudos de alta evidência na biblioteca antes de formular a resposta.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs relative space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-extrabold text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              O professor recebe estratégias práticas com referências.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Apresentação estruturada com resumo, passo a passo para a aula, o que observar, cuidados éticos e links diretos para os artigos (DOI).
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-slate-900/90 text-white relative overflow-hidden shadow-xl border dark:border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Por que utilizar o NeuroEdu</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Benefícios para o professor e para a comunidade escolar
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Projetado especificamente para as complexidades do Ensino Médio, respeitando o tempo do docente e a individualidade de cada estudante.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <Award className="w-6 h-6 text-teal-400" />
              <h4 className="font-bold text-slate-100 text-base">Estratégias baseadas em evidências</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recomendações fundamentadas em revisões sistemáticas, meta-análises e diretrizes internacionais.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h4 className="font-bold text-slate-100 text-base">Respostas rápidas e práticas</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Orientações objetivas em poucos segundos para aplicar na aula do mesmo dia ou na semana seguinte.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-slate-100 text-base">Referências científicas reais</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nada de fontes inventadas. Todos os estudos contam com autores, ano, periódico e DOI verificado.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <Layers className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold text-slate-100 text-base">Adaptações pedagógicas reais</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sugestões de avaliação e atividades sem rebaixar o nível cognitivo ou comprometer a ementa do Ensino Médio.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <Compass className="w-6 h-6 text-cyan-400" />
              <h4 className="font-bold text-slate-100 text-base">Organização de informações</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Histórico pessoal de perguntas, repositório de favoritos e exportação limpa para planejamento pedagógico.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <Users className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-slate-100 text-base">Apoio contínuo ao professor</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Segurança instrucional para planejar aulas inclusivas com respaldo teórico e metodológico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Ética & Limitações */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2 text-sm text-amber-950 dark:text-amber-200">
            <h3 className="font-bold text-base text-amber-950 dark:text-amber-100">Aviso Ético e Legal</h3>
            <p className="leading-relaxed text-xs sm:text-sm text-amber-900 dark:text-amber-300">
              O NeuroEdu é uma ferramenta estritamente pedagógica de apoio ao professor. <strong>Não substitui avaliação clínica, diagnóstica ou o acompanhamento de profissionais especializados</strong> (neurologistas, psiquiatras, psicólogos, terapeutas ocupacionais e psicopedagogos).
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-400">
              A plataforma não emite laudos e incentiva sempre o diálogo harmônico entre corpo docente, equipe pedagógica, família e os profissionais de saúde responsáveis pelo acompanhamento do jovem.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
