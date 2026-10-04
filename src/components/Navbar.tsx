import React from "react";
import { useAuth } from "../services/authContext";
import { useTheme } from "../services/themeContext";
import { Brain, Shield, User, LogOut, Menu, X, Sparkles, BookOpen, Layers, History, Bookmark, Settings, Sun, Moon } from "lucide-react";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onOpenPrivacy: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenPrivacy,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { user, profile, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">NeuroEdu</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                  Ensino Médio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Apoio Pedagógico Baseado em Evidências</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate("home")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentView === "home"
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              Início
            </button>
            <button
              onClick={() => onNavigate("assistant")}
              className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentView === "assistant"
                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                  : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Assistente IA</span>
            </button>
            <button
              onClick={() => onNavigate("strategies")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentView === "strategies"
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              Estratégias
            </button>
            <button
              onClick={() => onNavigate("library")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentView === "library"
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              Biblioteca Científica
            </button>
            {(user || profile) && (
              <>
                <button
                  onClick={() => onNavigate("history")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    currentView === "history"
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  Histórico
                </button>
                <button
                  onClick={() => onNavigate("favorites")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    currentView === "favorites"
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  Favoritos
                </button>
              </>
            )}
            {isAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === "admin"
                    ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-semibold"
                    : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800"
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Right actions: Theme toggle + Privacy info + User button */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
              aria-label="Alternar tema claro/escuro"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            <button
              onClick={onOpenPrivacy}
              title="Diretrizes éticas e anonimização de estudantes"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Ética & LGPD</span>
            </button>

            {user || profile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {(profile?.name || user?.displayName || "P")[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {profile?.name?.split(" ")[0] || "Professor"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {profile?.role === "admin" ? "Admin" : "Professor"}
                    </p>
                  </div>
                </button>
                <button
                  onClick={logout}
                  title="Sair"
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                Entrar / Cadastrar
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tema da Interface</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
            </button>
          </div>

          <button
            onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200"
          >
            Início
          </button>
          <button
            onClick={() => { onNavigate("assistant"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Assistente IA</span>
          </button>
          <button
            onClick={() => { onNavigate("strategies"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 dark:text-slate-200"
          >
            <Layers className="w-4 h-4" />
            <span>Estratégias Pedagógicas</span>
          </button>
          <button
            onClick={() => { onNavigate("library"); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 dark:text-slate-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca Científica</span>
          </button>
          {(user || profile) && (
            <>
              <button
                onClick={() => { onNavigate("history"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 dark:text-slate-200"
              >
                <History className="w-4 h-4" />
                <span>Histórico de Perguntas</span>
              </button>
              <button
                onClick={() => { onNavigate("favorites"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 dark:text-slate-200"
              >
                <Bookmark className="w-4 h-4" />
                <span>Meus Favoritos</span>
              </button>
              <button
                onClick={() => { onNavigate("profile"); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 dark:text-slate-200"
              >
                <Settings className="w-4 h-4" />
                <span>Perfil do Professor</span>
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => { onNavigate("admin"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800"
            >
              Painel Administrativo
            </button>
          )}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => { onOpenPrivacy(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Diretrizes Éticas e LGPD Escolar</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
