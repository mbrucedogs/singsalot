import React from 'react';
import { IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonLabel } from '@ionic/react';
import { trash, arrowUp, arrowDown } from 'ionicons/icons';
import { ActionButton, InfiniteScrollList, PageHeader } from '../../components/common';
import { useQueue } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectQueue, selectPlayerState, selectIsAdmin } from '../../redux';
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
  const isAdmin = useAppSelector(selectIsAdmin);
  const queueCount = Object.keys(queue).length;

  // Debug logging
  console.log('Queue component - queue count:', queueCount);
  console.log('Queue component - queue items:', queueItems);
  console.log('Queue component - player state:', playerState);
  console.log('Queue component - isAdmin:', isAdmin);
  console.log('Queue component - canReorder:', canReorder);

  // Check if items can be deleted (admin can delete any item when not playing)
  const canDeleteItems = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);
  
  console.log('Queue component - canDeleteItems:', canDeleteItems);
  console.log('Queue component - canReorder:', canReorder);

  // Render queue item for InfiniteScrollList
  const renderQueueItem = (queueItem: QueueItem, index: number) => {
    console.log(`Queue item ${index}: order=${queueItem.order}, key=${queueItem.key}`);
    const canDelete = isAdmin; // Allow admin to delete any item
    
    return (
      <IonItemSliding key={queueItem.key}>
        <IonItem>
          {/* Order Number */}
          <div slot="start" className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 font-medium rounded-full">
            {queueItem.order}
          </div>

          {/* Song Info */}
          <IonLabel>
            <p className="text-sm bold-title truncate">
              {queueItem.singer.name}
            </p>
            <h3 className="text-sm bold-title truncate">
              {queueItem.song.title}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {queueItem.song.artist}
            </p>
          </IonLabel>

          {/* Admin Controls */}
          {(canReorder || isAdmin) && (
            <div slot="end" className="flex items-center gap-2 ml-2">
              <div className="flex flex-col gap-1">
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
              {canDelete && (
                <ActionButton
                  onClick={() => handleRemoveFromQueue(queueItem)}
                  variant="danger"
                  size="sm"
                >
                  <IonIcon icon={trash} />
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