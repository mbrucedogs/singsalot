import { useEffect, useRef, useCallback } from 'react';
import { debugLog } from '../utils/logger';

interface PerformanceMetrics {
  renderTime: number;
  renderCount: number;
  averageRenderTime: number;
  slowestRender: number;
  fastestRender: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  threshold?: number; // Log warnings for renders slower than this (ms)
  trackReasons?: boolean;
}

export const usePerformanceMonitor = (options: UsePerformanceMonitorOptions) => {
  const { componentName, enabled = true, threshold = 16, trackReasons = false } = options;
  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    renderCount: 0,
    averageRenderTime: 0,
    slowestRender: 0,
    fastestRender: Infinity
  });
  const renderStartTimeRef = useRef<number>(0);
  const lastPropsRef = useRef<Record<string, unknown>>({});

  // Start timing render
  useEffect(() => {
    if (!enabled) return;

    renderStartTimeRef.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTimeRef.current;
      const metrics = metricsRef.current;
      
      metrics.renderTime = renderTime;
      metrics.renderCount++;
      
      // Update statistics
      metrics.averageRenderTime = (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;
      metrics.slowestRender = Math.max(metrics.slowestRender, renderTime);
      metrics.fastestRender = Math.min(metrics.fastestRender, renderTime);
      
      // Log slow renders
      if (renderTime > threshold) {
        debugLog(`${componentName} - Slow render detected:`, {
          renderTime: renderTime.toFixed(2),
          threshold,
          renderCount: metrics.renderCount,
          averageRenderTime: metrics.averageRenderTime.toFixed(2)
        });
      }
      
      // Log performance summary every 10 renders
      if (metrics.renderCount % 10 === 0) {
        debugLog(`${componentName} - Performance summary:`, {
          renderCount: metrics.renderCount,
          averageRenderTime: metrics.averageRenderTime.toFixed(2),
          slowestRender: metrics.slowestRender.toFixed(2),
          fastestRender: metrics.fastestRender.toFixed(2)
        });
      }
    };
  });

  // Track prop changes
  const trackProps = useCallback((props: Record<string, unknown>) => {
    if (!enabled || !trackReasons) return;

    const lastProps = lastPropsRef.current;
    const changedProps: string[] = [];

    Object.keys(props).forEach(key => {
      if (props[key] !== lastProps[key]) {
        changedProps.push(key);
      }
    });

    if (changedProps.length > 0) {
      debugLog(`${componentName} - Props changed:`, changedProps);
    }

    lastPropsRef.current = { ...props };
  }, [componentName, enabled, trackReasons]);

  // Get current metrics
  const getMetrics = useCallback(() => metricsRef.current, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderTime: 0,
      renderCount: 0,
      averageRenderTime: 0,
      slowestRender: 0,
      fastestRender: Infinity
    };
  }, []);

  return {
    trackProps,
    getMetrics,
    resetMetrics
  };
}; 