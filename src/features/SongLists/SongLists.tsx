import React, { useState } from 'react';
import { ActionButton, SongItem, InfiniteScrollList } from '../../components/common';
import { useSongLists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongList } from '../../redux';
import type { SongListSong, Song } from '../../types';

const SongLists: React.FC = () => {
  const {
    songLists,
    hasMore,
    loadMore,
    checkSongAvailability,
    handleAddToQueue,
    handleToggleFavorite,
  } = useSongLists();

  const songListData = useAppSelector(selectSongList);
  const songListCount = Object.keys(songListData).length;
  const [selectedSongList, setSelectedSongList] = useState<string | null>(null);
  const [expandedSongs, setExpandedSongs] = useState<Set<string>>(new Set());

  // Debug logging
  console.log('SongLists component - songList count:', songListCount);
  console.log('SongLists component - songLists:', songLists);

  const handleSongListClick = (songListKey: string) => {
    setSelectedSongList(songListKey);
  };

  const handleCloseSongList = () => {
    setSelectedSongList(null);
  };

  const handleToggleExpanded = (songKey: string) => {
    const newExpanded = new Set(expandedSongs);
    if (newExpanded.has(songKey)) {
      newExpanded.delete(songKey);
    } else {
      newExpanded.add(songKey);
    }
    setExpandedSongs(newExpanded);
  };

  const selectedList = selectedSongList ? songLists.find(list => list.key === selectedSongList) : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Song Lists</h1>
        <p className="text-sm text-gray-600">
          {songLists.length} song list{songLists.length !== 1 ? 's' : ''} available
        </p>
        
        {/* Debug info */}
        <div className="mt-2 text-sm text-gray-500">
          Song lists loaded: {songListCount}
        </div>
      </div>

      {/* Song Lists */}
      <InfiniteScrollList
        items={songLists.map(songList => ({
          ...songList,
          title: songList.title,
          artist: `${songList.songs.length} song${songList.songs.length !== 1 ? 's' : ''}`,
          path: '',
          disabled: false,
          favorite: false,
        }))}
        isLoading={songListCount === 0}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onAddToQueue={() => {}} // Not applicable for song lists
        onToggleFavorite={() => {}} // Not applicable for song lists
        context="search"
        title="Song Lists"
        subtitle={`${songLists.length} song list${songLists.length !== 1 ? 's' : ''} available`}
        emptyTitle="No song lists available"
        emptyMessage="Song lists will appear here when they're available"
        loadingTitle="Loading song lists..."
        loadingMessage="Please wait while song lists are being loaded"
        debugInfo={`Song lists loaded: ${songListCount}`}
        renderExtraContent={(item) => (
          <div className="flex-shrink-0 ml-4">
            <ActionButton
              onClick={() => handleSongListClick(item.key!)}
              variant="primary"
              size="sm"
            >
              View Songs
            </ActionButton>
          </div>
        )}
      />

      {/* Song List Modal */}
      {selectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedList.title}
                </h2>
                <ActionButton
                  onClick={handleCloseSongList}
                  variant="secondary"
                  size="sm"
                >
                  Close
                </ActionButton>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="divide-y divide-gray-200">
                {selectedList.songs.map((songListSong: SongListSong) => {
                  const availableSongs = checkSongAvailability(songListSong);
                  const isExpanded = expandedSongs.has(songListSong.key!);
                  const isAvailable = availableSongs.length > 0;

                  return (
                    <div key={songListSong.key}>
                      {/* Song List Song Row */}
                      <div className={`flex items-center justify-between p-4 ${!isAvailable ? 'opacity-50' : ''}`}>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {songListSong.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {songListSong.artist} • Position {songListSong.position}
                          </p>
                          {!isAvailable && (
                            <p className="text-xs text-red-500 mt-1">
                              Not available in catalog
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                          {isAvailable && (
                            <ActionButton
                              onClick={() => handleToggleExpanded(songListSong.key!)}
                              variant="secondary"
                              size="sm"
                            >
                              {isExpanded ? 'Hide' : 'Show'} ({availableSongs.length})
                            </ActionButton>
                          )}
                        </div>
                      </div>

                      {/* Available Songs (when expanded) */}
                      {isExpanded && isAvailable && (
                        <div className="bg-gray-50 border-t border-gray-200">
                          {availableSongs.map((song: Song) => (
                            <div key={song.key} className="p-4 border-b border-gray-200 last:border-b-0">
                              <SongItem
                                song={song}
                                context="search"
                                onAddToQueue={() => handleAddToQueue(song)}
                                onToggleFavorite={() => handleToggleFavorite(song)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongLists; 