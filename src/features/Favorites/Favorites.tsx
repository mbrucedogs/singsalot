import React from 'react';
import { InfiniteScrollList, SongItem } from '../../components/common';
import { useFavorites } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectFavorites } from '../../redux';
import type { Song } from '../../types';

const Favorites: React.FC = () => {
  const {
    favoritesItems,
    hasMore,
    loadMore,
    handleAddToQueue,
    handleToggleFavorite,
  } = useFavorites();

  const favorites = useAppSelector(selectFavorites);
  const favoritesCount = Object.keys(favorites).length;

  // Debug logging
  console.log('Favorites component - favorites count:', favoritesCount);
  console.log('Favorites component - favorites items:', favoritesItems);

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
            context="favorites"
            onAddToQueue={() => handleAddToQueue(song)}
            onToggleFavorite={() => handleToggleFavorite(song)}
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