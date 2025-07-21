import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import ActionButton from './ActionButton';
import { useAppSelector } from '../../redux';
import { selectQueue, selectFavorites } from '../../redux';
import { useActions } from '../../hooks/useActions';
import { useModal } from '../../hooks/useModalContext';
import { debugLog } from '../../utils/logger';
import type { SongItemProps, QueueItem, Song } from '../../types';
import { ActionButtonVariant, ActionButtonSize, ActionButtonIconSlot } from '../../types';
import { Icons } from '../../constants';

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
}> = ({ 
  song, 
  showPath = false,
  showCount = false
}) => {
  return (
    <IonLabel>
      <div 
        className="ion-text-bold"
        style={{ 
          fontWeight: 'bold', 
          fontSize: '1rem', 
          color: 'var(--ion-color-dark)',
          marginBottom: '4px'
        }}
      >
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
      {/* Show filename if showPath is true */}
      {showPath && song.path && (
        <div 
          className="ion-text-sm ion-color-medium"
          style={{ 
            fontSize: '0.75rem', 
            color: 'var(--ion-color-medium)'
          }}
        >
          {extractFilename(song.path)}
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
};

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
}> = ({
  isAdmin,
  isInQueue,
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
  const buttons = [];

  // Info button
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

  // Add to Queue button
  if (showAddButton && !isInQueue && onAddToQueue) {
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

  // Remove from Queue button
  if (showRemoveButton && isAdmin && onRemoveFromQueue) {
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

  // Delete button (generic - can be used for favorites, history, etc.)
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

  // Toggle Favorite button
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
};

// Main SongItem Component
const SongItem: React.FC<SongItemProps> = ({
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
  showFavoriteButton
}) => {
  // Get current state from Redux
  const queue = useAppSelector(selectQueue);
  const favorites = useAppSelector(selectFavorites);
  
  // Get unified action handlers
  const { handleAddToQueue, handleToggleFavorite, handleRemoveFromQueue } = useActions();
  const { openSongInfo } = useModal();
  
  // Check if song is in queue or favorites based on path
  const isInQueue = (Object.values(queue) as QueueItem[]).some(item => item.song.path === song.path);
  const isInFavorites = (Object.values(favorites) as Song[]).some(favSong => favSong.path === song.path);

  // Find queue item key for removal (only needed for queue context)
  const queueItemKey = context === 'queue' 
    ? (Object.entries(queue) as [string, QueueItem][]).find(([, item]) => item.song.path === song.path)?.[0]
    : null;

  // Debug logging for favorites
  debugLog('SongItem render:', {
    songTitle: song.title,
    songPath: song.path,
    favoritesCount: Object.keys(favorites).length,
    isInFavorites,
    favorites: (Object.values(favorites) as Song[]).map(f => f.path)
  });

  // Default values based on context if not explicitly provided
  const shouldShowPath = showPath !== undefined ? showPath : context !== 'queue';
  const shouldShowCount = showCount !== undefined ? showCount : context === 'queue';
  
  // Default values for action buttons based on context if not explicitly provided
  const shouldShowInfoButton = showInfoButton !== undefined ? showInfoButton : ['search', 'history'].includes(context);
  const shouldShowAddButton = showAddButton !== undefined ? showAddButton : ['search', 'history'].includes(context);
  const shouldShowRemoveButton = showRemoveButton !== undefined ? showRemoveButton : context === 'queue' && isAdmin;
  const shouldShowDeleteButton = showDeleteButton !== undefined ? showDeleteButton : context === 'history' && isAdmin;
  const shouldShowFavoriteButton = showFavoriteButton !== undefined ? showFavoriteButton : false; // Disabled for all contexts

  // Create wrapper functions for the unified handlers
  const handleAddToQueueClick = async () => {
    await handleAddToQueue(song);
  };

  const handleToggleFavoriteClick = async () => {
    await handleToggleFavorite(song);
  };

  const handleRemoveFromQueueClick = async () => {
    if (!queueItemKey) return;
    // Find the queue item by key
    const queueItem = (Object.values(queue) as QueueItem[]).find(item => item.key === queueItemKey);
    if (queueItem) {
      await handleRemoveFromQueue(queueItem);
    }
  };

  const handleSelectSinger = () => {
    openSongInfo(song);
  };

  return (
    <IonItem className={className}>
      <SongInfoDisplay 
        song={song} 
        showPath={shouldShowPath} 
        showCount={shouldShowCount} 
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
            onAddToQueue={context === 'queue' ? handleRemoveFromQueueClick : handleAddToQueueClick}
            onRemoveFromQueue={context === 'queue' ? handleRemoveFromQueueClick : onDeleteItem}
            onToggleFavorite={context === 'favorites' ? onDeleteItem : handleToggleFavoriteClick}
            onShowSongInfo={handleSelectSinger}
          />
        </div>
      )}
    </IonItem>
  );
};

export default SongItem; 