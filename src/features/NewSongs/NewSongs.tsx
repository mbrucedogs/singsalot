import React from 'react';
import { InfiniteScrollList, PageHeader, SongItem } from '../../components/common';
import { useNewSongs } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectNewSongs } from '../../redux';
import type { Song } from '../../types';

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
  console.log('NewSongs component - new songs count:', newSongsCount);
  console.log('NewSongs component - new songs items:', newSongsItems);

  return (
    <>
      <PageHeader
        title="New Songs"
        subtitle={`${newSongsCount} items loaded`}
      />

      <InfiniteScrollList<Song>
        items={newSongsItems}
        isLoading={newSongsCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={(song) => (
          <SongItem
            song={song}
            context="search"
            onAddToQueue={() => handleAddToQueue(song)}
            onToggleFavorite={() => handleToggleFavorite(song)}
          />
        )}
        emptyTitle="No new songs"
        emptyMessage="Check back later for new additions"
        loadingTitle="Loading new songs..."
        loadingMessage="Please wait while new songs data is being loaded"
      />
    </>
  );
};

export default NewSongs; 