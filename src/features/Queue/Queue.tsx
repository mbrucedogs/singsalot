import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonReorderGroup, IonReorder } from '@ionic/react';
import { reorderThreeOutline, reorderTwoOutline, list } from 'ionicons/icons';
import { useQueue, useActions } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectQueueLength } from '../../redux';
import { ActionButton, NumberDisplay, EmptyState } from '../../components/common';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';
import { SongInfoDisplay } from '../../components/common/SongItem';
import { debugLog } from '../../utils/logger';
import type { QueueItem } from '../../types';

const Queue: React.FC = () => {
  const [listItems, setListItems] = useState<QueueItem[]>([]);
  
  const {
    queueItems,
    handleRemoveFromQueue,
  } = useQueue();

  const {
    queueMode,
    canDeleteItems,
    canDeleteFirstItem,
    toggleQueueMode,
    handleReorder,
  } = useActions();

  // Check if reordering is allowed
  const canReorder = canDeleteItems && queueItems.length > 1;

  const queueCount = useAppSelector(selectQueueLength);

  // Debug logging
  debugLog('Queue component - queue count:', queueCount);
  debugLog('Queue component - queue items:', queueItems);
  debugLog('Queue component - canReorder:', canReorder);
  debugLog('Queue component - queueMode:', queueMode);
  debugLog('Queue component - canDeleteItems:', canDeleteItems);


  // Update list items when queue changes
  useEffect(() => {
    if (queueItems.length > 0) {
      // Skip the first item (currently playing) for reordering
      setListItems(queueItems.slice(1));
    } else {
      setListItems([]);
    }
  }, [queueItems]);

  // Handle reorder event from IonReorderGroup
  const doReorder = async (event: CustomEvent) => {
    await handleReorder(event, queueItems);
  };

  // Render queue item
  const renderQueueItem = (queueItem: QueueItem, index: number) => {
    debugLog(`Queue item ${index}: order=${queueItem.order}, key=${queueItem.key}`);
    const canDelete = canDeleteItems && queueMode === 'delete'; // Only allow delete in delete mode
    
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
                  variant={ActionButtonVariant.DANGER}
                  size={ActionButtonSize.SMALL}
                  icon={Icons.TRASH}
                  iconSlot={ActionButtonIconSlot.ICON_ONLY}
                />
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
              <IonIcon icon={Icons.TRASH} slot="icon-only" />
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
                  variant={ActionButtonVariant.DANGER}
                  size={ActionButtonSize.SMALL}
                  icon={Icons.TRASH}
                  iconSlot={ActionButtonIconSlot.ICON_ONLY}
                />
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
              <IonIcon icon={Icons.TRASH} slot="icon-only"/>
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
      <div className="ion-padding">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          {canDeleteItems && (
            <ActionButton
              onClick={toggleQueueMode}
              variant={ActionButtonVariant.SECONDARY}
              size={ActionButtonSize.SMALL}
              icon={queueMode === 'delete' ? reorderThreeOutline : Icons.TRASH}
              iconSlot={ActionButtonIconSlot.ICON_ONLY}
              fill="outline"
            />
          )}
        </div>

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