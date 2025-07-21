import { useEffect, useCallback } from 'react';
import { debugLog } from '../utils/logger';

export interface DebugLoggingConfig {
  componentName: string;
  enableRenderTime?: boolean;
  enableDataLogging?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export interface DebugData {
  [key: string]: unknown;
}

export const useDebugLogging = (config: DebugLoggingConfig) => {
  const { componentName, enableRenderTime = true, enableDataLogging = true } = config;

  // Performance monitoring for component render time
  useEffect(() => {
    if (!enableRenderTime) return;
    
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      debugLog(`${componentName} component render time: ${renderTime.toFixed(2)}ms`);
    };
  }, [componentName, enableRenderTime]);

  // Log component data
  const logData = useCallback((data: DebugData) => {
    if (!enableDataLogging) return;
    
    Object.entries(data).forEach(([key, value]) => {
      debugLog(`${componentName} component - ${key}:`, value);
    });
  }, [componentName, enableDataLogging]);

  // Log single value
  const logValue = useCallback((key: string, value: unknown) => {
    if (!enableDataLogging) return;
    debugLog(`${componentName} component - ${key}:`, value);
  }, [componentName, enableDataLogging]);

  // Log hook data
  const logHookData = useCallback((hookName: string, data: DebugData) => {
    if (!enableDataLogging) return;
    
    Object.entries(data).forEach(([key, value]) => {
      debugLog(`${hookName} - ${key}:`, value);
    });
  }, [enableDataLogging]);

  // Log hook single value
  const logHookValue = useCallback((hookName: string, key: string, value: unknown) => {
    if (!enableDataLogging) return;
    debugLog(`${hookName} - ${key}:`, value);
  }, [enableDataLogging]);

  // Log component lifecycle
  const logLifecycle = useCallback((event: string, data?: DebugData) => {
    if (!enableDataLogging) return;
    
    if (data) {
      debugLog(`${componentName} component - ${event}:`, data);
    } else {
      debugLog(`${componentName} component - ${event}`);
    }
  }, [componentName, enableDataLogging]);

  return {
    logData,
    logValue,
    logHookData,
    logHookValue,
    logLifecycle,
  };
}; 