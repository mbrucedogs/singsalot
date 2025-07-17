import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonChip } from '@ionic/react';
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
  console.log('NewSongs component - new songs count:', newSongsCount);
  console.log('NewSongs component - new songs items:', newSongsItems);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            New Songs
            <IonChip color="primary" className="ml-2">
              {newSongsItems.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <InfiniteScrollList
        items={newSongsItems}
        isLoading={newSongsCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onAddToQueue={handleAddToQueue}
        onToggleFavorite={handleToggleFavorite}
        context="search"
        title=""
        subtitle=""
        emptyTitle="No new songs"
        emptyMessage="Check back later for new additions"
        loadingTitle="Loading new songs..."
        loadingMessage="Please wait while new songs data is being loaded"
        debugInfo={`New songs loaded: ${newSongsCount}`}
      />
    </>
  );
};

export default NewSongs; 