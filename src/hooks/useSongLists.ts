import { useCallback, useMemo, useState } from 'react';
import { useAppSelector, selectSongListArray, selectSongsArray } from '../redux';
import { useSongOperations } from './useSongOperations';
import { useToast } from './useToast';
import type { SongListSong, Song } from '../types';

const ITEMS_PER_PAGE = 20;

export const useSongLists = () => {
  const allSongLists = useAppSelector(selectSongListArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);

  // Paginate the song lists - show all items up to current page
  const songLists = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return allSongLists.slice(0, endIndex);
  }, [allSongLists, currentPage]);

  const hasMore = useMemo(() => {
    // Show "hasMore" if there are more items than currently loaded
    const hasMoreItems = songLists.length < allSongLists.length;
    console.log('useSongLists - hasMore calculation:', { 
      songListsLength: songLists.length, 
      allSongListsLength: allSongLists.length, 
      hasMore: hasMoreItems,
      currentPage 
    });
    return hasMoreItems;
  }, [songLists.length, allSongLists.length, currentPage]);

  const loadMore = useCallback(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const hasMoreItems = endIndex < allSongLists.length;
    
    console.log('useSongLists - loadMore called:', { 
      hasMoreItems, 
      currentPage, 
      allSongListsLength: allSongLists.length,
      endIndex 
    });
    
    if (hasMoreItems) {
      console.log('useSongLists - Incrementing page from', currentPage, 'to', currentPage + 1);
      setCurrentPage(prev => prev + 1);
    } else {
      console.log('useSongLists - Not loading more because hasMore is false');
    }
  }, [currentPage, allSongLists.length]);

  // Check if a song exists in the catalog
  const checkSongAvailability = useCallback((songListSong: SongListSong) => {
    if (songListSong.foundSongs && songListSong.foundSongs.length > 0) {
      return songListSong.foundSongs;
    }
    
    // Search for songs by artist and title
    const matchingSongs = allSongs.filter(song => 
      song.artist.toLowerCase() === songListSong.artist.toLowerCase() &&
      song.title.toLowerCase() === songListSong.title.toLowerCase()
    );
    
    return matchingSongs;
  }, [allSongs]);

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
    songLists,
    allSongLists,
    hasMore,
    loadMore,
    currentPage,
    totalPages: Math.ceil(allSongLists.length / ITEMS_PER_PAGE),
    checkSongAvailability,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 