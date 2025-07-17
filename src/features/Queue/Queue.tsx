import React from 'react';
import { IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonLabel, IonChip } from '@ionic/react';
import { trash, arrowUp, arrowDown } from 'ionicons/icons';
import { EmptyState, ActionButton, PlayerControls } from '../../components/common';
import { useQueue } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectQueue, selectPlayerState } from '../../redux';
import { PlayerState } from '../../types';

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Queue</h1>
        <p className="text-sm text-gray-600">
          {queueStats.totalSongs} song{queueStats.totalSongs !== 1 ? 's' : ''} in queue
        </p>
        
        {/* Debug info */}
        <div className="mt-2 text-sm text-gray-500">
          Queue items loaded: {queueCount}
        </div>
      </div>

      {/* Player Controls - Only visible to admin users */}
      <div className="mb-6">
        <PlayerControls />
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-lg shadow">
        {queueCount === 0 ? (
          <EmptyState
            title="Queue is empty"
            message="Add songs from search, history, or favorites to get started"
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            }
          />
        ) : queueItems.length === 0 ? (
          <EmptyState
            title="Loading queue..."
            message="Please wait while queue data is being loaded"
            icon={
              <svg className="h-12 w-12 text-gray-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />
        ) : (
          <IonList>
            {queueItems.map((queueItem, index) => {
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
                      <div className="flex items-center mt-1">
                        <IonChip color="medium">
                          {queueItem.singer.name}
                        </IonChip>
                        {queueItem.isCurrentUser && (
                          <IonChip color="primary">
                            You
                          </IonChip>
                        )}
                      </div>
                    </IonLabel>

                    {/* Admin Controls */}
                    {canReorder && (
                      <div slot="end" className="flex flex-col gap-1">
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
            })}
          </IonList>
        )}
      </div>
    </div>
  );
};

export default Queue; 