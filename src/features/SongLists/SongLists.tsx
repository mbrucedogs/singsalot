import React, { useState, useEffect, useRef } from 'react';
import { ActionButton, SongItem } from '../../components/common';
import { useSongLists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongList } from '../../redux';
import type { SongListSong, Song } from '../../types';

const SongLists: React.FC = () => {
  const {
    songLists,
    allSongLists,
    hasMore,
    loadMore,
    checkSongAvailability,
    handleAddToQueue,
    handleToggleFavorite,
  } = useSongLists();

  const songListData = useAppSelector(selectSongList);
  const songListCount = Object.keys(songListData).length;
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    console.log('SongLists - Setting up observer:', { hasMore, songListCount, itemsLength: songLists.length });
    
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('SongLists - Intersection detected:', { 
          isIntersecting: entries[0].isIntersecting, 
          hasMore, 
          songListCount 
        });
        
        if (entries[0].isIntersecting && hasMore && songListCount > 0) {
          console.log('SongLists - Loading more items');
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, songListCount]);
  const [selectedSongList, setSelectedSongList] = useState<string | null>(null);
  const [expandedSongs, setExpandedSongs] = useState<Set<string>>(new Set());

  // Debug logging - only log when data changes
  useEffect(() => {
    console.log('SongLists component - songList count:', songListCount);
    console.log('SongLists component - songLists:', songLists);
  }, [songListCount, songLists.length]);

  const handleSongListClick = (songListKey: string) => {
    console.log('SongLists - handleSongListClick called with key:', songListKey);
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

  const finalSelectedList = selectedSongList
    ? allSongLists.find(list => list.key === selectedSongList)
    : null;
  
  // Debug logging for modal
  useEffect(() => {
    console.log('SongLists - Modal state check:', { 
      selectedSongList, 
      finalSelectedList: !!finalSelectedList,
      songListsLength: songLists.length 
    });
    if (selectedSongList) {
      console.log('SongLists - Modal opened for song list:', selectedSongList);
      console.log('SongLists - Selected list data:', finalSelectedList);
      console.log('SongLists - About to render modal, finalSelectedList:', !!finalSelectedList);
    }
  }, [selectedSongList, finalSelectedList, songLists.length]);

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
      <div className="bg-white rounded-lg shadow">
        {songListCount === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading song lists...</h3>
            <p className="text-sm text-gray-500">Please wait while song lists are being loaded</p>
          </div>
        ) : songLists.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No song lists available</h3>
            <p className="text-sm text-gray-500">Song lists will appear here when they're available</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {songLists.map((songList) => (
              <div key={songList.key} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {songList.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {songList.songs.length} song{songList.songs.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ActionButton
                    onClick={() => handleSongListClick(songList.key!)}
                    variant="primary"
                    size="sm"
                  >
                    View Songs
                  </ActionButton>
                </div>
              </div>
            ))}
            
            {/* Infinite scroll trigger */}
            {hasMore && (
              <div 
                ref={observerRef}
                className="py-4 text-center text-gray-500"
              >
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more song lists...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Song List Modal */}
      {finalSelectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" style={{ backgroundColor: 'white', zIndex: 10000 }}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {finalSelectedList.title}
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
                {finalSelectedList.songs.map((songListSong: SongListSong, idx) => {
                  const availableSongs = checkSongAvailability(songListSong);
                  const isExpanded = expandedSongs.has(songListSong.key!);
                  const isAvailable = availableSongs.length > 0;

                  return (
                    <div key={songListSong.key || `${songListSong.title}-${songListSong.position}-${idx}`}>
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
                          {availableSongs.map((song: Song, sidx) => (
                            <div key={song.key || `${song.title}-${song.artist}-${sidx}`} className="p-4 border-b border-gray-200 last:border-b-0">
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