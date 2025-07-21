import { useContext } from 'react';
import { SongInfoContext, type SongInfoContextType } from '../contexts/SongInfoContext';

export const useSongInfo = (): SongInfoContextType => {
  const context = useContext(SongInfoContext);
  if (context === null) {
    throw new Error('useSongInfo must be used within a SongInfoProvider');
  }
  return context;
}; 