import React, { useEffect, useRef } from 'react';
import { EmptyState } from './index';

interface InfiniteScrollListProps<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  title: string;
  subtitle?: string;
  emptyTitle: string;
  emptyMessage: string;
  loadingTitle?: string;
  loadingMessage?: string;
  debugInfo?: string;
}

const InfiniteScrollList = <T extends { key?: string }>({
  items,
  isLoading,
  hasMore,
  onLoadMore,
  renderItem,
  title,
  subtitle,
  emptyTitle,
  emptyMessage,
  loadingTitle = "Loading...",
  loadingMessage = "Please wait while data is being loaded",
  debugInfo,
}: InfiniteScrollListProps<T>) => {
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    console.log('InfiniteScrollList - Setting up observer:', { hasMore, isLoading, itemsLength: items.length });
    
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('InfiniteScrollList - Intersection detected:', { 
          isIntersecting: entries[0].isIntersecting, 
          hasMore, 
          isLoading 
        });
        
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log('InfiniteScrollList - Loading more items');
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, items.length]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
        
        {/* Debug info */}
        {debugInfo && (
          <div className="mt-2 text-sm text-gray-500">
            {debugInfo}
          </div>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        {items.length === 0 && !isLoading ? (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            }
          />
        ) : isLoading && items.length === 0 ? (
          <EmptyState
            title={loadingTitle}
            message={loadingMessage}
            icon={
              <svg className="h-12 w-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <div key={item.key}>
                {renderItem(item, index)}
              </div>
            ))}
            
            {/* Infinite scroll trigger */}
            {hasMore && (
              <div 
                ref={observerRef}
                className="py-4 text-center text-gray-500"
              >
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more items...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {items.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {items.length} item{items.length !== 1 ? 's' : ''}
          {hasMore && ` • Scroll down to load more`}
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollList; 