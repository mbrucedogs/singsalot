import React from 'react';
import { InfiniteScrollList, SongItem } from '../../components/common';
import { useNewSongs } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectNewSongsArray } from '../../redux';
import { debugLog } from '../../utils/logger';
import type { Song } from '../../types';

const NewSongs: React.FC = () => {
  const {
    newSongsItems,
    hasMore,
    loadMore,
  } = useNewSongs();

  const newSongsArray = useAppSelector(selectNewSongsArray);
  const newSongsCount = newSongsArray.length;

  // Debug logging
  debugLog('NewSongs component - new songs count:', newSongsCount);
  debugLog('NewSongs component - new songs items:', newSongsItems);

  return (
    <>
      <InfiniteScrollList<Song>
        items={newSongsItems}
        isLoading={newSongsCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={(song) => (
          <SongItem
            song={song}
            context="search"
            showAddButton={true}
            showInfoButton={true}
            showFavoriteButton={false}
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