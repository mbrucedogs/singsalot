import { useState, useEffect, useCallback } from 'react';
import { disabledSongsService } from '../firebase/services';
import { useAppSelector } from '../redux';
import { selectControllerName } from '../redux';
import { useToast } from './useToast';
import { debugLog } from '../utils/logger';
import type { Song, DisabledSong } from '../types';

export const useDisabledSongs = () => {
  const [disabledSongPaths, setDisabledSongPaths] = useState<Set<string>>(new Set());
  const [disabledSongs, setDisabledSongs] = useState<Record<string, DisabledSong>>({});
  const [loading, setLoading] = useState(true);
  const controllerName = useAppSelector(selectControllerName);
  const toast = useToast();
  const showSuccess = toast?.showSuccess;
  const showError = toast?.showError;

  // Load disabled songs on mount and subscribe to changes
  useEffect(() => {
    if (!controllerName) return;

    const loadDisabledSongs = async () => {
      try {
        setLoading(true);
        debugLog('useDisabledSongs - loading disabled songs for controller:', controllerName);
        
        const songs = await disabledSongsService.getDisabledSongs(controllerName);
        const paths = await disabledSongsService.getDisabledSongPaths(controllerName);
        
        debugLog('useDisabledSongs - loaded disabled songs:', {
          songsCount: Object.keys(songs).length,
          pathsCount: paths.size,
          paths: Array.from(paths)
        });
        
        setDisabledSongs(songs);
        setDisabledSongPaths(paths);
      } catch (error) {
        console.error('Error loading disabled songs:', error);
        if (showError) showError('Failed to load disabled songs');
      } finally {
        setLoading(false);
      }
    };

    loadDisabledSongs();

    // Subscribe to real-time updates
    const unsubscribe = disabledSongsService.subscribeToDisabledSongs(
      controllerName,
      (songs) => {
        try {
          debugLog('useDisabledSongs - subscription update:', {
            songsCount: Object.keys(songs).length,
            songs: Object.values(songs).map((song: DisabledSong) => song.path)
          });
          
          setDisabledSongs(songs);
          setDisabledSongPaths(new Set(Object.values(songs).map((song: DisabledSong) => song.path)));
        } catch (error) {
          console.error('Error updating disabled songs state:', error);
        }
      }
    );

    return unsubscribe;
  }, [controllerName, showError]);

  // Check if a song is disabled
  const isSongDisabled = useCallback((song: Song): boolean => {
    const isDisabled = disabledSongPaths.has(song.path);
    debugLog('isSongDisabled check:', { 
      songTitle: song.title, 
      songPath: song.path, 
      isDisabled, 
      disabledSongPathsSize: disabledSongPaths.size,
      disabledSongPaths: Array.from(disabledSongPaths)
    });
    return isDisabled;
  }, [disabledSongPaths]);

  // Add a song to disabled list
  const addDisabledSong = useCallback(async (song: Song) => {
    if (!controllerName) {
      console.error('No controller name available');
      if (showError) showError('No controller name available');
      return;
    }

    if (!song.path) {
      console.error('Song has no path:', song);
      if (showError) showError('Song has no path');
      return;
    }

    try {
      await disabledSongsService.addDisabledSong(controllerName, song);
      if (showSuccess) showSuccess('Song marked as disabled');
    } catch (error) {
      console.error('Error adding disabled song:', error);
      if (showError) showError(`Failed to mark song as disabled: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [controllerName, showSuccess, showError]);

  // Remove a song from disabled list
  const removeDisabledSong = useCallback(async (song: Song) => {
    if (!controllerName) return;

    try {
      await disabledSongsService.removeDisabledSong(controllerName, song.path);
      if (showSuccess) showSuccess('Song re-enabled');
    } catch (error) {
      console.error('Error removing disabled song:', error);
      if (showError) showError('Failed to re-enable song');
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