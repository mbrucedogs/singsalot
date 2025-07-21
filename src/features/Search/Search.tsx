import React from 'react';
import { IonSearchbar } from '@ionic/react';
import { InfiniteScrollList, SongItem } from '../../components/common';
import { useSearch, useDebugLogging } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectSongs } from '../../redux';
import type { Song } from '../../types';
import { SongItemContext } from '../../types';

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

  // Use unified debug logging
  const { logData } = useDebugLogging({ componentName: 'Search' });

  // Log component data
  logData({
    'songs count': songsCount,
    'search results': searchResults,
    'search term': searchTerm,
    'showing': `${searchResults.songs.length} of ${searchResults.count}`,
  });

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
              context={SongItemContext.SEARCH}
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