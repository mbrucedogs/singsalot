# 🎤 Karaoke App — Product Requirements Document (PRD)

---

> **Note:** This PRD is structured for platform-agnostic use. Each feature is described with platform-independent requirements, followed by a 'Web Implementation Details' section for web-specific behaviors. For future platforms (iOS, Android, etc.), add corresponding implementation details under each feature. This ensures the PRD can be used as the single source of truth for any platform.

---

## 1️⃣ Purpose

This document defines the functional, technical, and UX requirements for the Karaoke App, designed for **in-home party use**. The app leverages **Firebase Realtime Database** for real-time synchronization, with all business logic and validation handled **client-side**.

---

## 2️⃣ Scope & Business Objectives

- Deliver a single-session karaoke experience where users connect to a controller and manage/search songs.
- Use Firebase for real-time multi-user sync of queues, history, and playback state.
- Prioritize fast performance, reusable modular architecture, and clear business logic separation.
- Enable adding songs from multiple entry points (search, history, top played, favorites, new songs, artists, song lists).
- Ensure graceful handling of Firebase sync issues using retry patterns and partial node updates.
- True Separation of Concerns - UI components only handle presentation
- Reusable Business Logic - Hooks can be used across components
- Testable Code - Business logic separated from UI
- Maintainable - Changes to logic don't affect UI
- Performance - Memoized selectors and optimized hooks
- Type Safety - Full TypeScript coverage throughout
- The codebase needs to follow the Single Responsibility Principle perfectly - each file has one clear purpose!

---

## 3️⃣ User Roles & Permissions

**Requirements (Platform-Agnostic):**
- Two roles: Host/Admin and Singer/User.
- Only admins can reorder or delete queue items, control playback, and manage singers.
- Admin access is a privileged mode (see platform details for how it's triggered).
- First queue item cannot be deleted while playing (only when stopped/paused).
- Singers are automatically added to the singers list when they join.

**Web Implementation Details:**
- Admin access is triggered by a URL parameter (`?admin=true`) and removed from the URL after login.
- Session is lost on browser reload.

---

## 4️⃣ Feature Overview

### Authentication & Session Management
**Requirements (Platform-Agnostic):**
- Login requires both Party ID and singer name.
- Party ID is validated against the backend before login is allowed.
- Authentication state is managed in the app state and lost on app reload (unless platform supports persistence).

**Web Implementation Details:**
- Admin access via URL parameter (`?admin=true`), removed after login.
- Session is lost on browser reload.

### Search
**Requirements (Platform-Agnostic):**
- Local search on preloaded song catalog.
- Instant search results as user types.
- Paginated/infinite scroll results.
- Context actions for each song (add to queue, favorite, etc).

**Web Implementation Details:**
- Uses Ionic InfiniteScrollList for pagination.

### Queue Management
**Requirements (Platform-Agnostic):**
- Shared queue synchronized across all clients.
- Queue items must always use sequential numerical keys (0, 1, 2, ...).
- The system must automatically fix any inconsistencies in order values or keys on every update.
- Queue reordering must be atomic; when two items are swapped, both order values are updated in a single operation.
- Only admins can reorder or delete queue items, and only when playback is stopped or paused.
- Duplicate songs are prevented in the queue by checking the song’s `path`.
- Each queue item shows which singer added it.

**Web Implementation Details:**
- Queue reordering and deletion are exposed via UI controls only visible to admins.
- UI uses drag handles and swipe actions (Ionic components) for reordering and deletion.

### Favorites
**Requirements (Platform-Agnostic):**
- Shared favorites list synchronized across all clients.
- Anyone can add/remove favorites.
- Duplicate prevention by song `path`.
- Paginated/infinite scroll display.

**Web Implementation Details:**
- Uses Ionic InfiniteScrollList for pagination.

### New Songs
**Requirements (Platform-Agnostic):**
- Shows recently added songs from the `newSongs` node.
- Real-time updates and infinite scroll.

**Web Implementation Details:**
- Uses Ionic InfiniteScrollList for pagination.

### Artists
**Requirements (Platform-Agnostic):**
- Browse songs by artist with search functionality.
- Modal view for all songs by an artist.
- Song count per artist.
- Paginated/infinite scroll artist list.

**Web Implementation Details:**
- Uses Ionic modals and InfiniteScrollList.

### Song Lists
**Requirements (Platform-Agnostic):**
- Predefined song lists with themes/collections.
- Song matching to catalog.
- Expandable view for available versions.
- Modal interface for viewing list contents.
- Shows which songs are available in the catalog.

**Web Implementation Details:**
- Uses Ionic modals and InfiniteScrollList.

### History Tracking
**Requirements (Platform-Agnostic):**
- Songs automatically added to history when played.
- Shows when each song was last played.
- Append-only, shared across all clients.
- Paginated/infinite scroll display.

**Web Implementation Details:**
- Uses Ionic InfiniteScrollList for pagination.

### Top Played
**Requirements (Platform-Agnostic):**
- Popular songs generated by backend based on history.
- Shows play count for each song.
- Real-time updates and infinite scroll.

**Web Implementation Details:**
- Uses Ionic InfiniteScrollList for pagination.

### Singer Management
**Requirements (Platform-Agnostic):**
- Only admins can add or remove singers.
- Singer names must be unique and non-empty.
- Singers are automatically added to the list when they join.
- All users can view the current singers list.
- Tracks when each singer last joined.

**Web Implementation Details:**
- Singer management UI is available only to admins via the settings page.

### Playback Control
**Requirements (Platform-Agnostic):**
- Only admins can control playback (play, pause, stop).
- Play button is disabled if the queue is empty.
- UI state (play/pause/stop) must reflect the current player state.

**Web Implementation Details:**
- Player controls are only rendered for admins.
- State-based UI: play/pause/stop buttons shown/hidden based on current state.

### Error Handling & Sync
**Requirements (Platform-Agnostic):**
- Graceful handling of sync failures with retry patterns.
- Full controller object loaded on initial connection.
- Incremental updates target specific child nodes.
- Real-time connection status monitoring.
- Graceful handling of missing or empty data.

**Web Implementation Details:**
- Uses web-specific toast notifications and error boundaries.

### Disabled Songs
**Requirements (Platform-Agnostic):**
- Admins can disable or enable songs.
- Disabled songs are stored using a hash of the song path for key safety.

**Web Implementation Details:**
- Disabled songs are managed via a modal dialog with search and filter capabilities.

### Settings
**Requirements (Platform-Agnostic):**
- Only admins can change player settings (autoadvance, userpick).

**Web Implementation Details:**
- Debug logging is a web-only feature, toggled via the settings page.

### Navigation
**Requirements (Platform-Agnostic):**
- Admin-only pages (e.g., settings) must be hidden from non-admin users.

**Web Implementation Details:**
- Navigation adapts based on admin status; settings page is only visible to admins.

### UI/UX & Platform-Specifics
**Requirements (Platform-Agnostic):**
- All business logic, validation, and permissions must be enforced at the application level, not just in the UI.

**Web Implementation Details:**
- The web implementation uses Ionic React and Tailwind CSS for UI.
- Features like infinite scroll, swipe actions, modals, and toasts are implemented using Ionic components.
- Session persistence, URL parameter handling, and debug logging are web-specific.

---

## 5️⃣ Data Models

Data models are defined externally in:
> [`types.ts`](./types.ts)

This file contains TypeScript interfaces describing:
- `Song` — Core song data with artist, title, path, and metadata
- `QueueItem` — Queue entries with order, singer, and song data
- `Singer` — User information with name and last login
- `SongList` — Predefined song collections with metadata
- `SongListSong` — Individual songs within a song list
- `TopPlayed` — Popular songs with play count
- `Controller` — Main object containing all app data
- `PlayerState` — Playback status enum (Playing, Paused, Stopped)
- `Authentication` — User session data with admin status
- `Settings` — Player settings (autoadvance, userpick)

**Key Data Relationships:**
- Songs are identified by their `path` field for duplicate prevention
- Queue items have sequential `order` values for proper ordering
- All data is stored as Firebase records with string keys
- History tracks play dates and counts for each song

---

## 6️⃣ Firebase Realtime Database Structure

Defined externally in:
> [`firebase_schema.json`](./firebase_schema.json)

**Complete Structure:**
```json
controllers: {
  [controllerName]: {
    favorites: Record<string, Song>,
    history: Record<string, Song>,
    topPlayed: Record<string, TopPlayed>,
    newSongs: Record<string, Song>,
    player: { 
      queue: Record<string, QueueItem>,
      settings: Settings,
      singers: Record<string, Singer>,
      state: Player
    },
    songList: Record<string, SongList>,
    songs: Record<string, Song>
  }
}
```

**Data Flow:**
- **Initial Sync:** Loads the complete `controller` object on connection
- **Real-time Updates:** Subscribes to specific nodes for incremental updates
- **Key Management:** Uses sequential numerical keys for queue items
- **Auto-initialization:** Creates empty controller structure if none exists

---

## 7️⃣ UI/UX Behavior

**Requirements (Platform-Agnostic):**
- Responsive design that works on all device sizes.
- Support for light/dark mode themes.
- Modern, clean, intuitive interface with consistent styling.
- Accessibility support (keyboard navigation, screen readers).
- Tab-based navigation with clear active states.
- Consistent empty state views for all lists.
- Loading states with spinner animations.
- Toast notifications for success/error feedback.
- Consistent button styling with variants.
- Reusable song display with context-aware actions.
- Infinite scroll for automatic loading of additional content.
- Context-specific behavior for different screens (search, queue, history, etc.).
- Admin-specific UI elements (playback controls, queue reorder, singer management).

**Web Implementation Details:**
- Uses Ionic React components for responsive design and accessibility.
- Horizontal navigation bar with icons.
- Toast notifications positioned at top-right corner.
- Modal views for artist songs and song lists.
- Drag handles and swipe actions for queue management.

---

## 8️⃣ UI Rules & Constraints

**Requirements (Platform-Agnostic):**

### **Queue Management Rules:**
- Only admin users can reorder queue items.
- First queue item cannot be deleted while playing (only when stopped/paused).
- Reorder constraints: items not at top/bottom can move up/down.
- Queue items must maintain sequential order (1, 2, 3, etc.).
- Automatic cleanup of inconsistent order values on queue initialization.
- Queue items use sequential numerical keys (0, 1, 2, etc.).

### **Playback Control Rules:**
- Player controls only visible to admin users.
- Play button is disabled when queue is empty.
- State-based controls: play/pause/stop buttons shown/hidden based on current state.
- Current player state must be clearly displayed.

### **Search Rules:**
- Search only activates after 2+ characters.
- Debounce delay before search execution.
- Search scope includes both song title and artist fields (case-insensitive).
- Empty search shows all songs.
- Search resets to page 1 when search term changes.

### **Pagination & Infinite Scroll Rules:**
- 20 items loaded per page.
- Load more logic only shows when there are more items than currently displayed.
- Triggers load more when user scrolls to bottom 10% of list.
- Each feature maintains its own page state independently.
- All lists must use pagination to prevent UI blocking.
- Progressive loading of items as user scrolls.
- Loading state management with spinner when no items are loaded yet.
- Page reset on search term changes.
- Memory optimization for smooth scrolling.
- Error handling for load more failures.
- Accessibility support for infinite scroll.

### **Toast Notification Rules:**
- Duration settings: Success/Info 3 seconds, Error 5 seconds.
- Auto-dismiss after duration.
- Manual dismiss option.
- Multiple toasts can be displayed simultaneously.

### **Authentication Rules:**
- Admin access is a privileged mode (see platform details for implementation).
- Session persistence behavior varies by platform.
- Both Party ID and singer name required for login.

### **Data Display Rules:**
- Loading states with spinner when data count is 0.
- Empty states when data exists but filtered results are empty.
- Debug information display for development.
- User attribution indicators for current user's queue items.
- Availability status for unmatched song list items.

### **Action Button Rules:**
- Context-based actions for different screens.
- Permission-based visibility based on user role.
- State-based disabling of buttons.
- Confirmation feedback for all actions.

### **Modal & Overlay Rules:**
- Modal views for artist songs and song lists.
- Proper backdrop and close actions.

**Web Implementation Details:**
- Admin access via URL parameter (`?admin=true`), removed after authentication.
- Session lost on page reload.
- Uses Ionic InfiniteScrollList component for pagination.
- Toast notifications positioned at top-right corner with z-index 50.
- Modals use high z-index (9999) with semi-transparent backdrop.
- Admin mode pre-fills singer name as "Admin".
- Intersection Observer API for infinite scroll detection.
- Debug information display for development builds.

### **Error Handling Rules:**
- **Error Boundaries:** React error boundaries catch component-level errors
- **Graceful Degradation:** App continues to work with cached data during connection issues
- **User Feedback:** Clear error messages with recovery options
- **Retry Logic:** Automatic retry for failed Firebase operations
- **Fallback Values:** Default values provided for missing or corrupted data

### **Performance Rules:**
- **Memoization:** Expensive operations memoized with `useMemo` and `useCallback`
- **Debouncing:** Search input debounced to prevent excessive API calls
- **Incremental Loading:** Large datasets loaded in chunks via infinite scroll
- **Optimistic Updates:** UI updates immediately, with rollback on error
- **Connection Monitoring:** Real-time connection status tracking

### **Data Validation Rules:**
- **Type Safety:** All data validated against TypeScript interfaces
- **Required Fields:** Critical fields (controller name, singer name) validated before operations
- **Duplicate Prevention:** Songs identified by `path` field for duplicate checking
- **Order Validation:** Queue order automatically fixed if inconsistencies detected
- **Key Cleanup:** Inconsistent Firebase keys automatically migrated to sequential format

### **Feature Flag Rules:**
- **Configurable Features:** Features can be enabled/disabled via constants:
  - `ENABLE_SEARCH: true`
  - `ENABLE_QUEUE_REORDER: true`
  - `ENABLE_FAVORITES: true`
  - `ENABLE_HISTORY: true`
  - `ENABLE_TOP_PLAYED: true`
  - `ENABLE_ADMIN_CONTROLS: true`

### **Constants & Limits:**
- **Queue Limits:** Maximum 100 items (`MAX_ITEMS: 100`)
- **History Limits:** Maximum 50 items (`MAX_ITEMS: 50`)
- **Top Played Limits:** Maximum 20 items (`MAX_ITEMS: 20`)
- **Search Limits:** Minimum 2 characters, 300ms debounce
- **Toast Limits:** Success/Info 3s, Error 5s duration

---

## 9️⃣ Codebase Organization & File Structure

### **Folder Structure & Purpose:**

| Folder | Purpose | Key Files | Import Pattern |
|--------|---------|-----------|----------------|
| `/components/common` | Shared UI components | `ActionButton.tsx`, `EmptyState.tsx`, `SongItem.tsx`, `InfiniteScrollList.tsx` | `import { ComponentName } from '../components/common'` |
| `/components/Auth` | Authentication components | `AuthInitializer.tsx`, `LoginPrompt.tsx` | `import { AuthInitializer } from '../components/Auth'` |
| `/components/Layout` | Layout and navigation | `Layout.tsx`, `Navigation.tsx` | `import Layout from '../components/Layout/Layout'` |
| `/features` | Feature-specific components | `Search.tsx`, `Queue.tsx`, `History.tsx`, `Artists.tsx`, `SongLists.tsx` | `import { Search, Queue } from '../features'` |
| `/hooks` | Business logic hooks | `useQueue.ts`, `useSearch.ts`, `useSongOperations.ts` | `import { useQueue, useSearch } from '../hooks'` |
| `/redux` | State management | `controllerSlice.ts`, `authSlice.ts`, `selectors.ts` | `import { useAppDispatch, selectQueue } from '../redux'` |
| `/firebase` | Firebase services | `services.ts`, `FirebaseProvider.tsx` | `import { queueService } from '../firebase/services'` |
| `/types` | TypeScript definitions | `index.ts` (extends docs/types.ts) | `import type { Song, QueueItem } from '../types'` |
| `/utils` | Utility functions | `dataProcessing.ts` | `import { filterSongs } from '../utils/dataProcessing'` |
| `/constants` | App constants | `index.ts` | `import { UI_CONSTANTS } from '../constants'` |

### **Index File Pattern:**
Each folder uses an `index.ts` file to export all public APIs:

```typescript
// src/hooks/index.ts
export { useFirebaseSync } from './useFirebaseSync';
export { useSongOperations } from './useSongOperations';
export { useToast } from './useToast';
export { useSearch } from './useSearch';
export { useQueue } from './useQueue';
// ... all other hooks

// src/components/common/index.ts
export { default as ActionButton } from './ActionButton';
export { default as EmptyState } from './EmptyState';
export { default as Toast } from './Toast';
// ... all other components

// src/features/index.ts
export { default as Search } from './Search/Search';
export { default as Queue } from './Queue/Queue';
export { default as History } from './History/History';
// ... all other features
```

### **Import Organization Patterns:**

#### **1. Redux Imports:**
```typescript
// Always import from the main redux index
import { useAppDispatch, useAppSelector } from '../redux';
import { selectQueue, selectSongs } from '../redux';
import { setController, updateQueue } from '../redux';

// Never import directly from slice files
// ❌ import { selectQueue } from '../redux/controllerSlice';
// ✅ import { selectQueue } from '../redux';
```

#### **2. Hook Imports:**
```typescript
// Import hooks from the main hooks index
import { useQueue, useSearch, useSongOperations } from '../hooks';

// Import specific hooks when needed
import { useToast } from '../hooks/useToast';
```

#### **3. Component Imports:**
```typescript
// Import from feature index for feature components
import { Search, Queue, History } from '../features';

// Import from common index for shared components
import { ActionButton, EmptyState, SongItem } from '../components/common';

// Import layout components directly
import Layout from '../components/Layout/Layout';
```

#### **4. Type Imports:**
```typescript
// Always use type imports for TypeScript interfaces
import type { Song, QueueItem } from '../types';

// Import specific types when needed
import type { RootState } from '../types';
```

#### **5. Service Imports:**
```typescript
// Import Firebase services directly
import { queueService, favoritesService } from '../firebase/services';

// Import Firebase configuration
import { database } from '../firebase/config';
```

#### **6. Utility Imports:**
```typescript
// Import utility functions directly
import { filterSongs, objectToArray } from '../utils/dataProcessing';
```

#### **7. Constant Imports:**
```typescript
// Import constants from the main constants index
import { UI_CONSTANTS, FEATURES } from '../constants';
```

### **File Organization Principles:**

#### **Single Responsibility Principle:**
- **Each file has one clear purpose**
- **Hooks handle business logic only**
- **Components handle UI rendering only**
- **Services handle external API calls only**
- **Types define data structures only**

#### **Separation of Concerns:**
- **UI Components:** Only handle presentation and user interaction
- **Business Logic:** Extracted into custom hooks
- **State Management:** Centralized in Redux slices
- **Data Access:** Abstracted in Firebase services
- **Type Definitions:** Centralized in types folder

#### **Dependency Direction:**
```
Components → Hooks → Redux → Services → Firebase
     ↓         ↓       ↓        ↓         ↓
   Types ← Types ← Types ← Types ← Types
```

### **Redux Architecture Pattern:**

#### **Slice Organization:**
```typescript
// src/redux/controllerSlice.ts
export const controllerSlice = createSlice({
  name: 'controller',
  initialState,
  reducers: {
    setController: (state, action) => { /* ... */ },
    updateQueue: (state, action) => { /* ... */ },
    // ... other reducers
  },
});

// Export actions and selectors
export const { setController, updateQueue } = controllerSlice.actions;
export const selectController = (state: RootState) => state.controller.data;
```

#### **Selector Pattern:**
```typescript
// src/redux/selectors.ts
export const selectSongsArray = createSelector(
  [selectSongs],
  (songs) => sortSongsByArtistAndTitle(objectToArray(songs))
);

export const selectQueueWithUserInfo = createSelector(
  [selectQueue, selectCurrentSinger],
  (queue, currentSinger) => addUserInfoToQueue(queue, currentSinger)
);
```

#### **Hook Integration:**
```typescript
// src/hooks/useQueue.ts
export const useQueue = () => {
  const queueItems = useAppSelector(selectQueueWithUserInfo);
  const dispatch = useAppDispatch();
  
  const handleRemoveFromQueue = useCallback(async (queueItemKey: string) => {
    try {
      await queueService.removeFromQueue(controllerName, queueItemKey);
    } catch (error) {
      showError('Failed to remove song from queue');
    }
  }, [controllerName, showError]);

  return { queueItems, handleRemoveFromQueue };
};
```

### **Hook Architecture Pattern:**

#### **Hook Composition:**
```typescript
// Base operations hook
export const useSongOperations = () => {
  // Common song operations (add to queue, toggle favorite)
};

// Feature-specific hooks compose base hooks
export const useQueue = () => {
  const { removeFromQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  // Queue-specific logic
};

export const useSearch = () => {
  const { addToQueue, toggleFavorite } = useSongOperations();
  const { showSuccess, showError } = useToast();
  // Search-specific logic
};
```

#### **Hook Dependencies:**
```typescript
// Hooks depend on Redux state and services
export const useQueue = () => {
  const queueItems = useAppSelector(selectQueueWithUserInfo);
  const { removeFromQueue } = useSongOperations();
  const { showError } = useToast();
  
  // Hook logic here
};
```

### **Component Architecture Pattern:**

#### **Component Structure:**
```typescript
// Feature components are simple and focused
export const Queue = () => {
  const { queueItems, handleRemoveFromQueue } = useQueue();
  
  return (
    <div>
      <InfiniteScrollList
        items={queueItems}
        context="queue"
        onRemove={handleRemoveFromQueue}
      />
    </div>
  );
};
```

#### **Component Dependencies:**
```typescript
// Components only depend on hooks and UI components
import { useQueue } from '../hooks';
import { InfiniteScrollList, SongItem } from '../components/common';
import type { QueueItem } from '../types';
```

### **Type Organization Pattern:**

#### **Type Definitions:**
```typescript
// src/types/index.ts
export interface Song {
  artist: string;
  title: string;
  path: string;
  favorite?: boolean;
}

export interface QueueItem {
  key?: string;
  order: number;
  singer: Singer;
  song: Song;
}

export interface RootState {
  controller: ControllerState;
  auth: AuthState;
}
```

#### **Type Usage:**
```typescript
// Always use type imports
import type { Song, QueueItem } from '../types';

// Use in function parameters and return types
const addToQueue = async (song: Song): Promise<void> => {
  // Implementation
};
```

### **Service Architecture Pattern:**

#### **Service Organization:**
```typescript
// src/firebase/services.ts
export const queueService = {
  addToQueue: async (controllerName: string, queueItem: Omit<QueueItem, 'key'>) => {
    // Implementation
  },
  removeFromQueue: async (controllerName: string, queueItemKey: string) => {
    // Implementation
  },
  subscribeToQueue: (controllerName: string, callback: (data: Record<string, QueueItem>) => void) => {
    // Implementation
  },
};
```

#### **Service Usage:**
```typescript
// Import services directly
import { queueService, favoritesService } from '../firebase/services';

// Use in hooks
const handleAddToQueue = useCallback(async (song: Song) => {
  await queueService.addToQueue(controllerName, queueItem);
}, [controllerName]);
```

### **Constants Organization Pattern:**

#### **Constants Structure:**
```typescript
// src/constants/index.ts
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
} as const;

export const FEATURES = {
  ENABLE_SEARCH: true,
  ENABLE_QUEUE_REORDER: true,
} as const;
```

#### **Constants Usage:**
```typescript
// Import constants from main index
import { UI_CONSTANTS, FEATURES } from '../constants';

// Use in components and hooks
const debounceDelay = UI_CONSTANTS.SEARCH.DEBOUNCE_DELAY;
```

### **Import Order Convention:**
```typescript
// 1. React imports
import { useState, useCallback, useEffect } from 'react';

// 2. Third-party library imports
import { useAppSelector, useAppDispatch } from '../redux';

// 3. Internal imports (alphabetical by folder)
import { useSongOperations } from '../hooks';
import { queueService } from '../firebase/services';
import { UI_CONSTANTS } from '../constants';
import { filterSongs } from '../utils/dataProcessing';

// 4. Type imports
import type { Song, QueueItem } from '../types';
```

### **File Naming Conventions:**
- **Components:** PascalCase (e.g., `SongItem.tsx`, `InfiniteScrollList.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useQueue.ts`, `useSongOperations.ts`)
- **Services:** camelCase with `Service` suffix (e.g., `queueService`, `favoritesService`)
- **Types:** PascalCase (e.g., `Song`, `QueueItem`, `Controller`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `UI_CONSTANTS`, `FEATURES`)
- **Utilities:** camelCase (e.g., `dataProcessing.ts`, `filterSongs`)

### **Critical Import Rules:**
- **Never import directly from slice files** - always use the main redux index
- **Always use type imports** for TypeScript interfaces
- **Import from index files** for organized modules (hooks, components, features)
- **Import services directly** from their service files
- **Import utilities directly** from their utility files
- **Import constants** from the main constants index

---

## 🔟 Cloud Function Design — Top Played

- **Trigger:** Firebase Cloud Function triggered when song added to `history`
- **Action:** Increments play count in `/controllers/{controllerName}/topPlayed/{songId}`
- **Benefits:** Non-blocking updates, real-time popularity tracking
- **Data Structure:** Stores artist, title, and count for each popular song

---

## 11️⃣ External Reference Files

| File | Purpose |
|------|---------|
| [`types.ts`](./types.ts) | Core TypeScript interfaces for data models |
| [`firebase_schema.json`](./firebase_schema.json) | Firebase Realtime Database structure reference |
| [`design/`](./design/) | UI/UX mockups and design specifications |

---

## 12️⃣ Data Access Model & Validation

> **Client-Controlled Access Model**

This app does **not** use Firebase Realtime Database Security Rules.
All permissions, validation, and business logic are enforced in the client application.

### **Enforced Client-Side:**
- ✅ **Admin-only permissions** for queue reorder, playback control, and singer management
- ✅ **Duplicate song prevention** enforced before adding to queue/favorites
- ✅ **Singer auto-addition** when users join the session
- ✅ **Data validation** against TypeScript interfaces before Firebase writes
- ✅ **Queue order management** with sequential numbering and cleanup
- ✅ **First item protection** preventing deletion during playback

### **Business Logic Validation:**
- **Queue Operations:** Order validation, duplicate prevention, singer attribution
- **Authentication:** Admin mode detection, session management
- **Data Integrity:** Type checking, required field validation
- **State Management:** Redux state consistency, error handling

**Assumed Environment:**
- The app is used in trusted, in-home scenarios with controlled participants
- Open Firebase access is considered acceptable for this use case
- All users are trusted participants in the karaoke session

---

## 13️⃣ Performance & Optimization

### **State Management:**
- **Redux Toolkit:** Efficient state management with immutable updates
- **Memoized Selectors:** Optimized data access with `createSelector`
- **Incremental Loading:** Pagination and infinite scroll for large datasets
- **Real-time Sync:** Efficient Firebase subscriptions with cleanup

### **UI Performance:**
- **React.memo:** Component memoization to prevent unnecessary re-renders
- **useCallback/useMemo:** Hook optimization for expensive operations
- **Virtual Scrolling:** Efficient rendering of large lists (implementation pending)
- **Lazy Loading:** Code splitting for better initial load times

### **Data Optimization:**
- **Efficient Queries:** Optimized Firebase queries with specific node subscriptions
- **Caching Strategy:** Redux state caching with timestamp-based invalidation
- **Batch Operations:** Grouped Firebase updates for better performance
- **Connection Management:** Proper cleanup of Firebase listeners

### **List Performance & UI Blocking Prevention:**
- **Mandatory Pagination:** All lists MUST use pagination to prevent UI blocking
- **Progressive Rendering:** Only render visible items plus small buffer (20 items per page)
- **Intersection Observer:** Efficient scroll detection without performance impact
- **Memory Management:** Automatic cleanup of observers and event listeners
- **Virtual Scrolling:** Future implementation for very large datasets (1000+ items)
- **Debounced Operations:** Search and filter operations debounced to prevent excessive re-renders
- **Memoized Selectors:** Redux selectors memoized to prevent unnecessary re-computations
- **Optimistic Updates:** UI updates immediately with rollback on error
- **Lazy Loading:** Images and heavy content loaded only when needed
- **Render Optimization:** React.memo and useCallback for expensive operations
- **Bundle Splitting:** Code splitting for better initial load times

---

## 14️⃣ Error Handling & Resilience

### **Firebase Connection:**
- **Connection Monitoring:** Real-time connection status tracking
- **Retry Logic:** Automatic retry for failed operations
- **Graceful Degradation:** App continues to work with cached data
- **Error Boundaries:** React error boundaries for component-level error handling

### **Data Validation:**
- **Type Safety:** TypeScript compilation-time error prevention
- **Runtime Validation:** Data structure validation before Firebase writes
- **Fallback Values:** Default values for missing or corrupted data
- **User Feedback:** Clear error messages and recovery options

### **State Recovery:**
- **Session Persistence:** Authentication state recovery
- **Data Rehydration:** Redux state restoration from Firebase
- **Conflict Resolution:** Handling concurrent user modifications
- **Data Consistency:** Automatic cleanup of inconsistent data structures

---

## 15️⃣ Testing Strategy

### **Unit Testing:**
- **Hook Testing:** Business logic hooks with isolated testing
- **Selector Testing:** Redux selector validation
- **Utility Testing:** Pure function testing for data processing
- **Type Testing:** TypeScript interface validation

### **Integration Testing:**
- **Firebase Integration:** Real-time sync testing
- **Redux Integration:** State management flow testing
- **Component Integration:** UI component interaction testing
- **API Testing:** Firebase service layer testing

### **E2E Testing:**
- **User Flow Testing:** Complete user journey validation
- **Multi-user Testing:** Concurrent user interaction testing
- **Performance Testing:** Load testing for large datasets
- **Cross-browser Testing:** Browser compatibility validation

---

## 16️⃣ Deployment & Environment

### **Build Configuration:**
- **Vite:** Fast build tool with hot module replacement
- **TypeScript:** Strict type checking and compilation
- **ESLint:** Code quality and consistency enforcement
- **Tailwind CSS:** Utility-first CSS framework

### **Environment Variables:**
- **Firebase Config:** Database connection configuration
- **Controller Name:** Default controller for development
- **Feature Flags:** Environment-specific feature toggles

### **Deployment Targets:**
- **Development:** Local development with hot reload
- **Staging:** Pre-production testing environment
- **Production:** Live karaoke app deployment

---

## 17️⃣ Firebase Implementation Patterns

### **Key Management & Data Structure:**
- **Sequential Numerical Keys:** Queue items use sequential numerical keys (0, 1, 2, etc.) instead of Firebase push IDs
- **Key Migration:** Automatic cleanup of inconsistent keys (migrate push ID keys to sequential numerical keys)
- **Order Validation:** Queue items maintain sequential order (1, 2, 3, etc.) with automatic cleanup
- **Controller Structure:** Complete controller object loaded on initial connection with empty initialization if not exists

### **Firebase Services Architecture:**
- **Service Layer Pattern:** All Firebase operations abstracted into service modules:
  - `controllerService` - Controller CRUD operations
  - `queueService` - Queue management with key cleanup
  - `playerService` - Player state management
  - `historyService` - History operations
  - `favoritesService` - Favorites management
- **Subscription Pattern:** Each service provides subscribe/unsubscribe functions for real-time updates
- **Error Handling:** Service functions include try-catch blocks with console logging

### **Real-time Sync Implementation:**
- **FirebaseProvider Pattern:** Centralized sync management with connection status tracking
- **Full Controller Load:** Initial load of complete controller object on authentication
- **Empty Controller Initialization:** Creates empty controller structure if none exists
- **Connection Status:** Real-time tracking of `isConnected` and `syncStatus` states
- **Cleanup Management:** Proper cleanup of Firebase listeners on unmount

### **Queue Management Patterns:**
- **Sequential Key Generation:** Next key calculated as `Math.max(existingKeys) + 1`
- **Key Cleanup Function:** `cleanupQueueKeys()` migrates push ID keys to sequential numerical keys
- **Order Calculation:** Next order calculated as `Math.max(existingOrders) + 1`
- **Order Fixing:** Automatic queue order validation and repair in `useQueue` hook
- **Swap Operations:** Queue reordering uses Promise.all for atomic updates

### **Data Validation & Type Safety:**
- **TypeScript Interfaces:** All data validated against TypeScript interfaces before Firebase writes
- **Required Field Validation:** Critical fields (controller name, singer name) validated before operations
- **Fallback Values:** Default values provided for missing or corrupted data
- **Type Assertions:** Safe type casting with existence checks

### **Error Handling Patterns:**
- **Service-Level Error Handling:** Each service function includes try-catch with console logging
- **Hook-Level Error Handling:** Custom hooks include error handling with toast notifications
- **Graceful Degradation:** App continues to work with cached data during connection issues
- **Error Boundaries:** React error boundaries for component-level error handling
- **Connection Monitoring:** Real-time connection status with error state management

### **Performance Optimization Patterns:**
- **Efficient Queries:** Specific node subscriptions instead of full controller subscriptions
- **Listener Cleanup:** Proper cleanup of Firebase listeners to prevent memory leaks
- **Batch Operations:** Grouped Firebase updates using `update()` for better performance
- **Memoized Selectors:** Redux selectors memoized to prevent unnecessary re-computations
- **Incremental Loading:** Large datasets loaded in chunks via infinite scroll

### **Authentication Integration:**
- **Controller-Based Sessions:** Users connect to specific controller sessions
- **Admin Parameter Handling:** Admin access via URL parameter with automatic cleanup
- **Session Persistence:** Authentication state managed in Redux (lost on page reload)
- **Auto-Initialization:** Empty controller created if none exists for new sessions

### **Constants & Configuration:**
- **Environment Variables:** Firebase config loaded from environment variables with fallbacks
- **Feature Flags:** Configurable features via constants (ENABLE_SEARCH, ENABLE_QUEUE_REORDER, etc.)
- **UI Constants:** Centralized constants for toast durations, search delays, item limits
- **Error Messages:** Centralized error message constants for consistency

### **Critical Implementation Details:**
- **Queue Key Pattern:** Must use sequential numerical keys (0, 1, 2, etc.) - NOT push IDs
- **Order Management:** Queue items must maintain sequential order with automatic validation
- **Controller Initialization:** Empty controller structure created if none exists
- **Listener Management:** All Firebase listeners must be properly cleaned up
- **Error Recovery:** Graceful handling of Firebase sync failures with retry patterns
- **Type Safety:** All data must be validated against TypeScript interfaces
- **Performance:** Use specific node subscriptions instead of full controller subscriptions
- **Memory Management:** Proper cleanup of observers, listeners, and subscriptions

### **Firebase Schema Requirements:**
- **Controller Structure:** Must match the exact structure defined in `types.ts`
- **Key Format:** Queue items must use sequential numerical keys
- **Data Types:** All data must conform to TypeScript interfaces
- **Required Fields:** Critical fields must be present for operations to succeed
- **Default Values:** Empty controller must have all required fields with default values

### **Migration & Compatibility:**
- **Key Migration:** Automatic migration of push ID keys to sequential numerical keys
- **Order Fixing:** Automatic repair of inconsistent queue order values
- **Backward Compatibility:** Support for existing data with inconsistent keys
- **Data Validation:** Runtime validation of data structure integrity

---

## 18️⃣ Critical Implementation Notes

### **DO NOT CHANGE These Patterns:**
- **Queue Key Management:** Sequential numerical keys (0, 1, 2, etc.) - changing this will break queue functionality
- **Controller Structure:** Exact structure must match `types.ts` - changing will break sync
- **Service Layer Pattern:** All Firebase operations must go through service modules
- **Subscription Pattern:** Real-time updates must use subscribe/unsubscribe pattern
- **Error Handling:** Service-level error handling with console logging must be maintained
- **Type Safety:** All data validation against TypeScript interfaces must be preserved
- **Connection Management:** FirebaseProvider pattern with connection status tracking
- **Cleanup Management:** Proper cleanup of listeners and subscriptions

### **Critical Dependencies:**
- **Firebase Config:** Must be properly configured with environment variables
- **TypeScript Interfaces:** Must match exactly with Firebase data structure
- **Redux State:** Must maintain consistency with Firebase data
- **Service Functions:** Must handle all error cases and provide proper cleanup
- **Hook Dependencies:** Must include proper dependency arrays for useEffect hooks

### **Performance Requirements:**
- **List Pagination:** All lists must use infinite scroll with 20 items per page
- **Memory Management:** Proper cleanup of all listeners and observers
- **Efficient Queries:** Use specific node subscriptions, not full controller subscriptions
- **Optimistic Updates:** UI updates immediately with rollback on error
- **Debounced Operations:** Search and filter operations must be debounced

### **Error Recovery Patterns:**
- **Graceful Degradation:** App must continue working with cached data during connection issues
- **Retry Logic:** Automatic retry for failed Firebase operations
- **User Feedback:** Clear error messages with recovery options
- **Data Validation:** Runtime validation with fallback values
- **Connection Monitoring:** Real-time connection status with error state management

---

## ✅ Summary

This PRD serves as the comprehensive source of truth for application logic, Firebase data flow, and feature requirements.
It works alongside `types.ts` and `firebase_schema.json` to inform both human developers and AI tools for accurate implementation.

**Key Success Metrics:**
- ✅ **Real-time Sync:** All users see updates within 1 second
- ✅ **Performance:** App loads in under 3 seconds on mobile
- ✅ **Reliability:** 99.9% uptime with graceful error handling
- ✅ **User Experience:** Intuitive interface requiring minimal training
- ✅ **Scalability:** Supports up to 50 concurrent users per session

---

## 19️⃣ Environment Configuration & .env.local Setup

### **Environment File Structure:**
The application uses Vite's built-in environment variable support with the following file structure:

```
project-root/
├── .env.template          # Template file with all required variables
├── .env.local            # Local development environment (gitignored)
├── .env.production       # Production environment (if needed)
└── .env.staging         # Staging environment (if needed)
```

### **Required Environment Variables:**

#### **Firebase Configuration (Required):**
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

#### **App Configuration (Optional with defaults):**
```bash
# App Configuration
VITE_CONTROLLER_NAME=default
VITE_APP_TITLE=SingSalot AI
```

### **Environment Variable Usage Pattern:**
- **Vite Prefix:** All environment variables must be prefixed with `VITE_` to be accessible in the client-side code
- **Fallback Values:** All environment variables have fallback values in `src/constants/index.ts`
- **Type Safety:** Environment variables are accessed via `import.meta.env.VITE_*`
- **Build-time Injection:** Variables are injected at build time, not runtime

### **Configuration Loading Pattern:**
```typescript
// src/constants/index.ts
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project-id.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://your-project-id-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project-id.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
};

export const CONTROLLER_NAME = import.meta.env.VITE_CONTROLLER_NAME || 'default';
```

### **Setup Instructions:**

#### **1. Initial Setup:**
```bash
# Copy the template file
cp .env.template .env.local

# Edit .env.local with your actual Firebase configuration
nano .env.local
```

#### **2. Firebase Configuration:**
1. Go to Firebase Console → Project Settings
2. Copy the configuration values from the "General" tab
3. Replace the placeholder values in `.env.local`

#### **3. Controller Configuration:**
- `VITE_CONTROLLER_NAME`: Set to your desired controller name (default: "default")
- `VITE_APP_TITLE`: Set to your desired app title (default: "SingSalot AI")

### **Environment-Specific Configurations:**

#### **Development (.env.local):**
```bash
# Local development with hot reload
VITE_CONTROLLER_NAME=dev-controller
VITE_APP_TITLE=SingSalot AI (Dev)
```

#### **Staging (.env.staging):**
```bash
# Pre-production testing
VITE_CONTROLLER_NAME=staging-controller
VITE_APP_TITLE=SingSalot AI (Staging)
```

#### **Production (.env.production):**
```bash
# Live production environment
VITE_CONTROLLER_NAME=production-controller
VITE_APP_TITLE=SingSalot AI
```

### **Security Considerations:**
- **Client-Side Exposure:** All `VITE_*` variables are exposed in the client bundle
- **Firebase Security:** Firebase API keys are safe to expose in client-side code
- **Database Rules:** Security is enforced through Firebase Realtime Database Rules
- **Environment Isolation:** Use different Firebase projects for different environments

### **Build Process Integration:**
- **Development:** Uses `.env.local` automatically when running `npm run dev`
- **Production Build:** Uses `.env.production` when running `npm run build`
- **Environment Detection:** Vite automatically detects the correct environment file
- **Build-time Injection:** Variables are replaced at build time, not runtime

### **Error Handling for Missing Variables:**
- **Fallback Values:** All variables have sensible defaults
- **Console Warnings:** Missing required variables show console warnings
- **Graceful Degradation:** App continues to work with fallback values
- **Development Feedback:** Clear error messages for missing configuration

### **Environment Variable Validation:**
```typescript
// Validation pattern used in the app
const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_DATABASE_URL',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing Firebase configuration:', missing);
  }
};
```

### **Deployment Considerations:**
- **CI/CD Integration:** Environment variables must be set in deployment pipeline
- **Build Commands:** Different build commands for different environments
- **Environment Files:** `.env.local` is gitignored, other files may be committed
- **Secret Management:** Use deployment platform's secret management for production

### **Troubleshooting:**
- **Variable Not Found:** Ensure variable name starts with `VITE_`
- **Build Issues:** Check that all required variables are set
- **Runtime Errors:** Verify Firebase configuration is correct
- **Environment Detection:** Ensure correct `.env` file is being used

### **Best Practices:**
- **Template File:** Always maintain `.env.template` with all required variables
- **Documentation:** Document all environment variables and their purposes
- **Validation:** Implement runtime validation for critical configuration
- **Fallbacks:** Provide sensible default values for all variables
- **Security:** Never commit sensitive values to version control

---

## 20️⃣ Third-Party UI Library - Ionic React

### **Current UI Implementation:**
The application currently uses **Tailwind CSS** for styling with custom components. While functional, this approach requires significant custom development for responsive design and native platform feel.

### **Recommended Solution: Ionic React**

For a **mobile-first app that works on web**, **Ionic React** is the single best choice because it provides native platform feel across all devices while maintaining web compatibility.

#### **Installation:**
```bash
npm install @ionic/react @ionic/core
```

#### **Why Ionic React:**
- **Mobile-First:** Designed specifically for mobile experiences
- **Native Feel:** Mimics iOS and Android native components automatically
- **Web Compatible:** Works perfectly on desktop browsers
- **Touch Optimized:** Built-in touch interactions and gestures
- **Responsive:** Automatic responsive design without custom CSS
- **Accessibility:** Excellent accessibility support out of the box
- **Performance:** Optimized for mobile performance
- **Simple:** One library handles everything - no complex configuration

#### **Integration Pattern:**
```typescript
// src/components/common/IonicButton.tsx
import { IonButton, IonIcon } from '@ionic/react';
import { add, heart, play } from 'ionicons/icons';

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  icon,
  disabled = false
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'primary': return 'primary';
      case 'secondary': return 'medium';
      case 'danger': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <IonButton
      onClick={onClick}
      disabled={disabled}
      fill={getVariant()}
      size="small"
    >
      {icon && <IonIcon icon={icon} slot="start" />}
      {children}
    </IonButton>
  );
};
```

#### **Responsive Design (Automatic):**
```typescript
// Ionic handles responsive design automatically
export const SongList: React.FC = () => {
  return (
    <IonList>
      {songs.map(song => (
        <IonItem key={song.id}>
          <IonLabel>
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
          </IonLabel>
          <IonButton slot="end" fill="clear">
            <IonIcon icon={add} />
          </IonButton>
        </IonItem>
      ))}
    </IonList>
  );
};
```

#### **Navigation (Mobile-First):**
```typescript
// Ionic provides mobile-optimized navigation
export const AppNavigation: React.FC = () => {
  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="queue">
          <IonIcon icon={list} />
          <IonLabel>Queue</IonLabel>
        </IonTabButton>
        <IonTabButton tab="search">
          <IonIcon icon={search} />
          <IonLabel>Search</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorites">
          <IonIcon icon={heart} />
          <IonLabel>Favorites</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
```

#### **Touch Interactions (Built-in):**
```typescript
// Ionic provides touch-optimized interactions automatically
export const SwipeableSongItem: React.FC<SongItemProps> = ({
  song,
  onDelete
}) => {
  return (
    <IonItemSliding>
      <IonItem>
        <IonLabel>
          <h2>{song.title}</h2>
          <p>{song.artist}</p>
        </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={() => onDelete(song.id)}>
          <IonIcon icon={trash} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};
```

### **Migration Strategy (Simple):**

#### **Step 1: Install and Setup (1 day)**
```bash
npm install @ionic/react @ionic/core
```

Add to `src/main.tsx`:
```typescript
import { setupIonicReact } from '@ionic/react';

setupIonicReact();
```

#### **Step 2: Replace Core Components (3-4 days)**
- Replace `ActionButton` with `IonButton`
- Replace custom lists with `IonList` and `IonItem`
- Replace modals with `IonModal`
- Replace toasts with `IonToast`

#### **Step 3: Update Navigation (1 day)**
- Replace custom navigation with `IonTabs` or `IonMenu`
- Mobile gets bottom tabs, desktop gets side menu automatically

#### **Step 4: Add Touch Features (1 day)**
- Add swipe-to-delete with `IonItemSliding`
- Add pull-to-refresh with `IonRefresher`
- Add infinite scroll with `IonInfiniteScroll`

### **Benefits Over Current Approach:**

#### **Before (Tailwind CSS):**
- ❌ Custom responsive CSS for every component
- ❌ Manual touch interaction implementation
- ❌ Custom mobile navigation
- ❌ Manual accessibility features
- ❌ Complex responsive breakpoints

#### **After (Ionic React):**
- ✅ Automatic responsive design
- ✅ Built-in touch interactions
- ✅ Mobile-optimized navigation
- ✅ Accessibility built-in
- ✅ Native platform feel
- ✅ Works on all devices automatically

### **Performance:**
- **Bundle Size:** ~50KB gzipped (minimal overhead)
- **Mobile Performance:** Optimized for mobile devices
- **Web Performance:** Works great on desktop browsers
- **Loading:** Fast initial load with lazy loading

### **Accessibility:**
- **Screen Readers:** Full support out of the box
- **Keyboard Navigation:** Complete keyboard support
- **Touch Targets:** Proper 44px minimum touch targets
- **WCAG Compliance:** Built-in accessibility standards

### **Implementation Timeline:**
- **Day 1:** Install and basic setup
- **Days 2-5:** Replace core components
- **Day 6:** Update navigation
- **Day 7:** Add touch features and testing

### **Success Metrics:**
- **Mobile Performance:** 90+ Lighthouse score
- **Touch Responsiveness:** <100ms response time
- **Accessibility:** WCAG 2.1 AA compliance
- **User Experience:** Native app feel on mobile
- **Web Compatibility:** Perfect desktop experience

### **Why Not Other Libraries:**
- **Chakra UI:** Great for web, but requires custom mobile optimization
- **Material-UI:** Enterprise-focused, overkill for this app
- **Custom Tailwind:** Too much work for responsive design and touch interactions

### **Simple Decision:**
**Use Ionic React** - it's the only library that gives you:
1. Mobile-first design automatically
2. Native platform feel
3. Perfect web compatibility
4. Built-in touch interactions
5. Zero configuration responsive design

No complex choices, no multiple libraries, no over-engineering. Just one library that does everything you need for a mobile-first karaoke app.

---

## 21️⃣ Design Folder & Mockups

### **Design Folder Contents:**
The `/docs/design/` folder contains UI/UX mockups that were created using an **older version of Ionic** to demonstrate the intended layout and user experience.

#### **Mockup Files:**
- `00-web-layout.JPG` - Overall web layout structure
- `01-Login.png` - Login screen design
- `02-menu.jpeg` - Navigation menu layout
- `02-queue-delete.png` - Queue management with delete functionality
- `02-queue-drag.png` - Queue reordering with drag and drop
- `02-queue-sorting.png` - Queue sorting interface
- `02-queue.png` - Main queue view
- `03-menu current page and non-admin.png` - Navigation with current page indicators
- `03-menu playing (admin).png` - Admin view during playback
- `03-menu.png` - General menu layout
- `04-search typing .png` - Search interface with typing
- `04-search-song info.png` - Search results with song information
- `04-search.png` - Main search interface
- `05-singers add.png` - Singer management interface
- `05-singers.png` - Singer list view
- `06-artists .png` - Artist browse interface
- `06-artists (not admin).png` - Non-admin artist view
- `06-artists search.png` - Artist search functionality
- `06-artists songs.png` - Artist songs list
- `07-favorites.png` - Favorites management
- `08-history.png` - Play history view
- `09- song lists songs expand.png` - Song lists with expandable sections
- `09-song lists - songs.png` - Song lists with song details
- `09-songs list.png` - Main song lists view
- `10-Settings.png` - Settings interface
- `11-top 100.png` - Top played songs
- `12-favorite lists.png` - Favorite lists management
- `12-favorites .png` - Favorites view

### **Important Note About Ionic Versions:**
The mockups were created using an **older version of Ionic** and may not reflect the current Ionic React component API or styling. However, they serve as valuable reference for:

#### **Layout Intent:**
- **Overall Structure:** How the app should be organized
- **Navigation Flow:** User journey through different screens
- **Component Placement:** Where buttons, lists, and controls should be positioned
- **Information Hierarchy:** How data should be prioritized and displayed

#### **User Experience Goals:**
- **Mobile-First Design:** Touch-friendly interface elements
- **Intuitive Navigation:** Clear paths between features
- **Context-Aware Actions:** Different actions based on user role and context
- **Real-time Updates:** Visual indicators for live data changes

### **Implementation Considerations:**

#### **Modern Ionic React vs Mockups:**
```typescript
// Mockup shows older Ionic syntax
<IonButton color="primary" onClick={handleClick}>
  Add to Queue
</IonButton>

// Modern Ionic React syntax (current recommendation)
<IonButton fill="solid" color="primary" onClick={handleClick}>
  <IonIcon icon={add} slot="start" />
  Add to Queue
</IonButton>
```

#### **Component Mapping:**
| Mockup Component | Modern Ionic React Component |
|------------------|------------------------------|
| Old Button | `IonButton` with `fill` prop |
| Old List | `IonList` with `IonItem` |
| Old Modal | `IonModal` with `IonHeader` |
| Old Navigation | `IonTabs` or `IonMenu` |
| Old Toast | `IonToast` with `position` prop |

#### **Styling Updates:**
- **Colors:** Modern Ionic uses semantic color names
- **Spacing:** Updated spacing system for better mobile experience
- **Typography:** Improved font scaling for accessibility
- **Touch Targets:** Enhanced minimum touch target sizes

### **Using Mockups for Implementation:**

#### **1. Layout Reference:**
- Use mockups to understand the intended layout structure
- Follow the visual hierarchy shown in the designs
- Maintain the component relationships and positioning

#### **2. Feature Requirements:**
- Identify required functionality from mockups
- Understand user interaction patterns
- Note admin vs user permission differences

#### **3. User Flow Validation:**
- Verify navigation paths match mockup flow
- Ensure all screens are implemented
- Confirm user roles and permissions are correctly applied

#### **4. Modern Implementation:**
- Use current Ionic React components and syntax
- Apply modern responsive design principles
- Implement current accessibility standards
- Follow current performance best practices

### **Migration from Mockups to Modern Ionic:**

#### **Step 1: Component Analysis**
- Review each mockup for required components
- Map to current Ionic React component library
- Identify any custom components needed

#### **Step 2: Layout Implementation**
- Implement responsive layouts using modern Ionic grid
- Use current Ionic spacing and sizing system
- Apply modern touch interaction patterns

#### **Step 3: Feature Implementation**
- Build features using current Ionic React APIs
- Implement modern state management patterns
- Apply current performance optimization techniques

#### **Step 4: Testing and Refinement**
- Test on actual mobile devices
- Verify touch interactions work correctly
- Ensure accessibility compliance
- Optimize for performance

### **Key Differences to Note:**

#### **Navigation:**
- **Mockups:** May show older navigation patterns
- **Modern:** Use `IonTabs` for bottom navigation on mobile
- **Modern:** Use `IonMenu` for side navigation on desktop

#### **Lists:**
- **Mockups:** May show older list styling
- **Modern:** Use `IonList` with `IonItem` for better performance
- **Modern:** Implement `IonItemSliding` for swipe actions

#### **Forms:**
- **Mockups:** May show older form components
- **Modern:** Use `IonInput`, `IonSelect`, etc. for better UX
- **Modern:** Implement proper form validation

#### **Modals:**
- **Mockups:** May show older modal patterns
- **Modern:** Use `IonModal` with proper backdrop handling
- **Modern:** Implement proper focus management

### **Recommendation:**
1. **Use mockups as layout and UX reference**
2. **Implement using current Ionic React components**
3. **Follow modern responsive design principles**
4. **Test on actual devices for touch interactions**
5. **Ensure accessibility and performance compliance**

The mockups provide excellent guidance for the intended user experience, but the implementation should use current Ionic React best practices and components.

---

## 22️⃣ Development Setup & Configuration

