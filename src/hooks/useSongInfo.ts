import { useState, useCallback } from 'react';
import type { Song } from '../types';

export const useSongInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const openSongInfo = useCallback((song: Song) => {
    setSelectedSong(song);
    setIsOpen(true);
  }, []);

  const closeSongInfo = useCallback(() => {
    setIsOpen(false);
    setSelectedSong(null);
  }, []);

  return {
    isOpen,
    selectedSong,
    openSongInfo,
    closeSongInfo,
  };
}; 