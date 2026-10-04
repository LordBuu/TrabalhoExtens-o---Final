import React from "react";
import { EvidenceLevel } from "../types";
import { ShieldCheck, Award, FileText, CheckCircle2, Bookmark, HelpCircle } from "lucide-react";

interface EvidenceBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  level,
  size = "md",
  showIcon = true,
}) => {
  let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  let Icon = FileText;

  switch (level as EvidenceLevel) {
    case "Revisão sistemática":
    case "Meta-análise":
      badgeStyle = "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-semibold";
      Icon = Award;
      break;
    case "Ensaio clínico/controlado":
      badgeStyle = "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800 font-semibold";
      Icon = ShieldCheck;
      break;
    case "Diretriz/consenso":
      badgeStyle = "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-medium";
      Icon = CheckCircle2;
      break;
    case "Estudo observacional":
    case "Estudo qualitativo":
      badgeStyle = "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-medium";
      Icon = Bookmark;
      break;
    case "Fonte institucional":
      badgeStyle = "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-medium";
      Icon = FileText;
      break;
    case "Revisão narrativa":
    default:
      badgeStyle = "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-medium";
      Icon = HelpCircle;
      break;
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${sizeClasses[size]} ${badgeStyle}`}
      title={`Nível de Evidência Científica: ${level}`}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      <span>{level}</span>
    </span>
  );
};
