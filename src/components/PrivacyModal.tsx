import React from "react";
import { Shield, AlertTriangle, UserCheck, Lock, CheckCircle, X } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Privacidade, Ética e Diretrizes NeuroEdu</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Compromisso com o anonimato dos estudantes e a prática pedagógica segura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Main Warning */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950 dark:text-amber-100">Aviso Ético Obrigatório: Esta ferramenta NÃO realiza diagnósticos clínicos.</p>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                A inteligência artificial não substitui a avaliação de médicos neuropediatras, psiquiatras, psicólogos ou fonoaudiólogos.
                Descrições comportamentais enviadas por professores são utilizadas exclusivamente para formulação de estratégias pedagógicas e adaptações curriculares em sala de aula.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Diretrizes de Anonimização (LGPD Escolar)
            </h3>
            <p className="mb-3">
              Ao formular suas perguntas no Assistente, mantenha a descrição estritamente focada nos desafios instrucionais:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Não insira nomes de estudantes:</strong> utilize termos neutros como "uma aluna do 1º ano", "um estudante do 3º ano".</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Não insira dados cadastrais:</strong> jamais informe CPF, RG, endereço, número de matrícula ou dados familiares.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Foque nas manifestações pedagógicas:</strong> descreva o tempo de foco, a resposta a estímulos visuais, a dificuldade com enunciados longos ou o ritmo de escrita.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Papel do Professor e Encaminhamentos
            </h3>
            <p>
              As recomendações geradas pelo NeuroEdu baseiam-se em literatura científica de Desenho Universal para a Aprendizagem (DUA) e neurociência educacional. Caso o estudante apresente sofrimento emocional agudo, isolamento persistente, desregulação sensorial severa ou regressão acadêmica súbita, o professor deve dialogar com a coordenação pedagógica, serviço de orientação educacional e a família para acompanhamento multidisciplinar.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  );
};
