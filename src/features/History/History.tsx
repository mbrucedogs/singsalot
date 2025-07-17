import React from 'react';
import { SongItem, EmptyState } from '../../components/common';
import { useHistory } from '../../hooks';
import { formatDate } from '../../utils/dataProcessing';

const History: React.FC = () => {
  const {
    historyItems,
    handleAddToQueue,
    handleToggleFavorite,
  } = useHistory();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recently Played</h1>
        <p className="text-sm text-gray-600">
          {historyItems.length} song{historyItems.length !== 1 ? 's' : ''} in history
        </p>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow">
        {historyItems.length === 0 ? (
          <EmptyState
            title="No history yet"
            message="Songs will appear here after they've been played"
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {historyItems.map((song) => (
              <div key={song.key} className="flex items-center">
                {/* Song Info */}
                <div className="flex-1">
                  <SongItem
                    song={song}
                    context="history"
                    onAddToQueue={() => handleAddToQueue(song)}
                    onToggleFavorite={() => handleToggleFavorite(song)}
                  />
                </div>

                {/* Play Date */}
                {song.date && (
                  <div className="flex-shrink-0 px-4 py-2 text-sm text-gray-500">
                    {formatDate(song.date)}
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

export default History; 