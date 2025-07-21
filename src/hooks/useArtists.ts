import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectArtistsArray, selectSongsArray } from '../redux';
import { useActions } from './useActions';
import { usePagination } from './usePagination';
import type { Song } from '../types';

export const useArtists = () => {
  const allArtists = useAppSelector(selectArtistsArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { handleAddToQueue, handleToggleFavorite } = useActions();
  
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter artists by search term
  const filteredArtists = useMemo(() => {
    if (!searchTerm.trim()) return allArtists;
    
    const term = searchTerm.toLowerCase();
    return allArtists.filter(artist => 
      artist.toLowerCase().includes(term)
    );
  }, [allArtists, searchTerm]);

  // Use unified pagination hook
  const pagination = usePagination(filteredArtists);

  // Get songs by artist (now using cached data)
  const getSongsByArtist = useCallback((artistName: string) => {
    return songsByArtist.songsMap.get(artistName.toLowerCase()) || [];
  }, [songsByArtist.songsMap]);

  // Get song count by artist (now using cached data)
  const getSongCountByArtist = useCallback((artistName: string) => {
    return songsByArtist.countsMap.get(artistName.toLowerCase()) || 0;
  }, [songsByArtist.countsMap]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    pagination.resetPage(); // Reset to first page when searching
  }, [pagination]);

  return {
    artists: pagination.items,
    allArtists: filteredArtists,
    searchTerm,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    handleSearchChange,
    getSongsByArtist,
    getSongCountByArtist,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 