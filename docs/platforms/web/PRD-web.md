# Web Platform Implementation Guide

> **Platform:** Web (React + Ionic + TypeScript)  
> **Core Business Logic:** See `../../PRD.md` for platform-agnostic requirements

This document contains **web-specific implementation details** for the Karaoke App. All business logic, data models, and core requirements are defined in the main PRD.

---

## Quick Reference

| Section | Purpose |
|---------|---------|
| [UI/UX Behavior](#uiux-behavior) | Web-specific UI patterns and interactions |
| [Refactored Architecture](#refactored-architecture) | Latest architecture improvements and patterns |
| [Component Architecture](#component-architecture) | React/Ionic component structure |
| [State Management](#state-management) | Redux Toolkit implementation |
| [Performance Optimizations](#performance-optimizations) | Web-specific performance strategies |
| [Development Setup](#development-setup) | Web project configuration |
| [Design Assets](#design-assets) | Web-specific visual references |
| [Toolset Choices](#toolset-choices) | Web technology rationale |

---

## Refactored Architecture

### **Overview**
The web implementation has been completely refactored to improve maintainability, performance, and developer experience. This section documents the latest architecture patterns and implementation details.

### **Key Architectural Improvements**

#### **1. Domain-Specific Redux Slices**
Replaced the monolithic `controllerSlice` with focused, domain-specific slices:

```typescript
// Before: Monolithic controllerSlice
src/redux/controllerSlice.ts (1000+ lines)

// After: Domain-specific slices
src/redux/songsSlice.ts      // Song catalog management
src/redux/queueSlice.ts      // Queue operations and state
src/redux/favoritesSlice.ts  // Favorites management
src/redux/historySlice.ts    // History tracking
```

**Benefits:**
- **Better Performance** - Smaller slices mean faster state updates
- **Easier Testing** - Isolated business logic for each domain
- **Improved Maintainability** - Clear separation of concerns
- **Reduced Bundle Size** - Only load necessary slice logic

#### **2. Composable Hooks**
Extracted common patterns into reusable, composable hooks:

```typescript
// Reusable filtering logic
useFilteredSongs(songs, searchTerm, disabledSongs)

// Generic pagination with search
usePaginatedData(data, pageSize, searchTerm)

// Centralized error handling
useErrorHandler(operation, fallbackMessage)

// Performance monitoring
usePerformanceMonitor(componentName, props)
```

**Benefits:**
- **Code Reuse** - Common patterns shared across features
- **Performance Optimized** - Each hook can be optimized independently
- **Type Safety** - Full TypeScript support with proper typing
- **Easier Testing** - Isolated business logic

#### **3. Optimized Components**
Enhanced components with performance optimizations:

```typescript
// Memoized SongItem with optimized rendering
const SongItem = React.memo<SongItemProps>(({ song, context, ...props }) => {
  const isInQueue = useMemo(() => /* expensive computation */, [queue, song.path]);
  const handleAddToQueue = useCallback(() => /* action */, [handleAddToQueue, song]);
  
  return <IonItem>...</IonItem>;
});

// Generic ListItem for any data type
const ListItem = React.memo<GenericListItemProps>(({ 
  primaryText, secondaryText, onClick, ...props 
}) => {
  return <IonItem>...</IonItem>;
});

// High-performance virtualized list
const VirtualizedList = <T,>({ 
  items, renderItem, itemHeight, ...props 
}: VirtualizedListProps<T>) => {
  // Only renders visible items
  return <div>...</div>;
};
```

**Benefits:**
- **React.memo** - Prevents unnecessary re-renders
- **Generic Components** - Reusable across different data types
- **Virtualized Rendering** - Handles large datasets efficiently
- **Performance Monitoring** - Built-in tracking capabilities

### **Implementation Patterns**

#### **State Management Pattern**
```typescript
// Domain-specific slice
export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: { /* domain-specific actions */ },
  extraReducers: (builder) => {
    builder.addCase(fetchSongs.fulfilled, (state, action) => {
      // Handle async operations
    });
  },
});

// Composable hook using the slice
export const useSongs = () => {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(selectSongs);
  
  const fetchSongs = useCallback(async () => {
    try {
      await dispatch(fetchSongsThunk());
    } catch (error) {
      // Error handling
    }
  }, [dispatch]);
  
  return { songs, fetchSongs };
};
```

#### **Component Pattern**
```typescript
// Feature component using composable hooks
const Search: React.FC = () => {
  const { songs, loading, error } = useSongs();
  const { filteredSongs, searchTerm, setSearchTerm } = useFilteredSongs(songs);
  const { paginatedData, hasMore, loadMore } = usePaginatedData(filteredSongs);
  
  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <VirtualizedList
        items={paginatedData}
        renderItem={(song) => <SongItem song={song} context="search" />}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
};
```

### **Performance Optimizations**

#### **Component-Level Optimizations**
- **React.memo** - Prevents re-renders when props haven't changed
- **useMemo** - Memoizes expensive computations
- **useCallback** - Memoizes event handlers and functions
- **Virtualized Lists** - Only renders visible items for large datasets

#### **State Management Optimizations**
- **Domain-Specific Slices** - Smaller, focused state management
- **Memoized Selectors** - Efficient state access with reselect
- **Lazy Loading** - Load components and data only when needed
- **Incremental Updates** - Target specific Firebase nodes for efficiency

#### **Data Handling Optimizations**
- **Pagination** - Load data in chunks to prevent UI blocking
- **Search Debouncing** - Reduce unnecessary API calls during typing
- **Filtering Optimization** - Efficient algorithms for large datasets
- **Memory Management** - Proper cleanup of listeners and subscriptions

### **Development Guidelines**

#### **Adding New Features**
1. **Create domain-specific slice** if needed
2. **Implement composable hooks** for business logic
3. **Build optimized components** with React.memo and useCallback
4. **Add TypeScript types** for type safety
5. **Implement error handling** using useErrorHandler

#### **Performance Best Practices**
- **Use React.memo** for expensive components
- **Implement useMemo/useCallback** for expensive operations
- **Leverage virtualized lists** for large datasets
- **Optimize Redux selectors** with memoization
- **Monitor performance** with usePerformanceMonitor

#### **Code Organization**
- **Domain-specific slices** in `/redux/`
- **Composable hooks** in `/hooks/`
- **Generic components** in `/components/common/`
- **Feature components** in `/features/`
- **TypeScript types** in `/types/`

---

## UI/UX Behavior

### **Web-Specific Requirements:**

#### **Responsive Design:**
- **Mobile-first approach** with touch-friendly interface
- **Progressive Web App (PWA)** capabilities for app-like experience
- **Responsive breakpoints** for tablet and desktop views
- **Touch gestures** for queue reordering and navigation

#### **Ionic React Components:**
- **IonApp** as root container with proper theming
- **IonRouterOutlet** for navigation between pages
- **IonList** and **IonItem** for song and queue displays
- **IonButton** with proper touch targets (44px minimum)
- **IonSearchbar** for song search with debounced input
- **IonModal** for singer selection and settings
- **IonToast** for user feedback and notifications

#### **Navigation Patterns:**
- **Tab-based navigation** for main sections (Queue, Search, History, etc.)
- **Stack navigation** for detail views (song info, artist pages)
- **Modal overlays** for quick actions (singer selection, settings)
- **Deep linking** support for direct page access

#### **Real-time Updates:**
- **Live queue updates** with visual indicators for changes
- **Playback state synchronization** across all connected devices
- **User presence indicators** showing who's currently active
- **Optimistic UI updates** with rollback on errors

---

## Codebase Organization & File Structure

### **Refactored Web Project Structure (Latest):**
```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── common/         # Shared components (SongItem, ActionButton, etc.)
│   ├── Layout/         # Layout and navigation components
│   └── Navigation/     # Navigation components
├── features/           # Feature-specific components
│   ├── Artists/        # Artist browsing feature
│   ├── Favorites/      # Favorites management
│   ├── History/        # Play history
│   ├── NewSongs/       # New songs feature
│   ├── Queue/          # Queue management
│   ├── Search/         # Song search
│   ├── Settings/       # Settings and admin features
│   ├── Singers/        # Singer management
│   ├── SongLists/      # Song lists feature
│   └── TopPlayed/      # Top played songs
├── firebase/           # Firebase configuration and services
│   ├── config.ts       # Firebase configuration
│   ├── services.ts     # Firebase service layer
│   └── useFirebase.ts  # Firebase hooks
├── hooks/              # Custom React hooks (refactored)
│   ├── useFilteredSongs.ts    # Reusable song filtering logic
│   ├── usePaginatedData.ts    # Generic pagination with search
│   ├── useErrorHandler.ts     # Centralized error handling
│   ├── usePerformanceMonitor.ts # Performance tracking
│   ├── useQueue.ts     # Queue management hooks
│   ├── useSearch.ts    # Search functionality hooks
│   ├── useFavorites.ts # Favorites management hooks
│   └── ...            # Other feature hooks
├── redux/              # State management (domain-specific slices)
│   ├── store.ts        # Redux store configuration
│   ├── songsSlice.ts   # Song catalog management
│   ├── queueSlice.ts   # Queue operations and state
│   ├── favoritesSlice.ts # Favorites management
│   ├── historySlice.ts # History tracking
│   ├── selectors.ts    # Memoized selectors
│   └── hooks.ts        # Redux hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### **Refactored Architecture Benefits:**

#### **Domain-Specific Redux Slices:**
- **Modular Design** - Each slice handles a specific domain (songs, queue, favorites, history)
- **Better Performance** - Smaller slices mean faster state updates and re-renders
- **Easier Testing** - Isolated business logic for each domain
- **Improved Maintainability** - Clear separation of concerns

#### **Composable Hooks:**
- **Reusable Logic** - Common patterns extracted into reusable hooks
- **Performance Optimized** - Each hook can be optimized independently
- **Type Safety** - Full TypeScript support with proper typing
- **Error Handling** - Centralized error management across the app

#### **Optimized Components:**
- **React.memo** - Prevents unnecessary re-renders for expensive components
- **Generic Components** - Reusable across different data types (ListItem, VirtualizedList)
- **Performance Monitoring** - Built-in performance tracking
- **Error Boundaries** - Graceful error handling and recovery

### **File Organization Rules:**
| Folder | Purpose | Key Files | Import Pattern |
|--------|---------|-----------|----------------|
| `/components` | Reusable UI components | `SongItem.tsx`, `ActionButton.tsx`, `ListItem.tsx` | `import { SongItem } from '../components/common'` |
| `/features` | Feature-specific pages | `Queue.tsx`, `Search.tsx` | `import { Queue } from '../features/Queue'` |
| `/firebase` | Firebase integration | `services.ts`, `config.ts` | `import { queueService } from '../firebase/services'` |
| `/hooks` | Composable business logic | `useFilteredSongs.ts`, `usePaginatedData.ts` | `import { useFilteredSongs } from '../hooks'` |
| `/redux` | Domain-specific state | `songsSlice.ts`, `queueSlice.ts` | `import { songsSlice } from '../redux'` |
| `/types` | TypeScript definitions | `index.ts` (extends docs/types.ts) | `import type { Song, QueueItem } from '../types'` |

### **Import Patterns:**

#### **1. Redux Imports:**
```typescript
// Always import from the main redux index
import { useAppDispatch, useAppSelector } from '../redux';
import { selectQueue, selectSongs } from '../redux';
import { setController, updateQueue } from '../redux';

// ❌ Don't import directly from slice files
// ❌ import { selectQueue } from '../redux/controllerSlice';
// ✅ Always use the main redux index
// ✅ import { selectQueue } from '../redux';
```

#### **2. Firebase Service Imports:**
```typescript
// Import services from the main services file
import { queueService, searchService } from '../firebase/services';

// ❌ Don't import directly from individual service files
// ❌ import { addToQueue } from '../firebase/queueService';
// ✅ Always use the main services file
// ✅ import { queueService } from '../firebase/services';
```

#### **3. Type Imports:**
```typescript
// Always use type imports for TypeScript interfaces
import type { Song, QueueItem, Singer } from '../types';

// ❌ Don't import types from individual files
// ❌ import { Song } from '../types/Song';
// ✅ Always use the main types index
// ✅ import type { Song } from '../types';
```

#### **4. Hook Imports:**
```typescript
// Import hooks from their specific files
import { useQueue } from '../hooks/useQueue';
import { useSearch } from '../hooks/useSearch';
import { useFavorites } from '../hooks/useFavorites';

// ❌ Don't import from a general hooks index
// ❌ import { useQueue } from '../hooks';
// ✅ Import from specific hook files
// ✅ import { useQueue } from '../hooks/useQueue';
```

#### **5. Component Imports:**
```typescript
// Import components from their specific folders
import { SongItem } from '../components/common/SongItem';
import { ActionButton } from '../components/common/ActionButton';
import { Layout } from '../components/Layout/Layout';

// ❌ Don't import from general component indices
// ❌ import { SongItem } from '../components';
// ✅ Import from specific component files
// ✅ import { SongItem } from '../components/common/SongItem';
```

### **Architecture Flow:**
```
UI Components → Custom Hooks → Redux State → Firebase Services → Firebase Database
```

### **Separation of Concerns:**
- **Components:** Only handle UI presentation and user interactions
- **Hooks:** Contain business logic and data management
- **Redux:** Manage global application state
- **Services:** Handle Firebase operations and data persistence
- **Types:** Define data structures and interfaces

## Component Architecture

### **React Component Structure:**

#### **Page Components:**
```typescript
// src/features/Queue/Queue.tsx
interface QueueProps {
  // Props interface
}

const Queue: React.FC<QueueProps> = () => {
  // Component implementation
}
```

#### **Common Components:**
```typescript
// src/components/common/SongItem.tsx
interface SongItemProps {
  song: Song;
  onAddToQueue: (song: Song) => void;
  onAddToFavorites: (song: Song) => void;
  showAddButton?: boolean;
  showFavoriteButton?: boolean;
}
```

#### **Layout Components:**
```typescript
// src/components/Layout/Layout.tsx
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}
```

### **Ionic Integration:**
- **IonPage** wrapper for all page components
- **IonHeader** with dynamic titles and action buttons
- **IonContent** with proper scrolling behavior
- **IonFooter** for player controls and queue management
- **IonLoading** for async operations and data fetching

---

## State Management

### **Redux Architecture Pattern:**
The web implementation uses Redux Toolkit for predictable state management with excellent TypeScript support.

#### **Store Structure:**
```typescript
// src/redux/store.ts
export const store = configureStore({
  reducer: {
    auth: authSlice,
    player: playerSlice,
    queue: queueSlice,
    controller: controllerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

#### **Slice Patterns:**
```typescript
// src/redux/controllerSlice.ts
const controllerSlice = createSlice({
  name: 'controller',
  initialState,
  reducers: {
    setController: (state, action) => {
      state.data = action.payload;
    },
    updateQueue: (state, action) => {
      state.data.player.queue = action.payload;
    },
  },
});
```

#### **Selectors:**
```typescript
// src/redux/selectors.ts
export const selectQueue = (state: RootState) => state.controller.data?.player?.queue || {};
export const selectQueueLength = createSelector(
  [selectQueue],
  (queue) => Object.keys(queue).length
);
```

### **Redux Toolkit Implementation:**

#### **Store Structure:**
```typescript
// src/redux/store.ts
export const store = configureStore({
  reducer: {
    auth: authSlice,
    player: playerSlice,
    queue: queueSlice,
    controller: controllerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

#### **Slice Patterns:**
```typescript
// src/redux/queueSlice.ts
const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    addToQueue: (state, action) => {
      // Implementation
    },
    removeFromQueue: (state, action) => {
      // Implementation
    },
  },
});
```

#### **Selectors:**
```typescript
// src/redux/selectors.ts
export const selectQueue = (state: RootState) => state.queue.items;
export const selectQueueLength = createSelector(
  [selectQueue],
  (queue) => queue.length
);
```

---

## Development Setup

### **Project Configuration:**

#### **Package.json Dependencies:**
```json
{
  "dependencies": {
    "@ionic/react": "^7.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.0",
    "firebase": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.0",
    "vite": "^4.0.0"
  }
}
```

#### **Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

#### **TypeScript Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### **Environment Setup:**
```bash
# .env.local
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

---

## Design Assets

### **Web-Specific Mockups:**
Located in `design/` with 30+ mockups covering all features:

#### **Core Navigation & Layout:**
- `00-web-layout.JPG` - Overall web layout structure
- `01-Login.png` - Login screen design
- `02-menu.jpeg`, `02a-menu.jpeg`, `02b-menu.png`, `02c-menu.jpeg` - Navigation menu variations

#### **Queue Management:**
- `02-queue.png` - Main queue view
- `02-queue-delete.png` - Queue with delete functionality
- `02-queue-drag.png` - Queue reordering with drag and drop
- `02-queue-sorting.png` - Queue sorting interface

#### **Search & Discovery:**
- `04-search.png` - Main search interface
- `04-search typing .png` - Search with typing interaction
- `04-search-song info.png` - Search results with song information

#### **User Management:**
- `05-singers.png` - Singer list view
- `05-singers add.png` - Singer management interface

#### **Content Browsing:**
- `06-artists .png` - Artist browse interface
- `06-artists (not admin).png` - Non-admin artist view
- `06-artists search.png` - Artist search functionality
- `06-artists songs.png` - Artist songs list

#### **User Features:**
- `07-favorites.png` - Favorites management
- `08-history.png` - Play history view
- `09-songs list.png` - Main song lists view
- `09-song lists - songs.png` - Song lists with song details
- `09- song lists songs expand.png` - Song lists with expandable sections

#### **Admin Features:**
- `10-Settings.png` - Settings interface
- `11-top 100.png` - Top played songs
- `12-favorites .png` - Favorites view
- `12-favorite lists.png` - Favorite lists management

#### **Menu States:**
- `03-menu.png` - General menu layout
- `03-menu current page and non-admin.png` - Navigation with current page indicators
- `03-menu playing (admin).png` - Admin view during playback

### **Design System:**
- **Ionic Design System** for consistent UI components
- **Custom CSS variables** for theming and branding
- **Responsive grid system** for layout consistency
- **Touch-friendly spacing** and sizing guidelines

---

## Toolset Choices

### **Current Web Implementation Toolset:**

#### **Core Framework: React 18 + TypeScript**
- **Why:** Chosen for its component-based architecture, strong ecosystem, and excellent TypeScript support
- **Migration Note:** Can be replaced with any other component-based framework (e.g., Vue, Svelte)

#### **State Management: Redux Toolkit**
- **Why:** Provides predictable state management with excellent TypeScript support and dev tools
- **Migration Note:** Can be replaced with Context API, Zustand, or other state management solutions

#### **UI Framework: Ionic React**
- **Why:** Provides mobile-first UI components with excellent touch support and PWA capabilities
- **Migration Note:** Can be replaced with Material-UI, Chakra UI, or custom components

#### **Build Tool: Vite**
- **Why:** Fast development server and optimized builds with excellent TypeScript support
- **Migration Note:** Can be replaced with Webpack, Parcel, or other build tools

#### **Backend: Firebase Realtime Database**
- **Why:** Real-time synchronization, simple setup, and excellent React integration
- **Migration Note:** Can be replaced with any real-time database (Supabase, AWS AppSync, etc.)

### **Development Tools:**
- **TypeScript:** Type safety and better developer experience
- **ESLint:** Code quality and consistency
- **Prettier:** Code formatting
- **React DevTools:** Component debugging
- **Redux DevTools:** State management debugging

---

## Web-Specific Implementation Details

### **Authentication & Session Management:**
- **Admin Access:** Triggered by URL parameter (`?admin=true`), removed after login
- **Session Persistence:** Lost on browser reload (no persistent storage)
- **Admin Mode:** Pre-fills singer name as "Admin" for convenience
- **URL Handling:** Admin parameter automatically removed from URL after authentication

### **Search Implementation:**
- **Pagination:** Uses Ionic InfiniteScrollList component for efficient loading
- **Debouncing:** Search input debounced to prevent excessive API calls
- **Real-time Results:** Instant search results as user types
- **Context Actions:** Add to queue, favorite, and other actions available per song

### **Queue Management:**
- **UI Controls:** Reordering and deletion exposed via UI controls only visible to admins
- **Drag & Drop:** Uses Ionic drag handles and swipe actions for reordering
- **Visual Feedback:** Clear indicators for admin-only actions
- **State Synchronization:** Real-time updates across all connected clients

### **Favorites Implementation:**
- **Infinite Scroll:** Uses Ionic InfiniteScrollList for pagination
- **Real-time Sync:** Shared favorites list synchronized across all clients
- **Duplicate Prevention:** Prevents duplicates using song path field
- **User Actions:** Anyone can add/remove favorites

### **New Songs Implementation:**
- **Infinite Scroll:** Uses Ionic InfiniteScrollList for pagination
- **Real-time Updates:** Shows recently added songs from newSongs node
- **Automatic Loading:** Progressive loading as user scrolls

### **Artists Implementation:**
- **Modal Views:** Uses Ionic modals for artist song lists
- **Infinite Scroll:** Uses Ionic InfiniteScrollList for pagination
- **Search Integration:** Artist search functionality included
- **Song Counts:** Displays song count per artist

### **Song Lists Implementation:**
- **Modal Interface:** Uses Ionic modals for viewing list contents
- **Infinite Scroll:** Uses Ionic InfiniteScrollList for pagination
- **Expandable Views:** Available versions shown with expandable sections
- **Availability Status:** Shows which songs are available in catalog

### **History Implementation:**
- **Infinite Scroll:** Uses Ionic InfiniteScrollList for pagination
- **Automatic Tracking:** Songs automatically added when played
- **Timestamp Display:** Shows when each song was last played
- **Append-only:** History is append-only, shared across all clients

### **Top Played Implementation:**
- **Infinite Scroll:** Uses Ionic InfiniteScrollList for pagination
- **Play Count Display:** Shows play count for each song
- **Real-time Updates:** Popular songs generated by backend
- **Backend Integration:** Based on history data

### **Singer Management:**
- **Admin-only UI:** Singer management available only to admins via settings page
- **Unique Names:** Singer names must be unique and non-empty
- **Auto-addition:** Singers automatically added when they join
- **Last Join Tracking:** Tracks when each singer last joined

### **Playback Control:**
- **Admin-only Controls:** Player controls only rendered for admins
- **State-based UI:** Play/pause/stop buttons shown/hidden based on current state
- **Queue Validation:** Play button disabled when queue is empty
- **Real-time Sync:** Playback state synchronized across all clients

### **Error Handling & Sync:**
- **Toast Notifications:** Uses web-specific toast notifications for user feedback
- **Error Boundaries:** React error boundaries for component-level error handling
- **Retry Patterns:** Automatic retry for failed Firebase operations
- **Connection Monitoring:** Real-time connection status tracking

### **Disabled Songs:**
- **Modal Management:** Disabled songs managed via modal dialog
- **Search & Filter:** Search and filter capabilities in management interface
- **Hash Storage:** Disabled songs stored using hash of song path
- **Admin-only Access:** Only admins can disable or enable songs

### **Settings Implementation:**
- **Debug Logging:** Web-only feature, toggled via settings page
- **Admin-only Access:** Only admins can change player settings
- **Real-time Updates:** Settings changes synchronized across all clients
- **UI Controls:** Settings interface with toggle switches and controls

### **Navigation Implementation:**
- **Admin-based Navigation:** Navigation adapts based on admin status
- **Hidden Pages:** Settings page only visible to admins
- **Role-based UI:** Different navigation options for different user roles
- **Dynamic Menus:** Menu items shown/hidden based on permissions

### **UI/UX Implementation:**
- **Ionic React:** Uses Ionic React and Tailwind CSS for UI
- **Component Library:** Infinite scroll, swipe actions, modals, and toasts using Ionic components
- **Responsive Design:** Mobile-first approach with touch-friendly interface
- **Theme Support:** Light/dark mode support with consistent styling

## Implementation Notes

### **Critical Web-Specific Patterns:**

#### **Firebase Integration:**
```typescript
// src/firebase/services.ts
export const queueService = {
  addToQueue: async (song: Song, singerId: string) => {
    const newKey = await getNextKey('queue');
    await set(ref(database, `queue/${newKey}`), {
      songId: song.id,
      singerId,
      timestamp: Date.now(),
      key: newKey,
    });
  },
};
```

#### **Real-time Listeners:**
```typescript
// src/hooks/useQueue.ts
useEffect(() => {
  const queueRef = ref(database, 'queue');
  const unsubscribe = onValue(queueRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const queueItems = Object.values(data) as QueueItem[];
      dispatch(setQueue(queueItems));
    }
  });
  return () => unsubscribe();
}, [dispatch]);
```

#### **Error Handling:**
```typescript
// src/hooks/useFirebaseSync.ts
const retryOperation = async (operation: () => Promise<void>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await operation();
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### **Hook Implementation Patterns:**

#### **Custom Hook Structure:**
```typescript
// src/hooks/useQueue.ts
export const useQueue = () => {
  const dispatch = useAppDispatch();
  const queue = useAppSelector(selectQueue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToQueue = useCallback(async (song: Song, singerId: string) => {
    try {
      setLoading(true);
      setError(null);
      await queueService.addToQueue(song, singerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to queue');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    queue,
    loading,
    error,
    addToQueue,
  };
};
```

#### **Hook Dependencies:**
- **Hooks depend on Redux state** and services
- **Business logic** implemented in hooks, not components
- **Error handling** and loading states managed in hooks
- **Memoization** used for expensive operations

#### **Hook Usage in Components:**
```typescript
// src/features/Queue/Queue.tsx
const Queue: React.FC = () => {
  const { queue, loading, error, addToQueue } = useQueue();
  const { songs } = useSongs();

  const handleAddToQueue = useCallback((song: Song) => {
    addToQueue(song, currentSingerId);
  }, [addToQueue, currentSingerId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <IonList>
      {Object.values(queue).map((item) => (
        <SongItem
          key={item.key}
          song={songs[item.songId]}
          onAddToQueue={handleAddToQueue}
        />
      ))}
    </IonList>
  );
};
```

### **Performance Optimizations:**

#### **Component-Level Optimizations:**
- **React.memo** - Prevents unnecessary re-renders for expensive components like `SongItem`
- **useMemo/useCallback** - Memoizes expensive computations and event handlers
- **Virtualized Lists** - `VirtualizedList` component renders only visible items for large datasets
- **Generic Components** - `ListItem` component works with any data type for reusability

#### **State Management Optimizations:**
- **Domain-Specific Slices** - Smaller, focused Redux slices (songs, queue, favorites, history)
- **Composable Hooks** - Reusable logic (`useFilteredSongs`, `usePaginatedData`, `useErrorHandler`)
- **Optimized Selectors** - Memoized Redux selectors for efficient state access
- **Lazy Loading** - Components and data loaded only when needed

#### **Data Handling Optimizations:**
- **Pagination** - `usePaginatedData` hook loads data in chunks to prevent UI blocking
- **Search Debouncing** - Reduces unnecessary API calls during typing
- **Filtering Optimization** - `useFilteredSongs` hook provides efficient filtering algorithms
- **Memory Management** - Proper cleanup of listeners and subscriptions

#### **Performance Monitoring:**
- **Built-in Performance Hooks** - `usePerformanceMonitor` tracks component render times
- **Error Tracking** - Centralized error handling with performance impact monitoring
- **Bundle Analysis** - Optimized bundle size with code splitting

#### **Specific Optimizations:**
- **SongItem Component** - Fully memoized with React.memo, useMemo, and useCallback
- **ListItem Component** - Generic component supporting multiple data types
- **VirtualizedList Component** - High-performance list rendering with windowing
- **ActionButton Component** - Reusable buttons with consistent styling and behavior

### **Refactoring Benefits & Migration Notes:**

#### **Architecture Improvements:**
- **Modular Redux Slices** - Replaced monolithic `controllerSlice` with domain-specific slices
- **Composable Hooks** - Extracted common patterns into reusable hooks
- **Performance Optimizations** - Added React.memo, useMemo, useCallback throughout
- **Type Safety** - Enhanced TypeScript support with strict typing

#### **Component Enhancements:**
- **Generic ListItem** - Replaced song-specific component with generic, reusable component
- **VirtualizedList** - Added high-performance list rendering for large datasets
- **Performance Monitoring** - Built-in performance tracking with `usePerformanceMonitor`
- **Error Boundaries** - Centralized error handling across the application

#### **Development Experience:**
- **Better Maintainability** - Clear separation of concerns with domain-specific slices
- **Easier Testing** - Isolated business logic for each domain
- **Improved Performance** - Optimized rendering and state management
- **Enhanced Type Safety** - Full TypeScript coverage with proper typing

### **Critical Implementation Rules:**
- **Never import directly from slice files** - always use the main redux index
- **Always use type imports** for TypeScript interfaces
- **Implement business logic in hooks**, not components
- **Use memoization** for expensive operations
- **Handle loading and error states** in all async operations
- **Use React.memo** for performance-critical components
- **Leverage composable hooks** for reusable business logic

---

## Migration Guide

### **To Other Web Frameworks:**

#### **Vue.js Migration:**
- Replace React components with Vue components
- Replace Redux with Pinia or Vuex
- Replace Ionic React with Ionic Vue
- Keep all business logic and Firebase integration

#### **Svelte Migration:**
- Replace React components with Svelte components
- Replace Redux with Svelte stores
- Replace Ionic React with Ionic Svelte
- Keep all business logic and Firebase integration

### **To Mobile Platforms:**

#### **React Native Migration:**
- Replace Ionic components with React Native components
- Replace web-specific APIs with React Native APIs
- Keep Redux state management
- Keep all business logic and Firebase integration

#### **Native iOS/Android Migration:**
- Replace React components with native UI components
- Replace Redux with native state management
- Keep all business logic and Firebase integration
- Adapt UI patterns to platform conventions

---

_This document contains web-specific implementation details. For core business logic and platform-agnostic requirements, see the main `../../PRD.md`._ 