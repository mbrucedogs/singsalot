import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IonList, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  className?: string;
}

interface VirtualizedItem<T> {
  item: T;
  index: number;
  top: number;
  height: number;
}

const VirtualizedList = <T extends Record<string, unknown>>({
  items,
  renderItem,
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  onLoadMore,
  hasMore = false,
  loading = false,
  className = ''
}: VirtualizedListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLIonListElement>(null);


  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + overscan, items.length);
    const startIndex = Math.max(0, start - overscan);
    
    return { start: startIndex, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Create virtualized items
  const virtualizedItems = useMemo(() => {
    const result: VirtualizedItem<T>[] = [];
    
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      if (items[i]) {
        result.push({
          item: items[i],
          index: i,
          top: i * itemHeight,
          height: itemHeight
        });
      }
    }
    
    return result;
  }, [items, visibleRange, itemHeight]);

  // Handle scroll events
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Handle infinite scroll
  const handleInfiniteScroll = useCallback((event: CustomEvent) => {
    if (onLoadMore && hasMore && !loading) {
      onLoadMore();
    }
    (event.target as HTMLIonInfiniteScrollElement).complete();
  }, [onLoadMore, hasMore, loading]);



  // Add scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Calculate total height for scroll container
  const totalHeight = items.length * itemHeight;

  return (
    <div className={`virtualized-list ${className}`}>
      <IonList
        ref={containerRef}
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {virtualizedItems.map(({ item, index, top, height }) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </IonList>
      
      {onLoadMore && (
        <IonInfiniteScroll
          onIonInfinite={handleInfiniteScroll}
          disabled={!hasMore || loading}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more items..."
          />
        </IonInfiniteScroll>
      )}
    </div>
  );
};

export default VirtualizedList; 