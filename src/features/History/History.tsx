import React from 'react';
import { InfiniteScrollList } from '../../components/common';
import { useHistory } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectHistory } from '../../redux';
import { formatDate } from '../../utils/dataProcessing';
import type { Song } from '../../types';

const History: React.FC = () => {
  const {
    historyItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
  } = useHistory();

  const history = useAppSelector(selectHistory);
  const historyCount = Object.keys(history).length;

  // Debug logging
  console.log('History component - history count:', historyCount);
  console.log('History component - history items:', historyItems);

  // Render extra content for history items (play date)
  const renderExtraContent = (item: Song) => {
    if (item.date) {
      return (
        <div className="flex-shrink-0 px-4 py-2 text-sm text-gray-500">
          {formatDate(item.date)}
        </div>
      );
    }
    return null;
  };

  return (
    <InfiniteScrollList
      items={historyItems}
      isLoading={historyCount === 0}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onAddToQueue={handleAddToQueue}
      onToggleFavorite={handleToggleFavorite}
      context="history"
      title="Recently Played"
      subtitle={`${historyItems.length} song${historyItems.length !== 1 ? 's' : ''} in history`}
      emptyTitle="No history yet"
      emptyMessage="Songs will appear here after they've been played"
      loadingTitle="Loading history..."
      loadingMessage="Please wait while history data is being loaded"
      debugInfo={`History items loaded: ${historyCount}`}
      renderExtraContent={renderExtraContent}
    />
  );
};

export default History; 