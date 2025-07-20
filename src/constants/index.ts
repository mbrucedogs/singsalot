// App constants
export const APP_NAME = '🎤 Karaoke App';
export const APP_VERSION = '1.0.0';
export const CONTROLLER_NAME = import.meta.env.VITE_CONTROLLER_NAME || 'default';

// Firebase configuration
export const FIREBASE_CONFIG = {
  // These will be replaced with environment variables
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project-id.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://your-project-id-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project-id.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
};

// UI constants
export const UI_CONSTANTS = {
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    INFO: 3000,
  },
  SEARCH: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2,
  },
  QUEUE: {
    MAX_ITEMS: 100,
  },
  HISTORY: {
    MAX_ITEMS: 50,
  },
  TOP_PLAYED: {
    MAX_ITEMS: 20,
  },
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  SEARCH: '/',
  QUEUE: '/queue',
  HISTORY: '/history',
  TOP_PLAYED: '/top-played',
} as const;

// Player states
export const PLAYER_STATES = {
  PLAYING: 'Playing',
  PAUSED: 'Paused',
  STOPPED: 'Stopped',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  CONTROLLER_NOT_FOUND: 'Controller not found',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SONG_NOT_FOUND: 'Song not found',
  QUEUE_FULL: 'Queue is full',
  FIREBASE_ERROR: 'Firebase operation failed',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SONG_ADDED_TO_QUEUE: 'Song added to queue',
  SONG_REMOVED_FROM_QUEUE: 'Song removed from queue',
  SONG_ADDED_TO_FAVORITES: 'Song added to favorites',
  SONG_REMOVED_FROM_FAVORITES: 'Song removed from favorites',
  QUEUE_REORDERED: 'Queue reordered',
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_SEARCH: true,
  ENABLE_QUEUE_REORDER: true,
  ENABLE_FAVORITES: true,
  ENABLE_HISTORY: true,
  ENABLE_TOP_PLAYED: true,
  ENABLE_ADMIN_CONTROLS: true,
} as const;

import { 
  add, 
  trash, 
  close, 
  ban, 
  checkmark,
  searchOutline,
  musicalNotesOutline,
  peopleCircleOutline,
  peopleOutline,
  starOutline,
  heart,
  heartOutline,
  timeOutline,
  listOutline,
  settingsOutline,
  play,
  playOutline,
  pause,
  pauseOutline,
  stop,
  stopOutline,
  reorderThreeOutline,
  reorderTwoOutline,
  informationCircle,
  logOut,
  micOutline,
  time,
  list
} from 'ionicons/icons';

// Icon constants for better type safety and autocomplete
export const Icons = {
  // Action icons
  ADD: add,
  TRASH: trash,
  CLOSE: close,
  BAN: ban,
  CHECKMARK: checkmark,
  
  // Navigation icons
  SEARCH: searchOutline,
  MUSIC_NOTES: musicalNotesOutline,
  PEOPLE: peopleCircleOutline,
  PEOPLE_OUTLINE: peopleOutline,
  STAR: starOutline,
  HEART: heart,
  HEART_OUTLINE: heartOutline,
  TIME: timeOutline,
  LIST: listOutline,
  SETTINGS: settingsOutline,
  
  // Player controls
  PLAY: play,
  PLAY_OUTLINE: playOutline,
  PAUSE: pause,
  PAUSE_OUTLINE: pauseOutline,
  STOP: stop,
  STOP_OUTLINE: stopOutline,
  
  // UI icons
  REORDER_THREE: reorderThreeOutline,
  REORDER_TWO: reorderTwoOutline,
  INFORMATION_CIRCLE: informationCircle,
  LOGOUT: logOut,
  MIC: micOutline,
  
  // Status icons
  TIME_SIMPLE: time,
  LIST_SIMPLE: list
} as const;

export type IconType = typeof Icons[keyof typeof Icons]; 