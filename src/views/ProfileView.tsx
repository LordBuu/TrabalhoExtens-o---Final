import React, { useState } from "react";
import { useAuth } from "../services/authContext";
import { User, Mail, Building, GraduationCap, Shield, Save, CheckCircle2, LogOut } from "lucide-react";

export const ProfileView: React.FC = () => {
  const { profile, user, updateProfileData, logout, isAdmin } = useAuth();

  const [name, setName] = useState(profile?.name || user?.displayName || "");
  const [institution, setInstitution] = useState(profile?.institution || "Ensino Médio");
  const [subjectArea, setSubjectArea] = useState(profile?.subjectArea || "Linguagens e Códigos");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);
    try {
      await updateProfileData({
        name: name.trim(),
        institution: institution.trim(),
        subjectArea: subjectArea.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Configurações Pessoais</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Perfil do Professor
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          Gerencie suas informações docentes. Nenhum dado pessoal sobre seus alunos é armazenado no seu perfil.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Perfil atualizado com sucesso!</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail Cadastrado</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                disabled
                value={profile?.email || user?.email || "professor@escola.edu.br"}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Escola ou Rede de Ensino</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="E.E. Estadual"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Área de Atuação Principal</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-3" />
                <select
                  value={subjectArea}
                  onChange={(e) => setSubjectArea(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="Linguagens e Códigos">Linguagens e Redação</option>
                  <option value="Matemática">Matemática</option>
                  <option value="Ciências da Natureza">Ciências da Natureza (Fís/Quím/Bio)</option>
                  <option value="Ciências Humanas">Ciências Humanas (Hist/Geo/Soc/Fil)</option>
                  <option value="Educação Especial / AEE">Educação Especial / Sala de Recursos</option>
                  <option value="Gestão Pedagógica">Gestão Pedagógica / Orientação</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Nível de Acesso: <strong className="text-slate-800 dark:text-slate-200">{isAdmin ? "Administrador" : "Professor"}</strong></span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Salvando..." : "Salvar Alterações"}</span>
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deseja encerrar a sessão neste navegador?
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
