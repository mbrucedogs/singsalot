import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonButton, IonIcon, IonReorderGroup, IonReorder } from '@ionic/react';
import { trash, reorderThreeOutline, reorderTwoOutline, list } from 'ionicons/icons';
import { useQueue } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectQueueLength, selectPlayerStateMemoized, selectIsAdmin, selectControllerName } from '../../redux';
import { ActionButton, NumberDisplay, EmptyState } from '../../components/common';
import { SongInfoDisplay } from '../../components/common/SongItem';
import { queueService } from '../../firebase/services';
import { debugLog } from '../../utils/logger';
import { PlayerState } from '../../types';
import type { QueueItem } from '../../types';

type QueueMode = 'delete' | 'reorder';

const Queue: React.FC = () => {
  const [queueMode, setQueueMode] = useState<QueueMode>('delete');
  const [listItems, setListItems] = useState<QueueItem[]>([]);
  
  const {
    queueItems,
    canReorder,
    handleRemoveFromQueue,
  } = useQueue();

  const queueCount = useAppSelector(selectQueueLength);
  const playerState = useAppSelector(selectPlayerStateMemoized);
  const isAdmin = useAppSelector(selectIsAdmin);
  const controllerName = useAppSelector(selectControllerName);

  // Debug logging
  debugLog('Queue component - queue count:', queueCount);
  debugLog('Queue component - queue items:', queueItems);
  debugLog('Queue component - player state:', playerState);
  debugLog('Queue component - isAdmin:', isAdmin);
  debugLog('Queue component - canReorder:', canReorder);
  debugLog('Queue component - queueMode:', queueMode);

  // Check if items can be deleted (admin can delete any item when not playing)
  const canDeleteItems = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);
  
  debugLog('Queue component - canDeleteItems:', canDeleteItems);
  debugLog('Queue component - canReorder:', canReorder);


  // Update list items when queue changes
  useEffect(() => {
    if (queueItems.length > 0) {
      // Skip the first item (currently playing) for reordering
      setListItems(queueItems.slice(1));
    } else {
      setListItems([]);
    }
  }, [queueItems]);

  // Toggle between modes
  const toggleQueueMode = () => {
    setQueueMode(prevMode => prevMode === 'delete' ? 'reorder' : 'delete');
  };

  // Handle reorder event from IonReorderGroup
  const doReorder = async (event: CustomEvent) => {
    debugLog('Reorder event:', event.detail);
    const { from, to, complete } = event.detail;
    
    if (listItems && controllerName) {
      const copy = [...listItems];
      const draggedItem = copy.splice(from, 1)[0];
      copy.splice(to, 0, draggedItem);
      
      // Complete the reorder animation
      complete();
      
      // Create the new queue order (first item + reordered items)
      const newQueueItems = [queueItems[0], ...copy];
      debugLog('New queue order:', newQueueItems);
      
      try {
        // Update all items with their new order values
        const updatePromises = newQueueItems.map((item, index) => {
          const newOrder = index + 1;
          if (item.key && item.order !== newOrder) {
            debugLog(`Updating item ${item.key} from order ${item.order} to ${newOrder}`);
            return queueService.updateQueueItem(controllerName, item.key, { order: newOrder });
          }
          return Promise.resolve();
        });
        
        await Promise.all(updatePromises);
        debugLog('Queue reorder completed successfully');
      } catch (error) {
        console.error('Failed to reorder queue:', error);
        // You might want to show an error toast here
      }
    }
  };

  // Render queue item
  const renderQueueItem = (queueItem: QueueItem, index: number) => {
    debugLog(`Queue item ${index}: order=${queueItem.order}, key=${queueItem.key}`);
    const canDelete = isAdmin && queueMode === 'delete'; // Only allow delete in delete mode
    
    return (
      <IonItemSliding key={queueItem.key}>
        <IonItem 
          className={`${canReorder && queueMode === 'reorder' ? 'ion-border-start ion-border-primary ion-bg-primary-tint' : ''}`} 
          style={{ '--padding-start': '0px' }}
        >
          {/* Order Number */}
          <NumberDisplay number={queueItem.order} />

          {/* Song Info with Singer Name on Top */}
          <IonLabel>
            {/* Singer Name */}
            <div className="ion-text-bold ion-color-primary">
              {queueItem.singer.name}
            </div>
            
            {/* Song Info Display */}
            <SongInfoDisplay 
              song={queueItem.song} 
              showPath={false}
              showCount={false}
            />
          </IonLabel>

          {/* Delete Button or Drag Handle */}
          <div slot="end" style={{ marginRight: '-16px' }}>
            {canDelete && (
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  onClick={() => handleRemoveFromQueue(queueItem)}
                  variant="danger"
                  size="sm"
                >
                  <IonIcon icon={trash} />
                </ActionButton>
              </div>
            )}
            {canReorder && queueMode === 'reorder' && (
              <div className="ion-color-medium">
                <IonIcon icon={reorderTwoOutline} size="large" />
              </div>
            )}
          </div>
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

  // Render first item (currently playing) separately
  const renderFirstItem = () => {
    if (queueItems.length === 0) return null;
    
    const firstItem = queueItems[0];
    const canDeleteFirstItem = isAdmin && (playerState?.state === PlayerState.stopped || playerState?.state === PlayerState.paused);
    
    return (
      <IonItemSliding key={firstItem.key}>
        <IonItem style={{ '--padding-start': '0px' }}>
          {/* Order Number */}
          <NumberDisplay number={firstItem.order} />

          {/* Song Info with Singer Name on Top */}
          <IonLabel>
            {/* Singer Name */}
            <div className="ion-text-bold ion-color-primary">
              {firstItem.singer.name}
            </div>
            
            {/* Song Info Display */}
            <SongInfoDisplay 
              song={firstItem.song} 
              showPath={false}
              showCount={false}
            />
          </IonLabel>

          {/* Delete Button */}
          <div slot="end" style={{ marginRight: '-16px' }}>
            {canDeleteFirstItem && queueMode === 'delete' && (
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  onClick={() => handleRemoveFromQueue(firstItem)}
                  variant="danger"
                  size="sm"
                >
                  <IonIcon icon={trash} />
                </ActionButton>
              </div>
            )}
          </div>
        </IonItem>

        {/* Swipe Actions */}
        {canDeleteFirstItem && queueMode === 'delete' && (
          <IonItemOptions side="end">
            <IonItemOption 
              color="danger" 
              onClick={() => handleRemoveFromQueue(firstItem)}
            >
              <IonIcon icon={trash} slot="icon-only"/>
            </IonItemOption>
          </IonItemOptions>
        )}
      </IonItemSliding>
    );
  };

  // Show empty state if no items in queue
  if (queueItems.length === 0) {
    return (
      <EmptyState
        title="Queue is Empty"
        message="No songs are currently in the queue. Add some songs to get started!"
        icon={<IonIcon icon={list} size="large" />}
      />
    );
  }

  return (
    <>
      <div className="ion-padding ion-text-end">
        {isAdmin && (
          <IonButton
            onClick={toggleQueueMode}
            fill="outline"
            size="small"
          >
            <IonIcon icon={queueMode === 'delete' ? reorderThreeOutline : trash} />
          </IonButton>
        )}
      </div>

      <div className="ion-padding">
        {/* First Item (Currently Playing) */}
        {renderFirstItem()}

        {/* Queue List with Reorder */}
        {canReorder && queueMode === 'reorder' ? (
          <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
            {listItems.map((queueItem, index) => (
              <IonReorder key={queueItem.key}>
                {renderQueueItem(queueItem, index)}
              </IonReorder>
            ))}
          </IonReorderGroup>
        ) : (
          <div>
            {listItems.map((queueItem, index) => renderQueueItem(queueItem, index))}
          </div>
        )}
      </div>
    </>
  );
};

export default Queue; 