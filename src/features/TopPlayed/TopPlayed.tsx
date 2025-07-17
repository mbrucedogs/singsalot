import React from 'react';
import { SongItem, EmptyState } from '../../components/common';
import { useTopPlayed } from '../../hooks';

const TopPlayed: React.FC = () => {
  const {
    topPlayedItems,
    handleAddToQueue,
    handleToggleFavorite,
  } = useTopPlayed();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Most Played</h1>
        <p className="text-sm text-gray-600">
          Top {topPlayedItems.length} song{topPlayedItems.length !== 1 ? 's' : ''} by play count
        </p>
      </div>

      {/* Top Played List */}
      <div className="bg-white rounded-lg shadow">
        {topPlayedItems.length === 0 ? (
          <EmptyState
            title="No play data yet"
            message="Song play counts will appear here after songs have been played"
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {topPlayedItems.map((song, index) => (
              <div key={song.key} className="flex items-center">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${index === 1 ? 'bg-gray-100 text-gray-800' : ''}
                    ${index === 2 ? 'bg-orange-100 text-orange-800' : ''}
                    ${index > 2 ? 'bg-gray-50 text-gray-600' : ''}
                  `}>
                    {index + 1}
                  </div>
                </div>

                {/* Song Info */}
                <div className="flex-1">
                  <SongItem
                    song={{
                      ...song,
                      path: '', // TopPlayed doesn't have path
                      disabled: false,
                      favorite: false
                    }}
                    context="search"
                    onAddToQueue={() => handleAddToQueue(song)}
                    onToggleFavorite={() => handleToggleFavorite(song)}
                  />
                </div>

                {/* Play Count */}
                <div className="flex-shrink-0 px-4 py-2 text-sm text-gray-600">
                  <div className="font-medium">{song.count}</div>
                  <div className="text-xs text-gray-400">
                    play{song.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPlayed; 