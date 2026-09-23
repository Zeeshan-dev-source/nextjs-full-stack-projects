"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircleIcon, AlertCircleIcon, XMarkIcon } from "./Icons";

const ToastContext = createContext(null);

const TOAST_DURATION_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm animate-[toast-in_0.2s_ease-out] ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-300"
                : "bg-red-50/95 border-red-200 text-red-800 dark:bg-red-950/90 dark:border-red-800 dark:text-red-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 opacity-60 hover:opacity-100 transition"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
