import React, { useState, useCallback, useMemo } from 'react';
import Toast from './Toast';
import { ToastContext } from '../../hooks/useToast';
import type { ToastProps } from '../../types';

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

const ToastProvider: React.FC<{ children: React.ReactNode; toastsEnabled?: boolean }> = ({ children, toastsEnabled = true }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'success', duration });
  }, [showToast]);

  const showError = useCallback((message: string, duration = 5000) => {
    showToast({ message, type: 'error', duration });
  }, [showToast]);

  const showInfo = useCallback((message: string, duration = 3000) => {
    showToast({ message, type: 'info', duration });
  }, [showToast]);

  const contextValue = useMemo(() => ({
    showToast,
    showSuccess,
    showError,
    showInfo,
    removeToast,
  }), [showToast, showSuccess, showError, showInfo, removeToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toastsEnabled && toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider; 