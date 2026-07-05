"use client";

import * as React from "react";

export type ToastType = "default" | "success" | "warning" | "destructive";

export interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, "id">) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback(({ title, description, type = "default" }: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 gap-2 w-full max-w-sm">
        {toasts.map((t) => {
          const bgColors = {
            default: "bg-card text-foreground border-border",
            success: "bg-success text-success-foreground border-success/20",
            warning: "bg-warning text-warning-foreground border-warning/20",
            destructive: "bg-destructive text-destructive-foreground border-destructive/20",
          };

          return (
            <div
              key={t.id}
              className={`flex flex-col gap-1 p-4 rounded-xl border shadow-lg animate-in slide-in-from-bottom-5 duration-200 ${bgColors[t.type ?? "default"]}`}
            >
              {t.title && <span className="font-semibold text-sm select-none">{t.title}</span>}
              {t.description && <span className="text-xs opacity-90 select-none">{t.description}</span>}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
