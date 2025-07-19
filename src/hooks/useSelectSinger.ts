import { useState, useCallback } from 'react';
import type { Song } from '../types';

export const useSelectSinger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const openSelectSinger = useCallback((song: Song) => {
    setSelectedSong(song);
    setIsOpen(true);
  }, []);

  const closeSelectSinger = useCallback(() => {
    setIsOpen(false);
    setSelectedSong(null);
  }, []);

  return {
    isOpen,
    selectedSong,
    openSelectSinger,
    closeSelectSinger,
  };
}; 