import React from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { add, heart, heartOutline, trash, informationCircle } from 'ionicons/icons';
import ActionButton from './ActionButton';
import { useAppSelector } from '../../redux';
import { selectQueue, selectFavorites } from '../../redux';
import type { SongItemProps, QueueItem, Song } from '../../types';

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
  onAddToQueue?: () => void;
  onRemoveFromQueue?: () => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onSelectSinger?: () => void;
}> = ({
  isAdmin,
  isInQueue,
  isInFavorites,
  showInfoButton = false,
  showAddButton = false,
  showRemoveButton = false,
  showDeleteButton = false,
  showFavoriteButton = false,
  onAddToQueue,
  onRemoveFromQueue,
  onToggleFavorite,
  onDelete,
  onSelectSinger
}) => {
  const buttons = [];

  // Info button
  if (showInfoButton && onSelectSinger) {
    buttons.push(
      <ActionButton
        key="info"
        onClick={onSelectSinger}
        variant="secondary"
        size="sm"
      >
        <IonIcon icon={informationCircle} />
      </ActionButton>
    );
  }

  // Add to Queue button
  if (showAddButton && !isInQueue) {
    buttons.push(
      <ActionButton
        key="add"
        onClick={onAddToQueue || (() => {})}
        variant="primary"
        size="sm"
      >
        <IonIcon icon={add} />
      </ActionButton>
    );
  }

  // Remove from Queue button
  if (showRemoveButton && isAdmin && onRemoveFromQueue) {
    buttons.push(
      <ActionButton
        key="remove"
        onClick={onRemoveFromQueue}
        variant="danger"
        size="sm"
      >
        <IonIcon icon={trash} />
      </ActionButton>
    );
  }

  // Delete from Favorites button
  if (showDeleteButton && onDelete) {
    buttons.push(
      <ActionButton
        key="delete"
        onClick={onDelete}
        variant="danger"
        size="sm"
      >
        <IonIcon icon={trash} />
      </ActionButton>
    );
  }

  // Toggle Favorite button
  if (showFavoriteButton) {
    buttons.push(
      <ActionButton
        key="favorite"
        onClick={onToggleFavorite || (() => {})}
        variant={isInFavorites ? 'danger' : 'secondary'}
        size="sm"
      >
        <IonIcon icon={isInFavorites ? heart : heartOutline} />
      </ActionButton>
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
  onAddToQueue,
  onRemoveFromQueue,
  onToggleFavorite,
  onDelete,
  onSelectSinger,
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
  
  // Check if song is in queue or favorites based on path
  const isInQueue = (Object.values(queue) as QueueItem[]).some(item => item.song.path === song.path);
  const isInFavorites = (Object.values(favorites) as Song[]).some(favSong => favSong.path === song.path);

  // Debug logging for favorites
  console.log('SongItem render:', {
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
  const shouldShowInfoButton = showInfoButton !== undefined ? showInfoButton : context !== 'queue';
  const shouldShowAddButton = showAddButton !== undefined ? showAddButton : context !== 'queue';
  const shouldShowRemoveButton = showRemoveButton !== undefined ? showRemoveButton : context === 'queue' && isAdmin;
  const shouldShowDeleteButton = showDeleteButton !== undefined ? showDeleteButton : context === 'favorites';
  const shouldShowFavoriteButton = showFavoriteButton !== undefined ? showFavoriteButton : context !== 'favorites';

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
            onAddToQueue={onAddToQueue}
            onRemoveFromQueue={onRemoveFromQueue}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onSelectSinger={onSelectSinger}
          />
        </div>
      )}
    </IonItem>
  );
};

export default SongItem; 