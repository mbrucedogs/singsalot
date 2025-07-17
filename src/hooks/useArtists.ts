import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectArtistsArray, selectSongsArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { Song } from '../types';

export const useArtists = () => {
  const allArtists = useAppSelector(selectArtistsArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filter artists by search term
  const filteredArtists = useMemo(() => {
    if (!searchTerm.trim()) return allArtists;
    
    const term = searchTerm.toLowerCase();
    return allArtists.filter(artist => 
      artist.toLowerCase().includes(term)
    );
  }, [allArtists, searchTerm]);

  // Get songs by artist
  const getSongsByArtist = useCallback((artistName: string) => {
    return allSongs.filter(song => 
      song.artist.toLowerCase() === artistName.toLowerCase()
    );
  }, [allSongs]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
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
    artists: filteredArtists,
    allArtists,
    searchTerm,
    handleSearchChange,
    getSongsByArtist,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 