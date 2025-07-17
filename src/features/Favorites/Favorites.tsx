import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonChip } from '@ionic/react';
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
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Favorites
            <IonChip color="primary" className="ml-2">
              {favoritesItems.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <InfiniteScrollList
        items={favoritesItems}
        isLoading={favoritesCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onAddToQueue={handleAddToQueue}
        onToggleFavorite={handleToggleFavorite}
        context="favorites"
        title=""
        subtitle=""
        emptyTitle="No favorites yet"
        emptyMessage="Add songs to your favorites to see them here"
        loadingTitle="Loading favorites..."
        loadingMessage="Please wait while favorites data is being loaded"
        debugInfo={`Favorites items loaded: ${favoritesCount}`}
      />
    </>
  );
};

export default Favorites; 