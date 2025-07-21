import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import SongInfo from './SongInfo';
import { SongInfoContext, type SongInfoContextType } from '../../contexts/SongInfoContext';
import type { Song } from '../../types';

interface SongInfoProviderProps {
  children: ReactNode;
}

export const SongInfoProvider: React.FC<SongInfoProviderProps> = ({ children }) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSongInfo = useCallback((song: Song) => {
    setSelectedSong(song);
    setIsOpen(true);
  }, []);

  const closeSongInfo = useCallback(() => {
    setIsOpen(false);
    setSelectedSong(null);
  }, []);

  const contextValue: SongInfoContextType = {
    openSongInfo,
    closeSongInfo,
    isOpen,
    selectedSong,
  };

  return (
    <SongInfoContext.Provider value={contextValue}>
      {children}
      
      {/* Song Info Modal */}
      {selectedSong && (
        <SongInfo
          isOpen={isOpen}
          onClose={closeSongInfo}
          song={selectedSong}
        />
      )}
    </SongInfoContext.Provider>
  );
};

 