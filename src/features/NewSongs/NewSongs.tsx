import React from 'react';
import { InfiniteScrollList } from '../../components/common';
import { useNewSongs } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectNewSongs } from '../../redux';

const NewSongs: React.FC = () => {
  const {
    newSongsItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
  } = useNewSongs();

  const newSongs = useAppSelector(selectNewSongs);
  const newSongsCount = Object.keys(newSongs).length;

  // Debug logging
  console.log('NewSongs component - newSongs count:', newSongsCount);
  console.log('NewSongs component - newSongs items:', newSongsItems);

  return (
    <InfiniteScrollList
      items={newSongsItems}
      isLoading={newSongsCount === 0}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onAddToQueue={handleAddToQueue}
      onToggleFavorite={handleToggleFavorite}
      context="search"
      title="New Songs"
      subtitle={`${newSongsItems.length} new song${newSongsItems.length !== 1 ? 's' : ''} added recently`}
      emptyTitle="No new songs"
      emptyMessage="New songs will appear here when they're added to the catalog"
      loadingTitle="Loading new songs..."
      loadingMessage="Please wait while new songs data is being loaded"
      debugInfo={`New songs items loaded: ${newSongsCount}`}
    />
  );
};

export default NewSongs; 