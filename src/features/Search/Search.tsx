import React from 'react';
import { useAppSelector } from '../../redux';
import { SongItem, EmptyState } from '../../components/common';
import { useSearch } from '../../hooks';
import { selectIsAdmin } from '../../redux';

const Search: React.FC = () => {
  const {
    searchTerm,
    searchResults,
    handleSearchChange,
    handleAddToQueue,
    handleToggleFavorite,
  } = useSearch();
  
  const isAdmin = useAppSelector(selectIsAdmin);

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
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow">
        {searchResults.songs.length === 0 ? (
          <EmptyState
            title={searchTerm ? "No songs found" : "No songs available"}
            message={searchTerm ? "Try adjusting your search terms" : "Songs will appear here once loaded"}
            icon={
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            }
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {searchResults.songs.map((song) => (
              <SongItem
                key={song.key}
                song={song}
                context="search"
                onAddToQueue={() => handleAddToQueue(song)}
                onToggleFavorite={() => handleToggleFavorite(song)}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Stats */}
      {searchTerm && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Found {searchResults.count} song{searchResults.count !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default Search; 