import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback((message, title = 'Success') => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((message, title = 'Error') => addToast({ type: 'error', title, message }), [addToast]);
  const warning = useCallback((message, title = 'Warning') => addToast({ type: 'warning', title, message }), [addToast]);
  const info = useCallback((message, title = 'Info') => addToast({ type: 'info', title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '400px',
          width: 'calc(100vw - 3rem)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              icon: <CheckCircle2 size={20} color="#10b981" />,
              border: '#a7f3d0',
              bg: '#ffffff',
            },
            error: {
              icon: <AlertCircle size={20} color="#ef4444" />,
              border: '#fecaca',
              bg: '#ffffff',
            },
            warning: {
              icon: <AlertTriangle size={20} color="#f59e0b" />,
              border: '#fde68a',
              bg: '#ffffff',
            },
            info: {
              icon: <Info size={20} color="#3b82f6" />,
              border: '#bfdbfe',
              bg: '#ffffff',
            },
          }[toast.type] || {
            icon: <Info size={20} color="#3b82f6" />,
            border: '#e2e8f0',
            bg: '#ffffff',
          };

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                backgroundColor: typeConfig.bg,
                border: `1px solid ${typeConfig.border}`,
                borderLeft: `4px solid ${
                  toast.type === 'success'
                    ? '#10b981'
                    : toast.type === 'error'
                    ? '#ef4444'
                    : toast.type === 'warning'
                    ? '#f59e0b'
                    : '#3b82f6'
                }`,
                borderRadius: '8px',
                padding: '0.9rem 1.1rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                animation: 'scaleIn 0.2s ease-out',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{typeConfig.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                    {toast.title}
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#475569', wordBreak: 'break-word', lineHeight: 1.4 }}>
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
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
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
