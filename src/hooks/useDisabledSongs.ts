import { useState, useEffect, useCallback } from 'react';
import { disabledSongsService } from '../firebase/services';
import { useAppSelector } from '../redux';
import { selectControllerName } from '../redux';
import { useToast } from './useToast';
import type { Song, DisabledSong } from '../types';

export const useDisabledSongs = () => {
  const [disabledSongPaths, setDisabledSongPaths] = useState<Set<string>>(new Set());
  const [disabledSongs, setDisabledSongs] = useState<Record<string, DisabledSong>>({});
  const [loading, setLoading] = useState(true);
  const controllerName = useAppSelector(selectControllerName);
  const { showSuccess, showError } = useToast();

  // Load disabled songs on mount and subscribe to changes
  useEffect(() => {
    if (!controllerName) return;

    const loadDisabledSongs = async () => {
      try {
        setLoading(true);
        const songs = await disabledSongsService.getDisabledSongs(controllerName);
        const paths = await disabledSongsService.getDisabledSongPaths(controllerName);
        
        setDisabledSongs(songs);
        setDisabledSongPaths(paths);
      } catch (error) {
        console.error('Error loading disabled songs:', error);
        showError('Failed to load disabled songs');
      } finally {
        setLoading(false);
      }
    };

    loadDisabledSongs();

    // Subscribe to real-time updates
    const unsubscribe = disabledSongsService.subscribeToDisabledSongs(
      controllerName,
      (songs) => {
        // Only update if the data has actually changed
        setDisabledSongs(prevSongs => {
          if (JSON.stringify(prevSongs) !== JSON.stringify(songs)) {
            return songs;
          }
          return prevSongs;
        });
        
        setDisabledSongPaths(prevPaths => {
          const newPaths = new Set(Object.values(songs).map((song: DisabledSong) => song.path));
          if (JSON.stringify(Array.from(prevPaths)) !== JSON.stringify(Array.from(newPaths))) {
            return newPaths;
          }
          return prevPaths;
        });
      }
    );

    return unsubscribe;
  }, [controllerName, showError]);

  // Check if a song is disabled
  const isSongDisabled = useCallback((song: Song): boolean => {
    const isDisabled = disabledSongPaths.has(song.path);
    return isDisabled;
  }, [disabledSongPaths]);

  // Add a song to disabled list
  const addDisabledSong = useCallback(async (song: Song) => {
    if (!controllerName) {
      console.error('No controller name available');
      showError('No controller name available');
      return;
    }

    if (!song.path) {
      console.error('Song has no path:', song);
      showError('Song has no path');
      return;
    }

    try {
      await disabledSongsService.addDisabledSong(controllerName, song);
      showSuccess('Song marked as disabled');
    } catch (error) {
      console.error('Error adding disabled song:', error);
      showError(`Failed to mark song as disabled: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [controllerName, showSuccess, showError]);

  // Remove a song from disabled list
  const removeDisabledSong = useCallback(async (song: Song) => {
    if (!controllerName) return;

    try {
      await disabledSongsService.removeDisabledSong(controllerName, song.path);
      showSuccess('Song re-enabled');
    } catch (error) {
      console.error('Error removing disabled song:', error);
      showError('Failed to re-enable song');
    }
  }, [controllerName, showSuccess, showError]);

  // Filter out disabled songs from an array
  const filterDisabledSongs = useCallback((songs: Song[]): Song[] => {
    return songs.filter(song => !isSongDisabled(song));
  }, [isSongDisabled]);

  return {
    disabledSongPaths,
    disabledSongs,
    loading,
    isSongDisabled,
    addDisabledSong,
    removeDisabledSong,
    filterDisabledSongs,
  };
}; 