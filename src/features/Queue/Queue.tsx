import React from 'react';
import { IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonLabel, IonChip } from '@ionic/react';
import { trash, arrowUp, arrowDown } from 'ionicons/icons';
import { ActionButton, PlayerControls, InfiniteScrollList, PageHeader } from '../../components/common';
import { useQueue } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectQueue, selectPlayerState } from '../../redux';
import { PlayerState } from '../../types';
import type { QueueItem } from '../../types';

const Queue: React.FC = () => {
  const {
    queueItems,
    queueStats,
    canReorder,
    handleRemoveFromQueue,
    handleMoveUp,
    handleMoveDown,
  } = useQueue();

  const queue = useAppSelector(selectQueue);
  const playerState = useAppSelector(selectPlayerState);
  const queueCount = Object.keys(queue).length;

  // Debug logging
  console.log('Queue component - queue count:', queueCount);
  console.log('Queue component - queue items:', queueItems);
  console.log('Queue component - player state:', playerState);

  // Check if first item can be deleted (only when stopped or paused)
  const canDeleteFirstItem = playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused;
  
  console.log('Queue component - canDeleteFirstItem:', canDeleteFirstItem);
  console.log('Queue component - canReorder:', canReorder);

  // Render queue item for InfiniteScrollList
  const renderQueueItem = (queueItem: QueueItem, index: number) => {
    console.log(`Queue item ${index}: order=${queueItem.order}, key=${queueItem.key}`);
    const canDelete = index === 0 ? canDeleteFirstItem : true;
    
    return (
      <IonItemSliding key={queueItem.key}>
        <IonItem>
          {/* Order Number */}
          <div slot="start" className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 font-medium rounded-full">
            {queueItem.order}
          </div>

          {/* Song Info */}
          <IonLabel>
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {queueItem.song.title}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {queueItem.song.artist}
            </p>
          </IonLabel>

          {/* Singer Pill - Moved to far right */}
          <IonChip slot="end" color="medium">
            {queueItem.singer.name}
          </IonChip>

          {/* Admin Controls */}
          {canReorder && (
            <div slot="end" className="flex flex-col gap-1 ml-2">
              {queueItem.order > 2 && (
                <ActionButton
                  onClick={() => handleMoveUp(queueItem)}
                  variant="secondary"
                  size="sm"
                >
                  <IonIcon icon={arrowUp} />
                </ActionButton>
              )}
              {queueItem.order > 1 && queueItem.order < queueItems.length && (
                <ActionButton
                  onClick={() => handleMoveDown(queueItem)}
                  variant="secondary"
                  size="sm"
                >
                  <IonIcon icon={arrowDown} />
                </ActionButton>
              )}
            </div>
          )}
        </IonItem>

        {/* Swipe Actions */}
        {canDelete && (
          <IonItemOptions side="end">
            <IonItemOption 
              color="danger" 
              onClick={() => handleRemoveFromQueue(queueItem)}
            >
              <IonIcon icon={trash} slot="icon-only" />
            </IonItemOption>
          </IonItemOptions>
        )}
      </IonItemSliding>
    );
  };

  return (
    <>
      <PageHeader
        title="Queue"
        subtitle={`${queueStats.totalSongs} song${queueStats.totalSongs !== 1 ? 's' : ''} in queue`}
      />

      {/* Player Controls - Only visible to admin users */}
      <div className="max-w-4xl mx-auto p-6 mb-6">
        <div style={{ paddingLeft: '16px' }}>
          <PlayerControls variant="dark" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Queue List */}
        <InfiniteScrollList<QueueItem>
          items={queueItems}
          isLoading={queueCount === 0}
          hasMore={false}
          onLoadMore={() => {}}
          renderItem={renderQueueItem}
          emptyTitle="Queue is empty"
          emptyMessage="Add songs from search, history, or favorites to get started"
          loadingTitle="Loading queue..."
          loadingMessage="Please wait while queue data is being loaded"
        />
      </div>
    </>
  );
};

export default Queue; 