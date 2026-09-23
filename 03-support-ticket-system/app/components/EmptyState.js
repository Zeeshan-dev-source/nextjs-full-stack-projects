import { TicketIcon, PlusCircleIcon } from "./Icons";
import Link from "next/link";

export default function EmptyState({
  title = "No tickets found",
  description = "Get started by creating your first support ticket.",
  actionLabel = "Create Ticket",
  actionHref = "/create-ticket",
  icon: Icon = TicketIcon,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {actionHref && actionLabel && (
        <div className="mt-6">
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
          >
            <PlusCircleIcon className="h-4 w-4" />
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
