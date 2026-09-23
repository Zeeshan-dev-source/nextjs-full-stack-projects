export default function StatusBadge({ status, size = "md" }) {
  const normalized = (status || "").trim().toLowerCase();

  let badgeStyles = "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
  let dotStyles = "bg-zinc-400";

  if (normalized === "open") {
    badgeStyles = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800";
    dotStyles = "bg-sky-500 animate-pulse";
  } else if (normalized === "in progress" || normalized === "inprogress") {
    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
    dotStyles = "bg-amber-500 animate-pulse";
  } else if (normalized === "resolved" || normalized === "closed") {
    badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
    dotStyles = "bg-emerald-500";
  }

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs" 
    : size === "lg" 
    ? "px-3.5 py-1 text-sm font-semibold" 
    : "px-2.5 py-1 text-xs font-medium";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${badgeStyles} transition-colors`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
      <span>{status || "Open"}</span>
    </span>
  );
}
