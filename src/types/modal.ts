import type { Song } from './index';

export const ModalType = {
  SONG_INFO: 'songInfo',
  SELECT_SINGER: 'selectSinger'
} as const;

export type ModalViewType = typeof ModalType[keyof typeof ModalType];

export interface ModalItem {
  id: string;
  type: ModalViewType;
  data: Song;
  isOpen: boolean;
}

export interface ModalState {
  stack: ModalItem[];
}

export interface ModalContextType {
  // Generic modal methods
  openModal: (type: ModalViewType, data: Song) => string; // Returns modal ID
  closeModal: (id: string) => void;
  closeTopModal: () => void;
  
  // Specific modal methods for convenience
  openSongInfo: (song: Song) => string;
  openSelectSinger: (song: Song) => string;
  
  // State
  modalState: ModalState;
} 