// Core data types (from docs/types.ts)
export const PlayerState = {
  playing: "Playing",
  paused: "Paused",
  stopped: "Stopped"
} as const;

export type PlayerStateType = typeof PlayerState[keyof typeof PlayerState];

export interface Keyable {
  key?: string;
}

export interface Authentication {
  authenticated: boolean;
  singer: string;
  isAdmin: boolean;
  controller: string;
}

export interface History {
  songs: Song[],
  topPlayed: TopPlayed[]
}

export interface Player {
  state: PlayerStateType;
}

export interface QueueItem extends Keyable {
  order: number,
  singer: Singer;
  song: Song;
}

export interface Settings {
  autoadvance: boolean;
  userpick: boolean;
}

export interface Singer extends Keyable {
  name: string;
  lastLogin: string;
} 

export interface SongBase extends Keyable {
  path: string;
}

export interface Song extends SongBase {
  artist: string;
  title: string;
  count?: number;
  disabled?: boolean;
  favorite?: boolean;
  date?: string;
}

export interface DisabledSong {
  path: string;
  artist: string;
  title: string;
  disabledAt: string;
  key?: string;
}

export type PickedSong = {
  song: Song
}

export interface SongList extends Keyable {
  title: string;
  songs: SongListSong[];
}

export interface SongListSong extends Keyable {
  artist: string;
  position: number;
  title: string;
  foundSongs?: Song[];
}

export interface TopPlayed extends Keyable {
  artist: string;
  title: string;
  count: number;
}

// Firebase data structure types
export interface Controller {
  favorites: Record<string, Song>;
  history: Record<string, Song>;
  topPlayed: Record<string, TopPlayed>;
  newSongs: Record<string, Song>;
  player: {
    queue: Record<string, QueueItem>;
    settings: Settings;
    singers: Record<string, Singer>;
    state: Player;
  };
  songList: Record<string, SongList>;
  songs: Record<string, Song>;
}

// UI Component Props types
export interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

// ActionButton constants
export const ActionButtonVariant = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger'
} as const;

export const ActionButtonSize = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg'
} as const;

export const ActionButtonIconSlot = {
  START: 'start',
  END: 'end',
  ICON_ONLY: 'icon-only'
} as const;

export const ActionButtonIconSize = {
  SMALL: 18,
  MEDIUM: 20,
  LARGE: 22
} as const;

export type ActionButtonVariantType = typeof ActionButtonVariant[keyof typeof ActionButtonVariant];
export type ActionButtonSizeType = typeof ActionButtonSize[keyof typeof ActionButtonSize];
export type ActionButtonIconSlotType = typeof ActionButtonIconSlot[keyof typeof ActionButtonIconSlot];
export type ActionButtonIconSizeType = typeof ActionButtonIconSize[keyof typeof ActionButtonIconSize];

import type { IconType } from '../constants';

export interface ActionButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  variant?: ActionButtonVariantType;
  size?: ActionButtonSizeType;
  disabled?: boolean;
  className?: string;
  icon?: IconType;
  iconSlot?: ActionButtonIconSlotType;
  iconSize?: ActionButtonIconSizeType;
  fill?: 'solid' | 'outline' | 'clear';
  'aria-label'?: string;
}

export interface SongItemProps {
  song: Song;
  context: 'search' | 'queue' | 'favorites' | 'history' | 'songlists' | 'top100' | 'new';
  onDeleteItem?: () => void;
  isAdmin?: boolean;
  className?: string;
  showActions?: boolean;
  showPath?: boolean;
  showCount?: boolean;
  showInfoButton?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  showDeleteButton?: boolean;
  showFavoriteButton?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Redux state types
export interface RootState {
  controller: {
    data: Controller | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
  };
  auth: {
    data: Authentication | null;
    loading: boolean;
    error: string | null;
  };
} 

// Modal types
export { ModalType } from './modal';
export type { ModalViewType, ModalState, ModalContextType, ModalItem } from './modal';