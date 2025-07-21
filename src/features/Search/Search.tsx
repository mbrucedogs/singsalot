import React from 'react';
import { IonSearchbar } from '@ionic/react';
import { InfiniteScrollList, SongItem } from '../../components/common';
import { useSearch } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectSongs } from '../../redux';
import { debugLog } from '../../utils/logger';
import type { Song } from '../../types';

const Search: React.FC = () => {
  const {
    searchTerm,
    searchResults,
    handleSearchChange,
    loadMore,
  } = useSearch();
  
  const isAdmin = useAppSelector(selectIsAdmin);
  const songs = useAppSelector(selectSongs);
  const songsCount = Object.keys(songs).length;

  // Performance monitoring
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      debugLog(`Search component render time: ${renderTime.toFixed(2)}ms`);
    };
  });

  // Debug logging
  debugLog('Search component - songs count:', songsCount);
  debugLog('Search component - search results:', searchResults);
  debugLog('Search component - search term:', searchTerm);
  debugLog('Search component - showing:', searchResults.songs.length, 'of', searchResults.count);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          {/* Search Input */}
          <IonSearchbar
            placeholder="Search by title or artist..."
            value={searchTerm}
            onIonInput={(e) => handleSearchChange(e.detail.value || '')}
            debounce={300}
            showClearButton="focus"
          />
        </div>

        {/* Search Results */}
        <InfiniteScrollList<Song>
          items={searchResults.songs}
          isLoading={songsCount === 0}
          hasMore={searchResults.hasMore}
          onLoadMore={loadMore}
          renderItem={(song) => (
            <SongItem
              song={song}
              context="search"
              isAdmin={isAdmin}
              showAddButton={true}
              showInfoButton={true}
              showFavoriteButton={false}
            />
          )}
          emptyTitle={searchTerm ? "No songs found" : "No songs available"}
          emptyMessage={searchTerm ? "Try adjusting your search terms" : "Songs will appear here once loaded"}
          loadingTitle="Loading songs..."
          loadingMessage="Please wait while songs are being loaded from the database"
        />

        {/* Search Stats */}
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Found {searchResults.count} song{searchResults.count !== 1 ? 's' : ''} 
            {searchResults.hasMore && ` • Scroll down to load more`}
          </div>
        )}
      </div>

    </>
  );
};

export default Search; 