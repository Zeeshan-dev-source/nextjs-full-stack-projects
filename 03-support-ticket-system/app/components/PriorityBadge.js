export default function PriorityBadge({ priority, size = "md", compact = false }) {
  const normalized = (priority || "Medium").trim().toLowerCase();

  let badgeStyles = "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
  let icon = "—";

  if (normalized === "low") {
    badgeStyles = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700";
    icon = "↓";
  } else if (normalized === "medium") {
    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
    icon = "=";
  } else if (normalized === "high") {
    badgeStyles = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";
    icon = "↑";
  }

  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-xs"
    : size === "lg"
    ? "px-3.5 py-1 text-sm font-semibold"
    : "px-2.5 py-1 text-xs font-medium";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses} ${badgeStyles} transition-colors`}>
      <span aria-hidden="true" className="font-bold leading-none">{icon}</span>
      <span>{compact ? label : `${label} Priority`}</span>
    </span>
  );
}
