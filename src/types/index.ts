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

export interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface SongItemProps {
  song: Song;
  context: 'search' | 'queue' | 'history' | 'favorites' | 'topPlayed';
  onAddToQueue?: () => void;
  onRemoveFromQueue?: () => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
  className?: string;
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