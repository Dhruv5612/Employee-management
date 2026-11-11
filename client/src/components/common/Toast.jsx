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
              icon: <CheckCircle2 size={20} color="#C6F432" />,
              border: 'rgba(198, 244, 50, 0.35)',
              accent: '#C6F432',
              bg: '#141614',
            },
            error: {
              icon: <AlertCircle size={20} color="#FCA5A5" />,
              border: 'rgba(239, 68, 68, 0.35)',
              accent: '#EF4444',
              bg: '#141614',
            },
            warning: {
              icon: <AlertTriangle size={20} color="#FDE047" />,
              border: 'rgba(250, 204, 21, 0.35)',
              accent: '#FDE047',
              bg: '#141614',
            },
            info: {
              icon: <Info size={20} color="#FFFFFF" />,
              border: 'rgba(255, 255, 255, 0.22)',
              accent: '#FFFFFF',
              bg: '#141614',
            },
          }[toast.type] || {
            icon: <Info size={20} color="#FFFFFF" />,
            border: 'rgba(255, 255, 255, 0.22)',
            accent: '#FFFFFF',
            bg: '#141614',
          };

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                backgroundColor: typeConfig.bg,
                border: `1px solid ${typeConfig.border}`,
                borderLeft: `4px solid ${typeConfig.accent}`,
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                boxShadow: '0 20px 44px rgba(0, 0, 0, 0.65)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                animation: 'scaleIn 0.2s ease-out',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{typeConfig.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
                    {toast.title}
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#A1A1AA', wordBreak: 'break-word', lineHeight: 1.4 }}>
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#71717A',
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
