import React from 'react';
import { SongItem, EmptyState, ActionButton } from '../../components/common';
import { useQueue } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectQueue } from '../../redux';

const Queue: React.FC = () => {
  const {
    queueItems,
    queueStats,
    canReorder,
    handleRemoveFromQueue,
    handleToggleFavorite,
    handleMoveUp,
    handleMoveDown,
  } = useQueue();

  const queue = useAppSelector(selectQueue);
  const queueCount = Object.keys(queue).length;

  // Debug logging
  console.log('Queue component - queue count:', queueCount);
  console.log('Queue component - queue items:', queueItems);

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
          <div className="divide-y divide-gray-200">
            {queueItems.map((queueItem, index) => (
              <div key={queueItem.key} className="flex items-center">
                {/* Order Number */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 font-medium">
                  {queueItem.order}
                </div>

                {/* Song Info */}
                <div className="flex-1">
                  <SongItem
                    song={queueItem.song}
                    context="queue"
                    onRemoveFromQueue={() => handleRemoveFromQueue(queueItem)}
                    onToggleFavorite={() => handleToggleFavorite(queueItem.song)}
                    isAdmin={canReorder}
                  />
                </div>

                {/* Singer Info */}
                <div className="flex-shrink-0 px-4 py-2 text-sm text-gray-600">
                  <div className="font-medium">{queueItem.singer.name}</div>
                  <div className="text-xs text-gray-400">
                    {queueItem.isCurrentUser ? '(You)' : ''}
                  </div>
                </div>

                {/* Admin Controls */}
                {canReorder && (
                  <div className="flex-shrink-0 px-4 py-2 flex flex-col gap-1">
                    <ActionButton
                      onClick={() => handleMoveUp(queueItem)}
                      variant="secondary"
                      size="sm"
                      disabled={index === 0}
                    >
                      ↑
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleMoveDown(queueItem)}
                      variant="secondary"
                      size="sm"
                      disabled={index === queueItems.length - 1}
                    >
                      ↓
                    </ActionButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue; 