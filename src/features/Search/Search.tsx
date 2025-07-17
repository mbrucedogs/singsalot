import React from 'react';
import { InfiniteScrollList } from '../../components/common';
import { useSearch } from '../../hooks';
import { useAppSelector } from '../../redux';
import { selectIsAdmin, selectSongs } from '../../redux';

const Search: React.FC = () => {
  const {
    searchTerm,
    searchResults,
    handleSearchChange,
    handleAddToQueue,
    handleToggleFavorite,
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
      console.log(`Search component render time: ${renderTime.toFixed(2)}ms`);
    };
  });

  // Debug logging
  console.log('Search component - songs count:', songsCount);
  console.log('Search component - search results:', searchResults);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Songs</h1>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or artist..."
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
          Total songs loaded: {songsCount} | Showing: {searchResults.songs.length} of {searchResults.count} | Page: {searchResults.currentPage}/{searchResults.totalPages} | Search term: "{searchTerm}"
        </div>
      </div>

      {/* Search Results */}
      <InfiniteScrollList
        items={searchResults.songs}
        isLoading={songsCount === 0}
        hasMore={searchResults.hasMore}
        onLoadMore={loadMore}
        onAddToQueue={handleAddToQueue}
        onToggleFavorite={handleToggleFavorite}
        context="search"
        title=""
        emptyTitle={searchTerm ? "No songs found" : "No songs available"}
        emptyMessage={searchTerm ? "Try adjusting your search terms" : "Songs will appear here once loaded"}
        loadingTitle="Loading songs..."
        loadingMessage="Please wait while songs are being loaded from the database"
        isAdmin={isAdmin}
        debugInfo=""
      />

      {/* Search Stats */}
      {searchTerm && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Found {searchResults.count} song{searchResults.count !== 1 ? 's' : ''} 
          {searchResults.hasMore && ` • Scroll down to load more`}
        </div>
      )}
    </div>
  );
};

export default Search; 