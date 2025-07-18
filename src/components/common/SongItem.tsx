import React from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { add, heart, heartOutline, trash } from 'ionicons/icons';
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

const SongItem: React.FC<SongItemProps> = ({
  song,
  context,
  onAddToQueue,
  onRemoveFromQueue,
  onToggleFavorite,
  onDelete,
  isAdmin = false,
  className = ''
}) => {
  // Get current state from Redux
  const queue = useAppSelector(selectQueue);
  const favorites = useAppSelector(selectFavorites);
  
  // Check if song is in queue or favorites based on path
  const isInQueue = (Object.values(queue) as QueueItem[]).some(item => item.song.path === song.path);
  const isInFavorites = (Object.values(favorites) as Song[]).some(favSong => favSong.path === song.path);
  const renderActionPanel = () => {
    const buttons = [];

    // Add to Queue button (for all contexts except queue, only if not already in queue)
    if (context !== 'queue' && !isInQueue) {
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

    // Remove from Queue button (only for queue context, admin only)
    if (context === 'queue' && isAdmin && onRemoveFromQueue) {
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

    // Delete from Favorites button (only for favorites context)
    if (context === 'favorites' && onDelete) {
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

    // Toggle Favorite button (for all contexts except favorites)
    if (context !== 'favorites') {
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

  return (
    <IonItem className={className}>
      <IonLabel className="flex-1 min-w-0">
        <h3 className="text-base bold-title break-words">
          {song.title}
        </h3>
        <p className="text-sm italic text-gray-500 break-words">
          {song.artist}
        </p>
        {/* Show filename for all contexts except queue */}
        {context !== 'queue' && song.path && (
          <p className="text-xs text-gray-400 break-words">
            {extractFilename(song.path)}
          </p>
        )}
        {song.count && (
          <p className="text-xs text-gray-400">
            Played {song.count} times
          </p>
        )}
      </IonLabel>
      
      <div slot="end" className="flex gap-2 flex-shrink-0 ml-2">
        {renderActionPanel()}
      </div>
    </IonItem>
  );
};

export default SongItem; 