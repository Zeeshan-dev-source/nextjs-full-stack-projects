"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertIcon, CheckCircleIcon, InfoIcon, XIcon } from "./Icons";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: string };
type ShowToast = (type: ToastType, message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}

const STYLES: Record<ToastType, { Icon: typeof InfoIcon; icon: string }> = {
  success: { Icon: CheckCircleIcon, icon: "text-emerald-500" },
  error: { Icon: AlertIcon, icon: "text-red-500" },
  info: { Icon: InfoIcon, icon: "text-blue-500" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback<ShowToast>((type, message) => {
    const id = ++nextId.current;
    // Keep at most 3 toasts on screen.
    setToasts((current) => [...current.slice(-2), { id, type, message }]);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const { Icon, icon } = STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(
      () => onDismiss(toast.id),
      toast.type === "error" ? 6000 : 3500
    );
    return () => clearTimeout(timer);
  }, [toast.id, toast.type, onDismiss]);

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-sm shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30"
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${icon}`} />
      <p className="flex-1 pt-0.5 text-slate-700 dark:text-slate-200">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="cursor-pointer rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
