import { useMemo } from 'react';
import { useAppSelector } from '../redux';
import { selectSongsArray } from '../redux';
import { useDisabledSongs } from './useDisabledSongs';
import { filterSongs } from '../utils/dataProcessing';
import { debugLog } from '../utils/logger';


interface UseFilteredSongsOptions {
  searchTerm?: string;
  excludeDisabled?: boolean;
  context?: string; // For debugging purposes
}

export const useFilteredSongs = (options: UseFilteredSongsOptions = {}) => {
  const { searchTerm = '', excludeDisabled = true, context = 'unknown' } = options;
  
  const allSongs = useAppSelector(selectSongsArray);
  const { disabledSongPaths, loading: disabledSongsLoading } = useDisabledSongs();

  const filteredSongs = useMemo(() => {
    // Don't return any results if disabled songs are still loading and we need to exclude them
    if (excludeDisabled && disabledSongsLoading) {
      debugLog(`${context} - disabled songs still loading, returning empty array`);
      return [];
    }

    let songs = allSongs;

    // Filter out disabled songs first if needed
    if (excludeDisabled) {
      songs = songs.filter(song => !disabledSongPaths.has(song.path));
      debugLog(`${context} - filtering songs:`, {
        totalSongs: allSongs.length,
        afterDisabledFilter: songs.length,
      });
    }

    // Apply search filter if search term is provided
    if (searchTerm.trim()) {
      const searchFiltered = filterSongs(songs, searchTerm);
      debugLog(`${context} - with search term, filtered songs:`, {
        before: songs.length,
        after: searchFiltered.length,
        searchTerm
      });
      return searchFiltered;
    }

    return songs;
  }, [allSongs, searchTerm, disabledSongPaths, disabledSongsLoading, excludeDisabled, context]);

  return {
    songs: filteredSongs,
    allSongs,
    disabledSongsLoading,
    disabledSongPaths,
    totalCount: allSongs.length,
    filteredCount: filteredSongs.length,
  };
}; 