import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const success = useCallback((msg, dur) => show(msg, 'success', dur), [show]);
  const error   = useCallback((msg, dur) => show(msg, 'error', dur), [show]);
  const info    = useCallback((msg, dur) => show(msg, 'info', dur), [show]);
  const warning = useCallback((msg, dur) => show(msg, 'warning', dur), [show]);

  const iconFor = (type) => {
    if (type === 'success') return '✅';
    if (type === 'error')   return '❌';
    if (type === 'warning') return '⚠️';
    return 'ℹ️';
  };

  return (
    <ToastContext.Provider value={{ show, success, error, info, warning, remove }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast toast-${t.type}`}
            onClick={() => remove(t.id)}
            role="alert"
          >
            <span className="toast-icon">{iconFor(t.type)}</span>
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={(e) => { e.stopPropagation(); remove(t.id); }}
              aria-label="Закрыть"
            >✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}