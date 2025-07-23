import { useCallback, useMemo } from 'react';
import { useAppSelector, selectSongListArray, selectSongsArray } from '../redux';
import { useActions } from './useActions';
import { usePaginatedData } from './index';
import type { SongListSong, Song } from '../types';

export const useSongLists = () => {
  const allSongLists = useAppSelector(selectSongListArray);
  const allSongs = useAppSelector(selectSongsArray);
  const { handleAddToQueue, handleToggleFavorite } = useActions();

  // Pre-compute songs by artist and title combination for performance
  const songsByArtistTitle = useMemo(() => {
    const songsMap = new Map<string, Song[]>();
    const countsMap = new Map<string, number>();
    
    allSongs.forEach(song => {
      const artist = (song.artist || '').toLowerCase();
      const title = (song.title || '').toLowerCase();
      const key = `${artist}|${title}`;
      
      if (!songsMap.has(key)) {
        songsMap.set(key, []);
        countsMap.set(key, 0);
      }
      songsMap.get(key)!.push(song);
      countsMap.set(key, countsMap.get(key)! + 1);
    });
    
    return { songsMap, countsMap };
  }, [allSongs]);

  // Use the composable pagination hook
  const pagination = usePaginatedData(allSongLists, {
    itemsPerPage: 20 // Default pagination size
  });

  // Get songs by artist and title (now using cached data)
  const getSongsByArtistTitle = useCallback((artist: string, title: string) => {
    const key = `${(artist || '').toLowerCase()}|${(title || '').toLowerCase()}`;
    return songsByArtistTitle.songsMap.get(key) || [];
  }, [songsByArtistTitle.songsMap]);

  // Get song count by artist and title (now using cached data)
  const getSongCountByArtistTitle = useCallback((artist: string, title: string) => {
    const key = `${(artist || '').toLowerCase()}|${(title || '').toLowerCase()}`;
    return songsByArtistTitle.countsMap.get(key) || 0;
  }, [songsByArtistTitle.countsMap]);

  // Check if a song exists in the catalog (enhanced version)
  const checkSongAvailability = useCallback((songListSong: SongListSong) => {
    if (songListSong.foundSongs && songListSong.foundSongs.length > 0) {
      return songListSong.foundSongs;
    }
    
    // Use the pre-computed data for better performance
    return getSongsByArtistTitle(songListSong.artist, songListSong.title);
  }, [getSongsByArtistTitle]);

  // Get song count for a song list song
  const getSongCountForSongListSong = useCallback((songListSong: SongListSong) => {
    return getSongCountByArtistTitle(songListSong.artist, songListSong.title);
  }, [getSongCountByArtistTitle]);

  return {
    songLists: pagination.items,
    allSongLists,
    hasMore: pagination.hasMore,
    loadMore: pagination.loadMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    checkSongAvailability,
    getSongCountForSongListSong,
    getSongsByArtistTitle,
    getSongCountByArtistTitle,
    handleAddToQueue,
    handleToggleFavorite,
    isLoading: pagination.isLoading,
  };
}; 