export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default", // default, open, progress, resolved
  onClick,
  active = false,
}) {
  const variantStyles = {
    default: "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900",
    open: "border-sky-200 dark:border-sky-900/60 hover:border-sky-300 dark:hover:border-sky-800 bg-gradient-to-br from-white to-sky-50/40 dark:from-zinc-900 dark:to-sky-950/20",
    progress: "border-amber-200 dark:border-amber-900/60 hover:border-amber-300 dark:hover:border-amber-800 bg-gradient-to-br from-white to-amber-50/40 dark:from-zinc-900 dark:to-amber-950/20",
    resolved: "border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300 dark:hover:border-emerald-800 bg-gradient-to-br from-white to-emerald-50/40 dark:from-zinc-900 dark:to-emerald-950/20",
  };

  const iconBgStyles = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    open: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300",
    progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
  };

  const activeStyles = active 
    ? "ring-2 ring-indigo-500 shadow-md" 
    : "shadow-sm";

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-5 transition-all duration-200 ${variantStyles[variant] || variantStyles.default} ${activeStyles} ${
        onClick ? "cursor-pointer select-none hover:-translate-y-0.5" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg p-2.5 ${iconBgStyles[variant] || iconBgStyles.default}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
