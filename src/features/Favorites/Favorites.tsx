import React from 'react';
import { InfiniteScrollList, SongItem } from '../../components/common';
import { useFavorites } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectFavorites } from '../../redux';
import { debugLog } from '../../utils/logger';
import type { Song } from '../../types';
import { SongItemContext } from '../../types';

const Favorites: React.FC = () => {
  const {
    favoritesItems,
    hasMore,
    loadMore,
    handleToggleFavorite,
  } = useFavorites();

  const favorites = useAppSelector(selectFavorites);
  const favoritesCount = Object.keys(favorites).length;

  // Debug logging
  debugLog('Favorites component - favorites count:', favoritesCount);
  debugLog('Favorites component - favorites items:', favoritesItems);

  return (
    <>
      <InfiniteScrollList<Song>
        items={favoritesItems}
        isLoading={favoritesCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={(song) => (
          <SongItem
            song={song}
            context={SongItemContext.FAVORITES}
            showInfoButton={true}
            showAddButton={true}
            showDeleteButton={true}
            onDeleteItem={() => handleToggleFavorite(song)}
          />
        )}
        emptyTitle="No favorites yet"
        emptyMessage="Add songs to your favorites to see them here"
        loadingTitle="Loading favorites..."
        loadingMessage="Please wait while favorites data is being loaded"
      />

    </>
  );
};

export default Favorites; 