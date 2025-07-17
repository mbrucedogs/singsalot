import React from 'react';
import ActionButton from './ActionButton';
import type { SongItemProps } from '../../types';

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
  const renderActionPanel = () => {
    switch (context) {
      case 'search':
        return (
          <div className="flex gap-2">
            <ActionButton
              onClick={onAddToQueue || (() => {})}
              variant="primary"
              size="sm"
            >
              Add to Queue
            </ActionButton>
            <ActionButton
              onClick={onToggleFavorite || (() => {})}
              variant={song.favorite ? 'danger' : 'secondary'}
              size="sm"
            >
              {song.favorite ? '❤️' : '🤍'}
            </ActionButton>
          </div>
        );
      
      case 'queue':
        return (
          <div className="flex gap-2">
            {isAdmin && onRemoveFromQueue && (
              <ActionButton
                onClick={onRemoveFromQueue}
                variant="danger"
                size="sm"
              >
                Remove
              </ActionButton>
            )}
            <ActionButton
              onClick={onToggleFavorite || (() => {})}
              variant={song.favorite ? 'danger' : 'secondary'}
              size="sm"
            >
              {song.favorite ? '❤️' : '🤍'}
            </ActionButton>
          </div>
        );
      
      case 'history':
        return (
          <div className="flex gap-2">
            <ActionButton
              onClick={onAddToQueue || (() => {})}
              variant="primary"
              size="sm"
            >
              Add to Queue
            </ActionButton>
            <ActionButton
              onClick={onToggleFavorite || (() => {})}
              variant={song.favorite ? 'danger' : 'secondary'}
              size="sm"
            >
              {song.favorite ? '❤️' : '🤍'}
            </ActionButton>
          </div>
        );
      
      case 'favorites':
        return (
          <div className="flex gap-2">
            <ActionButton
              onClick={onAddToQueue || (() => {})}
              variant="primary"
              size="sm"
            >
              Add to Queue
            </ActionButton>
            <ActionButton
              onClick={onDelete || (() => {})}
              variant="danger"
              size="sm"
            >
              Remove
            </ActionButton>
          </div>
        );
      
      case 'topPlayed':
        return (
          <div className="flex gap-2">
            <ActionButton
              onClick={onAddToQueue || (() => {})}
              variant="primary"
              size="sm"
            >
              Add to Queue
            </ActionButton>
            <ActionButton
              onClick={onToggleFavorite || (() => {})}
              variant={song.favorite ? 'danger' : 'secondary'}
              size="sm"
            >
              {song.favorite ? '❤️' : '🤍'}
            </ActionButton>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`
      flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors
      ${className}
    `}>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {song.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {song.artist}
        </p>
        {/* Show filename for all contexts except queue */}
        {context !== 'queue' && song.path && (
          <p className="text-xs text-gray-400 truncate">
            {extractFilename(song.path)}
          </p>
        )}
        {song.count && (
          <p className="text-xs text-gray-400">
            Played {song.count} times
          </p>
        )}
      </div>
      
      <div className="ml-4 flex-shrink-0">
        {renderActionPanel()}
      </div>
    </div>
  );
};

export default SongItem; 