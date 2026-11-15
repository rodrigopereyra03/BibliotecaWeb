import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, title, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, title = 'Operación Exitosa') => addToast(msg, 'success', title),
    error: (msg, title = 'Atención') => addToast(msg, 'error', title),
    info: (msg, title = 'Información') => addToast(msg, 'info', title),
    warning: (msg, title = 'Aviso') => addToast(msg, 'warning', title),
    dismiss: removeToast,
  };

  // Safe intercept of window.alert to completely prevent browser native alerts
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg) => {
      const text = String(msg || '');
      if (text.toLowerCase().includes('error') || text.toLowerCase().includes('no se encontró') || text.toLowerCase().includes('no disponible')) {
        toast.error(text);
      } else if (text.toLowerCase().includes('éxito') || text.toLowerCase().includes('bienvenido') || text.toLowerCase().includes('guardado')) {
        toast.success(text);
      } else {
        toast.info(text);
      }
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Container */}
      <div
        className="fixed top-5 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => {
          let icon = 'info';
          let borderClass = 'border-gold-burnished/40';
          let bgIconClass = 'bg-gold-light/60 text-gold-burnished border-gold-burnished/30';
          let titleText = t.title || 'Información';

          if (t.type === 'success') {
            icon = 'check_circle';
            borderClass = 'border-emerald-300';
            bgIconClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            titleText = t.title || 'Completado con Éxito';
          } else if (t.type === 'error') {
            icon = 'error';
            borderClass = 'border-rose-300';
            bgIconClass = 'bg-rose-50 text-rose-700 border-rose-200';
            titleText = t.title || 'Atención';
          } else if (t.type === 'warning') {
            icon = 'warning';
            borderClass = 'border-amber-300';
            bgIconClass = 'bg-amber-50 text-amber-800 border-amber-200';
            titleText = t.title || 'Aviso Parroquial';
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border ${borderClass} shadow-xl text-sepia-ink select-none hover:shadow-2xl`}
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${bgIconClass} shadow-2xs`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <h5 className="text-xs font-bold font-display text-sepia-heading leading-tight truncate">
                  {titleText}
                </h5>
                <p className="text-[12px] text-warm-charcoal mt-0.5 leading-snug break-words">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-stone-400 hover:text-sepia-heading p-1 rounded-lg hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      success: (msg) => console.log('Toast success:', msg),
      error: (msg) => console.error('Toast error:', msg),
      info: (msg) => console.info('Toast info:', msg),
      warning: (msg) => console.warn('Toast warning:', msg),
      dismiss: () => {},
    };
  }
  return context;
}
