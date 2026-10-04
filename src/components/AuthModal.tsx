import React, { useState } from "react";
import { useAuth } from "../services/authContext";
import { Mail, Lock, User, Building, GraduationCap, X, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword, loginAsDemoTeacher } = useAuth();
  const [tab, setTab] = useState<"login" | "register" | "reset">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [subjectArea, setSubjectArea] = useState("Linguagens e Códigos");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Não foi possível autenticar com o Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === "login") {
        await loginWithEmail(email, password);
        onClose();
      } else if (tab === "register") {
        if (!name.trim()) throw new Error("Por favor, informe seu nome.");
        await registerWithEmail(name, email, password, institution, subjectArea);
        onClose();
      } else if (tab === "reset") {
        await resetPassword(email);
        setSuccessMsg("E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.");
      }
    } catch (err: any) {
      let msg = err.message || "Erro durante a autenticação.";
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        msg = "Credenciais inválidas. Verifique seu e-mail e senha.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = "Este e-mail já está cadastrado. Tente fazer login.";
      } else if (msg.includes("auth/weak-password")) {
        msg = "A senha deve conter no mínimo 6 caracteres.";
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemoTeacher();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {tab === "login" && "Acesse sua conta no NeuroEdu"}
              {tab === "register" && "Cadastro de Professor"}
              {tab === "reset" && "Recuperação de Senha"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Apoio pedagógico baseado em evidências para o Ensino Médio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Sign-in button */}
          {tab !== "reset" && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:shadow-xs transition-all disabled:opacity-60 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continuar com Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">ou e-mail</span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {tab === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Prof. Maria Silva"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Escola / Rede</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="E.E. Estadual"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Área de Atuação</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                      <select
                        value={subjectArea}
                        onChange={(e) => setSubjectArea(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Linguagens e Códigos">Linguagens</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Ciências da Natureza">Ciências da Natureza</option>
                        <option value="Ciências Humanas">Ciências Humanas</option>
                        <option value="Gestão Pedagógica">Gestão Pedagógica</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail Institucional ou Pessoal</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="professor@escola.edu.br"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {tab !== "reset" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Senha</label>
                  {tab === "login" && (
                    <button
                      type="button"
                      onClick={() => setTab("reset")}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>
                    {tab === "login" && "Entrar"}
                    {tab === "register" && "Concluir Cadastro"}
                    {tab === "reset" && "Enviar Instruções"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-xl border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Experimentar imediatamente como Professor Convidado</span>
            </button>
          </div>

          {/* Toggle Tab */}
          <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
            {tab === "login" && (
              <p>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("register"); setErrorMsg(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            )}
            {tab === "register" && (
              <p>
                Já possui conta?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("login"); setErrorMsg(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  Fazer login
                </button>
              </p>
            )}
            {tab === "reset" && (
              <p>
                Lembrou a senha?{" "}
                <button
                  type="button"
                  onClick={() => { setTab("login"); setErrorMsg(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  Voltar ao login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
