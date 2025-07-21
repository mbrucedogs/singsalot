import { useCallback } from 'react';
import { useAppSelector, selectSongListArray, selectSongsArray } from '../redux';
import { useActions } from './useActions';
import { usePagination } from './usePagination';
import type { SongListSong } from '../types';

export const useSongLists = () => {
  const allSongLists = useAppSelector(selectSongListArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { handleAddToQueue, handleToggleFavorite } = useActions();

  // Use unified pagination hook
  const pagination = usePagination(allSongLists);

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

  return {
    songLists: pagination.items,
    allSongLists,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    checkSongAvailability,
    handleAddToQueue,
    handleToggleFavorite,
  };
}; 