import React from 'react';
import { InfiniteScrollList } from '../../components/common';
import { useFavorites } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectFavorites } from '../../redux';

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
    <InfiniteScrollList
      items={favoritesItems}
      isLoading={favoritesCount === 0}
      hasMore={hasMore}
      onLoadMore={loadMore}
      onAddToQueue={handleAddToQueue}
      onToggleFavorite={handleToggleFavorite}
      context="favorites"
      title="Favorites"
      subtitle={`${favoritesItems.length} song${favoritesItems.length !== 1 ? 's' : ''} in favorites`}
      emptyTitle="No favorites yet"
      emptyMessage="Add songs to your favorites to see them here"
      loadingTitle="Loading favorites..."
      loadingMessage="Please wait while favorites data is being loaded"
      debugInfo={`Favorites items loaded: ${favoritesCount}`}
    />
  );
};

export default Favorites; 