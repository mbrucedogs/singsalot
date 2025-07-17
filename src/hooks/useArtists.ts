import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectArtistsArray, selectSongsArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useArtists = () => {
  const allArtists = useAppSelector(selectArtistsArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Paginate the filtered artists - show all items up to current page
  const artists = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return filteredArtists.slice(0, endIndex);
  }, [filteredArtists, currentPage]);

  const hasMore = useMemo(() => {
    // Show "hasMore" if there are more items than currently loaded
    return filteredArtists.length > ITEMS_PER_PAGE && artists.length < filteredArtists.length;
  }, [artists.length, filteredArtists.length]);

  const loadMore = useCallback(() => {
    console.log('useArtists - loadMore called:', { 
      hasMore, 
      currentPage, 
      filteredArtistsLength: filteredArtists.length,
      artistsLength: artists.length 
    });
    if (hasMore) {
      console.log('useArtists - Incrementing page from', currentPage, 'to', currentPage + 1);
      setCurrentPage(prev => prev + 1);
    } else {
      console.log('useArtists - Not loading more because hasMore is false');
    }
  }, [hasMore, currentPage, filteredArtists.length, artists.length]);

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
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleAddToQueue = useCallback(async (song: Song) => {
    try {
      await addToQueue(song);
      showSuccess('Song added to queue');
    } catch {
      showError('Failed to add song to queue');
    }
  }, [addToQueue, showSuccess, showError]);

  const handleToggleFavorite = useCallback(async (song: Song) => {
    try {
      await toggleFavorite(song);
      showSuccess(song.favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      showError('Failed to update favorites');
    }
  }, [toggleFavorite, showSuccess, showError]);

  return {
    artists,
    allArtists: filteredArtists,
    searchTerm,
    hasMore,
    loadMore,
    currentPage,
    totalPages: Math.ceil(filteredArtists.length / ITEMS_PER_PAGE),
    handleSearchChange,
    getSongsByArtist,
    getSongCountByArtist,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 