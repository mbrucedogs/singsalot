import React from 'react';
import { SongItem, EmptyState, ActionButton } from '../../components/common';
import { useQueue } from '../../hooks';

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Queue</h1>
        <p className="text-sm text-gray-600">
          {queueStats.totalSongs} song{queueStats.totalSongs !== 1 ? 's' : ''} in queue
        </p>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-lg shadow">
        {queueItems.length === 0 ? (
          <EmptyState
            title="Queue is empty"
            message="Add songs from search, history, or favorites to get started"
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
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