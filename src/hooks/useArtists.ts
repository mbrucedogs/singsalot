import { useCallback, useMemo } from 'react';
import { useAppSelector, selectArtistsArray, selectSongsArray } from '../redux';
import { useActions } from './useActions';
import { usePaginatedData } from './index';
import type { Song } from '../types';

export const useArtists = () => {
  const allArtists = useAppSelector(selectArtistsArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { handleAddToQueue, handleToggleFavorite } = useActions();

  // Pre-compute songs by artist and song counts for performance
  const songsByArtist = useMemo(() => {
    const songsMap = new Map<string, Song[]>();
    const countsMap = new Map<string, number>();
    
    allSongs.forEach(song => {
      const artist = song.artist.toLowerCase();
      if (!songsMap.has(artist)) {
        songsMap.set(artist, []);
        countsMap.set(artist, 0);
      }
      songsMap.get(artist)!.push(song);
      countsMap.set(artist, countsMap.get(artist)! + 1);
    });
    
    return { songsMap, countsMap };
  }, [allSongs]);

  // Use the composable pagination hook
  const pagination = usePaginatedData(allArtists, {
    itemsPerPage: 20 // Default pagination size
  });

  // Get songs by artist (now using cached data)
  const getSongsByArtist = useCallback((artistName: string) => {
    return songsByArtist.songsMap.get(artistName.toLowerCase()) || [];
  }, [songsByArtist.songsMap]);

  // Get song count by artist (now using cached data)
  const getSongCountByArtist = useCallback((artistName: string) => {
    return songsByArtist.countsMap.get(artistName.toLowerCase()) || 0;
  }, [songsByArtist.countsMap]);

  return {
    artists: pagination.items,
    allArtists: pagination.searchTerm ? pagination.items : allArtists,
    searchTerm: pagination.searchTerm,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    handleSearchChange: pagination.setSearchTerm,
    getSongsByArtist,
    getSongCountByArtist,
    handleAddToQueue,
    handleToggleFavorite,
    isLoading: pagination.isLoading,
  };
}; 