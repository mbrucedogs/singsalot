import { createContext } from 'react';
import type { Song } from '../types';

export interface SongInfoContextType {
  openSongInfo: (song: Song) => void;
  closeSongInfo: () => void;
  isOpen: boolean;
  selectedSong: Song | null;
}

export const SongInfoContext = createContext<SongInfoContextType | null>(null); 