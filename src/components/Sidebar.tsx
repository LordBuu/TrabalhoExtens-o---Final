import React from "react";
import { useAuth } from "../services/authContext";
import { LayoutDashboard, Sparkles, Layers, BookOpen, History, Bookmark, User, ShieldAlert, LogOut } from "lucide-react";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { user, profile, logout, isAdmin } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "assistant", label: "Assistente IA", icon: Sparkles, highlight: true },
    { id: "strategies", label: "Estratégias", icon: Layers },
    { id: "library", label: "Biblioteca Científica", icon: BookOpen },
    { id: "history", label: "Histórico", icon: History },
    { id: "favorites", label: "Favoritos", icon: Bookmark },
    { id: "profile", label: "Perfil", icon: User },
  ];

  if (isAdmin) {
    menuItems.push({ id: "admin", label: "Painel Admin", icon: ShieldAlert, highlight: false });
  }

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex transition-colors">
      <div className="space-y-6">
        {/* Teacher profile brief */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            {(profile?.name || user?.displayName || "P")[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {profile?.name || "Professor(a)"}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {profile?.institution || "Ensino Médio"}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? item.highlight
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-indigo-900"
                    : item.highlight
                    ? "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive && !item.highlight ? "text-indigo-600 dark:text-indigo-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer warning & Logout */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 leading-tight">
          <p className="font-semibold mb-0.5">Uso Pedagógico</p>
          Não insira dados pessoais de alunos. Não substitui avaliação clínica.
        </div>

        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da conta</span>
          </button>
        )}
      </div>
    </aside>
  );
};
