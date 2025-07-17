import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonChip, IonIcon } from '@ionic/react';
import { InfiniteScrollList } from '../../components/common';
import { useTopPlayed } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectTopPlayed } from '../../redux';

const TopPlayed: React.FC = () => {
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
  console.log('TopPlayed component - top played count:', topPlayedCount);
  console.log('TopPlayed component - top played items:', topPlayedItems);

  const renderExtraContent = (item: any, index: number) => (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex items-center text-sm text-gray-500">
        <IonIcon icon="trophy" className="mr-1" />
        <span>#{index + 1}</span>
      </div>
    </div>
  );

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Top 100 Played
            <IonChip color="primary" className="ml-2">
              {topPlayedItems.length}
            </IonChip>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <div style={{ height: '100%', overflowY: 'auto' }}>
        <InfiniteScrollList
          items={topPlayedItems}
          isLoading={topPlayedCount === 0}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onAddToQueue={handleAddToQueue}
          onToggleFavorite={handleToggleFavorite}
          context="topPlayed"
          title=""
          subtitle=""
          emptyTitle="No top played songs"
          emptyMessage="Play some songs to see the top played list"
          loadingTitle="Loading top played songs..."
          loadingMessage="Please wait while top played data is being loaded"
          debugInfo={`Top played items loaded: ${topPlayedCount}`}
          renderExtraContent={renderExtraContent}
        />
      </div>
    </>
  );
};

export default TopPlayed; 