import { useCallback } from 'react';
import { useToast } from './useToast';
import { debugLog } from '../utils/logger';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  context?: string;
}

interface ErrorHandlerResult {
  handleError: (error: unknown, message?: string, options?: ErrorHandlerOptions) => void;
  handleAsyncError: <T>(promise: Promise<T>, message?: string, options?: ErrorHandlerOptions) => Promise<T>;
  handleFirebaseError: (error: unknown, operation: string, options?: ErrorHandlerOptions) => void;
}

export const useErrorHandler = (defaultOptions: ErrorHandlerOptions = {}): ErrorHandlerResult => {
  const toast = useToast();
  const showError = toast?.showError;
  
  const defaultErrorOptions: Required<ErrorHandlerOptions> = {
    showToast: true,
    logError: true,
    context: 'unknown',
    ...defaultOptions
  };

  const handleError = useCallback((
    error: unknown, 
    message?: string, 
    options: ErrorHandlerOptions = {}
  ) => {
    const opts = { ...defaultErrorOptions, ...options };
    
    // Extract error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    const displayMessage = message || errorMessage;
    
    // Log error if enabled
    if (opts.logError) {
      debugLog(`${opts.context} - Error:`, {
        message: displayMessage,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    
    // Show toast if enabled
    if (opts.showToast && showError) showError(displayMessage);
  }, [defaultErrorOptions, showError]);

  const handleAsyncError = useCallback(async <T>(
    promise: Promise<T>, 
    message?: string, 
    options: ErrorHandlerOptions = {}
  ): Promise<T> => {
    try {
      return await promise;
    } catch (error) {
      handleError(error, message, options);
      throw error; // Re-throw to allow calling code to handle if needed
    }
  }, [handleError]);

  const handleFirebaseError = useCallback((
    error: unknown, 
    operation: string, 
    options: ErrorHandlerOptions = {}
  ) => {
    const opts = { ...defaultErrorOptions, ...options };
    const message = `Failed to ${operation}`;
    
    handleError(error, message, opts);
  }, [defaultErrorOptions, handleError]);

  return {
    handleError,
    handleAsyncError,
    handleFirebaseError,
  };
}; 