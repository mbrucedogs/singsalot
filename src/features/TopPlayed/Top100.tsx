import React from 'react';
import { InfiniteScrollList } from '../../components/common';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed } from '../../redux';
import type { TopPlayed, Song } from '../../types';

const Top100: React.FC = () => {
  const {
    topPlayedItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
  } = useTopPlayed();

  const topPlayed = useAppSelector(selectTopPlayed);
  const topPlayedCount = Object.keys(topPlayed).length;

  // Debug logging
  console.log('TopPlayed component - topPlayed count:', topPlayedCount);
  console.log('TopPlayed component - topPlayed items:', topPlayedItems);

  // Convert TopPlayed items to Song format for the InfiniteScrollList
  const songItems = topPlayedItems.map((item: TopPlayed) => ({
    ...item,
    path: '', // TopPlayed doesn't have path
    disabled: false,
    favorite: false,
  }));

  // Render extra content for top played items (rank and play count)
  const renderExtraContent = (item: Song, index: number) => {
    return (
      <>
        {/* Rank */}
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${index === 0 ? 'bg-yellow-100 text-yellow-800' : ''}
            ${index === 1 ? 'bg-gray-100 text-gray-800' : ''}
            ${index === 2 ? 'bg-orange-100 text-orange-800' : ''}
            ${index > 2 ? 'bg-gray-50 text-gray-600' : ''}
          `}>
            {index + 1}
          </div>
        </div>

        {/* Play Count */}
        <div className="flex-shrink-0 px-4 py-2 text-sm text-gray-600">
          <div className="font-medium">{item.count}</div>
          <div className="text-xs text-gray-400">
            play{item.count !== 1 ? 's' : ''}
          </div>
        </div>
      </>
    );
  };

  // Wrapper functions to handle type conversion
  const handleAddToQueueWrapper = (song: Song) => {
    const topPlayedItem = topPlayedItems.find(item => item.key === song.key);
    if (topPlayedItem) {
      handleAddToQueue(topPlayedItem);
    }
  };

  const handleToggleFavoriteWrapper = (song: Song) => {
    const topPlayedItem = topPlayedItems.find(item => item.key === song.key);
    if (topPlayedItem) {
      handleToggleFavorite(topPlayedItem);
    }
  };

  return (
    <InfiniteScrollList
      items={songItems}
      isLoading={topPlayedCount === 0}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onAddToQueue={handleAddToQueueWrapper}
      onToggleFavorite={handleToggleFavoriteWrapper}
      context="topPlayed"
      title="Most Played"
      subtitle={`Top ${topPlayedItems.length} song${topPlayedItems.length !== 1 ? 's' : ''} by play count`}
      emptyTitle="No play data yet"
      emptyMessage="Song play counts will appear here after songs have been played"
      loadingTitle="Loading top played..."
      loadingMessage="Please wait while top played data is being loaded"
      debugInfo={`Top played items loaded: ${topPlayedCount}`}
      renderExtraContent={renderExtraContent}
    />
  );
};

export default Top100; 