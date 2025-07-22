import React, { useMemo, useCallback } from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import ActionButton from './ActionButton';
import { useAppSelector } from '../../redux';
import { selectQueue, selectFavorites, selectCurrentSinger, selectTopPlayedArray } from '../../redux';
import { useActions } from '../../hooks/useActions';
import { useModal } from '../../hooks/useModalContext';
import { debugLog } from '../../utils/logger';
import type { SongItemProps, QueueItem, Song } from '../../types';
import { SongItemContext } from '../../types';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';
import { star } from 'ionicons/icons';

// Utility function to extract filename from path
const extractFilename = (path: string): string => {
  if (!path) return '';
  
  // Handle different path separators (Windows backslash, Unix forward slash)
  const normalizedPath = path.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  return parts[parts.length - 1] || '';
};

// Song Information Display Component
// NOTE: The first two lines (title and artist) should match the styling of TwoLineDisplay component
// If you change the styling here, also update TwoLineDisplay to keep them in sync
export const SongInfoDisplay: React.FC<{ 
  song: Song; 
  showPath?: boolean;
  showCount?: boolean;
  showFullPath?: boolean;
  showTopPlayedStar?: boolean;
}> = React.memo(({ 
  song, 
  showPath = false,
  showCount = false,
  showFullPath = false,
  showTopPlayedStar = false
}) => {
  return (
    <IonLabel>
      <div 
        className="ion-text-bold"
        style={{ 
          fontWeight: 'bold', 
          fontSize: '1rem', 
          color: 'var(--ion-color-dark)',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {showTopPlayedStar && (
          <IonIcon 
            icon={star} 
            color="warning" 
            style={{ fontSize: '1rem' }}
          />
        )}
        {song.title}
      </div>
      <div 
        className="ion-text-italic ion-color-medium"
        style={{ 
          fontSize: '0.875rem', 
          fontStyle: 'italic', 
          color: 'var(--ion-color-medium)',
          marginBottom: '4px'
        }}
      >
        {song.artist}
      </div>
      {/* Show filename or full path if showPath is true */}
      {showPath && song.path && (
        <div 
          className="ion-text-sm ion-color-medium"
          style={{ 
            fontSize: '0.75rem', 
            color: 'var(--ion-color-medium)'
          }}
        >
          {showFullPath ? song.path : extractFilename(song.path)}
        </div>
      )}
      {/* Show play count if showCount is true */}
      {showCount && song.count && (
        <div 
          className="ion-text-sm ion-color-medium"
          style={{ 
            fontSize: '0.75rem', 
            color: 'var(--ion-color-medium)'
          }}
        >
          Played {song.count} times
        </div>
      )}
    </IonLabel>
  );
});

// Action Buttons Component
export const SongActionButtons: React.FC<{
  isAdmin: boolean;
  isInQueue: boolean;
  isInFavorites: boolean;
  showInfoButton?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  showDeleteButton?: boolean;
  showFavoriteButton?: boolean;
  onDeleteItem?: () => void;
  onAddToQueue?: () => void;
  onRemoveFromQueue?: () => void;
  onToggleFavorite?: () => void;
  onShowSongInfo?: () => void;
}> = React.memo(({
  isInFavorites,
  showInfoButton = false,
  showAddButton = false,
  showRemoveButton = false,
  showDeleteButton = false,
  showFavoriteButton = false,
  onDeleteItem,
  onAddToQueue,
  onRemoveFromQueue,
  onToggleFavorite,
  onShowSongInfo
}) => {
  const buttons: React.ReactNode[] = [];

  if (showInfoButton && onShowSongInfo) {
    buttons.push(
      <ActionButton
        key="info"
        onClick={onShowSongInfo}
        variant={ActionButtonVariant.SECONDARY}
        size={ActionButtonSize.SMALL}
        icon={Icons.INFORMATION_CIRCLE}
        iconSlot={ActionButtonIconSlot.ICON_ONLY}
      />
    );
  }

  if (showAddButton && onAddToQueue) {
    buttons.push(
      <ActionButton
        key="add"
        onClick={onAddToQueue}
        variant={ActionButtonVariant.PRIMARY}
        size={ActionButtonSize.SMALL}
        icon={Icons.ADD}
        iconSlot={ActionButtonIconSlot.ICON_ONLY}
      />
    );
  }

  if (showRemoveButton && onRemoveFromQueue) {
    buttons.push(
      <ActionButton
        key="remove"
        onClick={onRemoveFromQueue}
        variant={ActionButtonVariant.DANGER}
        size={ActionButtonSize.SMALL}
        icon={Icons.TRASH}
        iconSlot={ActionButtonIconSlot.ICON_ONLY}
      />
    );
  }

  if (showDeleteButton && onDeleteItem) {
    buttons.push(
      <ActionButton
        key="delete"
        onClick={onDeleteItem}
        variant={ActionButtonVariant.DANGER}
        size={ActionButtonSize.SMALL}
        icon={Icons.TRASH}
        iconSlot={ActionButtonIconSlot.ICON_ONLY}
      />
    );
  }

  if (showFavoriteButton && onToggleFavorite) {
    buttons.push(
      <ActionButton
        key="favorite"
        onClick={onToggleFavorite}
        variant={isInFavorites ? ActionButtonVariant.DANGER : ActionButtonVariant.SECONDARY}
        size={ActionButtonSize.SMALL}
        icon={isInFavorites ? Icons.HEART : Icons.HEART_OUTLINE}
        iconSlot={ActionButtonIconSlot.ICON_ONLY}
      />
    );
  }

  return buttons.length > 0 ? (
    <div className="flex gap-2">
      {buttons}
    </div>
  ) : null;
});

// Main SongItem Component
const SongItem: React.FC<SongItemProps> = React.memo(({
  song,
  context,
  onDeleteItem,
  isAdmin = false,
  className = '',
  showActions = true,
  showPath,
  showCount,
  showInfoButton,
  showAddButton,
  showRemoveButton,
  showDeleteButton,
  showFavoriteButton,
  showFullPath
}) => {
  // Get current state from Redux
  const queue = useAppSelector(selectQueue);
  const favorites = useAppSelector(selectFavorites);
  const currentSingerName = useAppSelector(selectCurrentSinger);
  const topPlayedArray = useAppSelector(selectTopPlayedArray);
  
  // Get unified action handlers
  const { handleAddToQueue, handleToggleFavorite, handleRemoveFromQueue } = useActions();
  const { openSongInfo } = useModal();
  
  // Memoized computations for performance
  const isInQueue = useMemo(() => 
    (Object.values(queue) as QueueItem[]).some(item => item.song.path === song.path && item.singer.name === currentSingerName),
    [queue, song.path, currentSingerName]
  );
  
  const isInFavorites = useMemo(() => 
    (Object.values(favorites) as Song[]).some(favSong => favSong.path === song.path),
    [favorites, song.path]
  );

  const isInTopPlayed = useMemo(() => 
    (Object.values(topPlayedArray) as Song[]).some(topSong => topSong.path === song.path),
    [topPlayedArray, song.path]
  );

  // Find queue item key for removal (only needed for queue context)
  const queueItemKey = useMemo(() => 
    context === SongItemContext.QUEUE 
      ? (Object.entries(queue) as [string, QueueItem][]).find(([, item]) => item.song.path === song.path)?.[0]
      : null,
    [context, queue, song.path]
  );

  // Debug logging for favorites
  debugLog('SongItem render:', {
    songTitle: song.title,
    songPath: song.path,
    favoritesCount: Object.keys(favorites).length,
    isInFavorites,
    favorites: (Object.values(favorites) as Song[]).map(f => f.path)
  });

  // Default values based on context if not explicitly provided
  const shouldShowPath = showPath !== undefined ? showPath : context !== SongItemContext.QUEUE;
  const shouldShowCount = showCount !== undefined ? showCount : context === SongItemContext.QUEUE;
  
  // Default values for action buttons based on context if not explicitly provided
  let shouldShowAddButton = showAddButton !== undefined ? showAddButton : [SongItemContext.SEARCH, SongItemContext.HISTORY].includes(context);
  // Always hide the add button if the song is already in the queue for the current singer
  if (isInQueue) shouldShowAddButton = false;
  const shouldShowRemoveButton = showRemoveButton !== undefined ? showRemoveButton : context === SongItemContext.QUEUE && isAdmin;
  const shouldShowDeleteButton = showDeleteButton !== undefined ? showDeleteButton : context === SongItemContext.HISTORY && isAdmin;
  const shouldShowFavoriteButton = showFavoriteButton !== undefined ? showFavoriteButton : false; // Disabled for all contexts
  const shouldShowInfoButton = showInfoButton !== undefined ? showInfoButton : [SongItemContext.SEARCH, SongItemContext.HISTORY].includes(context);

  // Memoized handler functions for performance
  const handleAddToQueueClick = useCallback(async () => {
    // Find the current singer object from the queue or create a minimal one
    let singer = undefined;
    if (currentSingerName) {
      // Try to find a matching singer in the queue (for lastLogin)
      const queueSingers = (Object.values(queue) as QueueItem[]).map(item => item.singer);
      singer = queueSingers.find(s => s.name === currentSingerName) || { name: currentSingerName, lastLogin: '' };
    }
    await handleAddToQueue(song, singer);
  }, [handleAddToQueue, song, currentSingerName, queue]);

  const handleToggleFavoriteClick = useCallback(async () => {
    await handleToggleFavorite(song);
  }, [handleToggleFavorite, song]);

  const handleRemoveFromQueueClick = useCallback(async () => {
    if (!queueItemKey) return;
    // Find the queue item by key
    const queueItem = (Object.values(queue) as QueueItem[]).find(item => item.key === queueItemKey);
    if (queueItem) {
      await handleRemoveFromQueue(queueItem);
    }
  }, [queueItemKey, queue, handleRemoveFromQueue]);

  const handleSelectSinger = useCallback(() => {
    openSongInfo(song);
  }, [openSongInfo, song]);

  return (
    <IonItem className={className}>
      <SongInfoDisplay 
        song={song} 
        showPath={shouldShowPath} 
        showCount={shouldShowCount} 
        showFullPath={showFullPath}
        showTopPlayedStar={isInTopPlayed}
      />
      
      {showActions && (
        <div slot="end" className="flex gap-2 flex-shrink-0 ml-2">
          <SongActionButtons
            isAdmin={isAdmin}
            isInQueue={isInQueue}
            isInFavorites={isInFavorites}
            showInfoButton={shouldShowInfoButton}
            showAddButton={shouldShowAddButton}
            showRemoveButton={shouldShowRemoveButton}
            showDeleteButton={shouldShowDeleteButton}
            showFavoriteButton={shouldShowFavoriteButton}
            onDeleteItem={onDeleteItem}
            onAddToQueue={context === SongItemContext.QUEUE ? handleRemoveFromQueueClick : handleAddToQueueClick}
            onRemoveFromQueue={context === SongItemContext.QUEUE ? handleRemoveFromQueueClick : onDeleteItem}
            onToggleFavorite={context === SongItemContext.FAVORITES ? onDeleteItem : handleToggleFavoriteClick}
            onShowSongInfo={handleSelectSinger}
          />
        </div>
      )}
    </IonItem>
  );
});

export default SongItem;