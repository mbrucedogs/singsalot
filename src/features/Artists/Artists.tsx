import React, { useState, useEffect, useRef } from 'react';
import { ActionButton } from '../../components/common';
import { useArtists } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectSongs } from '../../redux';

const Artists: React.FC = () => {
  const {
    artists,
    allArtists,
    searchTerm,
    hasMore,
    loadMore,
    handleSearchChange,
    getSongsByArtist,
    getSongCountByArtist,
    handleAddToQueue,
    handleToggleFavorite,
  } = useArtists();

  const songs = useAppSelector(selectSongs);
  const songsCount = Object.keys(songs).length;
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    console.log('Artists - Setting up observer:', { hasMore, songsCount, itemsLength: artists.length });
    
    const observer = new IntersectionObserver(
      (entries) => {
        console.log('Artists - Intersection detected:', { 
          isIntersecting: entries[0].isIntersecting, 
          hasMore, 
          songsCount 
        });
        
        if (entries[0].isIntersecting && hasMore && songsCount > 0) {
          console.log('Artists - Loading more items');
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, songsCount, artists.length]);

  // Debug logging
  useEffect(() => {
    console.log('Artists component - artists count:', artists.length);
    console.log('Artists component - selected artist:', selectedArtist);
  }, [artists.length, selectedArtist]);

  const handleArtistClick = (artist: string) => {
    setSelectedArtist(artist);
  };

  const handleCloseArtistSongs = () => {
    setSelectedArtist(null);
  };

  const selectedArtistSongs = selectedArtist ? getSongsByArtist(selectedArtist) : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Artists</h1>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Debug info */}
        <div className="mt-2 text-sm text-gray-500">
          Total songs loaded: {songsCount} | Showing: {artists.length} of {allArtists.length} artists | Search term: "{searchTerm}"
        </div>
      </div>

      {/* Artists List */}
      <div className="bg-white rounded-lg shadow">
        {songsCount === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading artists...</h3>
            <p className="text-sm text-gray-500">Please wait while songs are being loaded from the database</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No artists found" : "No artists available"}
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms" : "Artists will appear here once songs are loaded"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {artists.map((artist) => (
              <div key={artist} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {artist}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getSongCountByArtist(artist)} song{getSongCountByArtist(artist) !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ActionButton
                    onClick={() => handleArtistClick(artist)}
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
                  Loading more artists...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Artist Songs Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden" style={{ backgroundColor: 'white', zIndex: 10000 }}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Songs by {selectedArtist}
                </h2>
                <ActionButton
                  onClick={handleCloseArtistSongs}
                  variant="secondary"
                  size="sm"
                >
                  Close
                </ActionButton>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="divide-y divide-gray-200">
                {selectedArtistSongs.map((song) => (
                  <div key={song.key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {song.artist}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                        <ActionButton
                          onClick={() => handleAddToQueue(song)}
                          variant="primary"
                          size="sm"
                        >
                          Add to Queue
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleToggleFavorite(song)}
                          variant="secondary"
                          size="sm"
                        >
                          {song.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artists; 