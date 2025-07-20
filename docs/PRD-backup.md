# 🎤 Karaoke App — Product Requirements Document (PRD)

---

## 🚀 How to Use This PRD

**For AI Implementation:** When you read this PRD, please:
1. **Read the entire document completely** - it contains comprehensive technical specifications
2. **Ask the 7 implementation questions** from Section 29 to determine platform/framework choices
3. **Follow the implementation checklist** from Section 29 for the complete build process
4. **Preserve all business logic** while adapting UI to the chosen framework
5. **Use the exact specifications** for data flows, service APIs, and error handling

**For Human Developers:** This PRD contains complete technical specifications including data flows, state management, service APIs, component architecture, error handling, and performance optimizations. It's designed for 100% accuracy when building from scratch.

---

> **Note:** This PRD is structured for platform-agnostic use. Each feature is described with platform-independent requirements, followed by a 'Web Implementation Details' section for web-specific behaviors. For future platforms (iOS, Android, etc.), add corresponding implementation details under each feature. This ensures the PRD can be used as the single source of truth for any platform.
>
> **Toolset/Framework Sections:** Each platform implementation includes explicit toolset/framework choices with rationale. This preserves the "why" behind current choices while enabling seamless migration to new technologies. When migrating, replace the toolset section while keeping the core requirements intact.

---

## 1. Purpose

This document defines the functional, technical, and UX requirements for the Karaoke App, designed for **in-home party use**. The app leverages **Firebase Realtime Database** for real-time synchronization, with all business logic and validation handled **client-side**.

---

## 2. Scope & Business Objectives

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

## 2.5. Toolset & Framework Choices

### **Current Web Implementation Toolset:**

#### **Core Framework: React 18 + TypeScript**
- **Why:** Component-based architecture, strong ecosystem, excellent TypeScript support
- **Migration Note:** Can be replaced with any component-based framework (Vue, Svelte, etc.)

#### **State Management: Redux Toolkit**
- **Why:** Centralized state management, predictable state updates, excellent dev tools
- **Key Requirements:** Must support real-time sync, optimistic updates, and complex state relationships
- **Migration Note:** Can be replaced with Zustand, Jotai, Valtio, or any state management solution that supports:
  - Centralized state
  - Real-time updates
  - Optimistic updates
  - Complex selectors

#### **UI Framework: Ionic React**
- **Why:** Mobile-first design, native feel, excellent accessibility, built-in components
- **Key Requirements:** Must support responsive design, touch interactions, and accessibility
- **Migration Note:** Can be replaced with any UI framework that provides:
  - Responsive components
  - Touch-optimized interactions
  - Accessibility support
  - Modal/dialog components
  - List components with infinite scroll

#### **Styling: Tailwind CSS**
- **Why:** Utility-first CSS, rapid development, consistent design system
- **Migration Note:** Can be replaced with any CSS solution (CSS Modules, Styled Components, etc.)

#### **Build Tool: Vite**
- **Why:** Fast development server, optimized builds, excellent TypeScript support
- **Migration Note:** Can be replaced with any modern build tool (Webpack, Parcel, etc.)

#### **Backend: Firebase Realtime Database**
- **Why:** Real-time sync, simple setup, excellent for collaborative apps
- **Key Requirements:** Must support real-time listeners, offline capabilities, and complex queries
- **Migration Note:** Can be replaced with any real-time database (Supabase, AWS AppSync, etc.)

#### **Cloud Functions: Firebase Functions**
- **Why:** Serverless, integrates with Firebase, automatic scaling
- **Migration Note:** Can be replaced with any serverless platform (AWS Lambda, Vercel Functions, etc.)

### **Architecture Patterns:**

#### **Service Layer Pattern**
- **Why:** Separation of concerns, testable business logic, reusable across components
- **Implementation:** All Firebase operations abstracted into service modules
- **Migration Note:** Must maintain service layer pattern regardless of backend choice

#### **Hook Pattern**
- **Why:** Reusable business logic, separation of UI and logic, testable
- **Implementation:** Custom hooks for each feature (useQueue, useSearch, etc.)
- **Migration Note:** Can be replaced with any pattern that separates business logic from UI

#### **Component Composition**
- **Why:** Reusable components, clear separation of concerns, maintainable
- **Implementation:** Common components (SongItem, ActionButton, etc.) used across features
- **Migration Note:** Must maintain component composition regardless of framework choice

---

## 3. User Roles & Permissions

**Requirements (Platform-Agnostic):**
- Two roles: Host/Admin and Singer/User.
- Only admins can reorder or delete queue items, control playback, and manage singers.
- Admin access is a privileged mode (see platform details for how it's triggered).
- First queue item cannot be deleted while playing (only when stopped/paused).
- Singers are automatically added to the singers list when they join.

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#authentication` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#authentication` (future)
- **Android:** See `platforms/android/PRD-android.md#authentication` (future)

---

## 4. Feature Overview

### Authentication & Session Management
**Requirements (Platform-Agnostic):**
- Login requires both Party ID and singer name.
- Party ID is validated against the backend before login is allowed.
- Authentication state is managed in the app state and lost on app reload (unless platform supports persistence).

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#authentication` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#authentication` (future)
- **Android:** See `platforms/android/PRD-android.md#authentication` (future)

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

## 5. Data Models

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

## 6. Firebase Realtime Database Structure

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
    disabledSongs: Record<string, DisabledSong>,
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

**Empty Controller Structure:**
```json
{
  "favorites": {},
  "history": {},
  "topPlayed": {},
  "newSongs": {},
  "disabledSongs": {},
  "player": {
    "queue": {},
    "settings": {
      "autoadvance": false,
      "userpick": false
    },
    "singers": {},
    "state": {
      "state": "stopped"
    }
  },
  "songList": {},
  "songs": {}
}
```

**Key Generation Rules:**
- **Queue Items:** Sequential numerical keys (0, 1, 2, ...)
- **Top Played:** `sanitizedArtist_sanitizedTitle` (lowercase, trimmed, invalid chars replaced with `_`)
- **Disabled Songs:** Hash of song path (simple character-based hash)
- **Singers:** Firebase push IDs (auto-generated)

**Character Sanitization for Top Played Keys:**
- Replace invalid Firebase characters `[.#$/[\]]` with `_`
- Convert to lowercase and trim whitespace
- Format: `${sanitizedArtist}_${sanitizedTitle}`

---

## 7. UI/UX Behavior

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

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#uiux-behavior` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#uiux-behavior` (future)
- **Android:** See `platforms/android/PRD-android.md#uiux-behavior` (future)

---

## 8. UI Rules & Constraints

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

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#ui-rules` for React/Ionic implementation details
- **iOS:** See `platforms/ios/PRD-ios.md#ui-rules` (future)
- **Android:** See `platforms/android/PRD-android.md#ui-rules` (future)

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

## 9. Codebase Organization & File Structure

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

### **Automatic Top Played Calculation:**
- **Trigger:** Firebase Cloud Function triggered when song added to `history`
- **Action:** Recalculates entire top played list based on history aggregation
- **Benefits:** Non-blocking updates, real-time popularity tracking
- **Data Structure:** Stores artist, title, and count for each popular song

### **Key Generation Logic:**
- **Format:** `sanitizedArtist_sanitizedTitle`
- **Sanitization:** Replace invalid Firebase characters `[.#$/[\]]` with `_`
- **Processing:** Convert to lowercase and trim whitespace
- **Example:** "AC/DC" + "Back in Black" → "ac_dc_back_in_black"

### **Aggregation Algorithm:**
- **Group By:** Artist + Title combination (case-insensitive)
- **Count Logic:** Sum all `count` values for same artist/title
- **Sorting:** Sort by count descending, limit to top 100
- **Data Structure:** Convert array back to object format for Firebase

### **Manual Recalculation Function:**
- **Function Name:** `recalculateTopPlayed`
- **Trigger:** Manual HTTP callable function
- **Purpose:** Data migration, initial setup, or data repair
- **Input:** `{ controllerName: string }`
- **Output:** Success/failure status with message

### **Error Handling:**
- **Validation:** Require controllerName parameter
- **Empty Data:** Return empty topPlayed if no history exists
- **Logging:** Console logs for debugging and monitoring

---

## 11. External Reference Files

| File | Purpose |
|------|---------|
| [`types.ts`](./types.ts) | Core TypeScript interfaces for data models |
| [`firebase_schema.json`](./firebase_schema.json) | Firebase Realtime Database structure reference |
| [`design/`](./design/) | UI/UX mockups and design specifications |

---

## 12. Data Access Model & Validation

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

## 13. Performance & Optimization

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

## 14. Error Handling & Resilience

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

## 15. Testing Strategy

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

## 16. Deployment & Environment

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

## 17. Firebase Implementation Patterns

### **Key Management & Data Structure:**
- **Sequential Numerical Keys:** Queue items use sequential numerical keys (0, 1, 2, etc.) instead of Firebase push IDs
- **Key Migration:** Automatic cleanup of inconsistent keys (migrate push ID keys to sequential numerical keys)
- **Order Validation:** Queue items maintain sequential order (1, 2, 3, etc.) with automatic cleanup
- **Controller Structure:** Complete controller object loaded on initial connection with empty initialization if not exists

### **Queue Key Migration Logic:**
- **Cleanup Function:** `cleanupQueueKeys()` migrates push ID keys to sequential numerical keys
- **Key Validation:** Regex pattern `/^\d+$/` to identify numerical keys
- **Migration Strategy:** Find push ID keys, assign sequential keys, update Firebase atomically

### **Queue Order Calculation:**
- **Order Logic:** `Math.max(...queueItems.map(item => item.order || 0)) + 1`
- **Fallback Handling:** Use `|| 0` for missing order values
- **Auto-Fix:** Check for inconsistencies on every queue update and fix automatically

### **Disabled Songs Implementation:**
- **Hash Function:** Simple character-based hash for Firebase-safe keys
- **Hash Algorithm:** `((hash << 5) - hash) + charCodeAt(i)` converted to base36
- **Timeout Handling:** 10-second timeout for all disabled song operations
- **Validation:** Required fields (controller name, song path, artist, title)
- **Integration:** Filter disabled songs from all search results

### **Search Algorithm Details:**
- **Multi-word Logic:** AND logic for multiple terms, OR logic for single term
- **Term Processing:** Split on whitespace, filter empty terms
- **Matching:** Case-insensitive includes check on title and artist
- **Disabled Filtering:** Exclude disabled songs from all results
- **Loading States:** Don't show results while disabled songs are loading

### **Authentication Validation:**
- **Controller Existence Check:** Verify controller exists in Firebase before login
- **Error Messages:** "Invalid Party Id. Please check your Party Id and try again."
- **Field Validation:** Both Party ID and singer name required and trimmed

### **Singer Name Validation:**
- **Case-insensitive Comparison:** `.toLowerCase()` for duplicate checking
- **Trim Validation:** Remove whitespace from singer names
- **Unique Constraint:** Prevent duplicate singer names (case-insensitive)

### **Error Handling & Timeouts:**
- **Timeout Values:** 10-second timeout for Firebase operations
- **Specific Error Messages:** "Singer already exists", "Controller not found", etc.
- **Error Recovery:** Handle specific error types with appropriate user feedback

### **Redux Store Configuration:**
- **Serializable Check:** Disabled for development (`serializableCheck: false`)
- **Immutable Check:** Ignored paths for large data objects
- **Middleware Configuration:** Specific Redux Toolkit settings for performance

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

## 18. Critical Implementation Notes

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

## 19. Environment Configuration & .env.local Setup

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

## 23. Complete Data Flow Diagrams

### **Authentication Flow:**
```
1. User enters Party ID + Name
2. Validate Party ID exists in Firebase
3. If valid: dispatch setAuth action
4. If invalid: show error message "Invalid Party Id. Please check your Party Id and try again."
5. On auth success: initialize Firebase sync
6. Load complete controller object
7. If controller doesn't exist: create empty structure
8. Clean up admin URL parameter if present
```

### **Queue Operations Flow:**
```
Add to Queue:
1. User clicks "Add to Queue" on song
2. Validate controller name and current singer exist
3. Calculate next order: Math.max(existingOrders) + 1
4. Create queue item with sequential key
5. Call queueService.addToQueue()
6. Firebase updates in real-time
7. All clients receive updated queue
8. Show success toast

Remove from Queue:
1. User clicks remove (admin only, when not playing)
2. Validate admin permissions and playback state
3. Call queueService.removeFromQueue()
4. Firebase removes item
5. All clients receive updated queue
6. Show success toast

Reorder Queue:
1. Admin clicks reorder buttons
2. Validate admin permissions and playback state
3. Calculate new order values for affected items
4. Update all affected items atomically with Promise.all()
5. Firebase updates in real-time
6. All clients receive updated queue
7. Show success toast
```

### **Search Flow:**
```
1. User types in search input
2. Debounce 300ms before processing
3. If < 2 characters: show all songs (filtered by disabled songs)
4. If >= 2 characters: filter songs by search term
5. Apply multi-word logic (AND for multiple terms, OR for single term)
6. Filter out disabled songs
7. Paginate results (20 items per page)
8. Show results with infinite scroll
9. Reset to page 1 when search term changes
```

### **Real-time Sync Flow:**
```
1. User authenticates successfully
2. FirebaseProvider initializes
3. Subscribe to controller node: `controllers/${controllerName}`
4. On data change: dispatch setController action
5. Redux updates state
6. Components re-render with new data
7. On unmount: cleanup Firebase listeners
```

---

## 24. State Management Architecture

### **Redux State Tree Structure:**
```typescript
{
  auth: {
    data: {
      authenticated: boolean,
      singer: string,
      isAdmin: boolean,
      controller: string
    } | null,
    loading: boolean,
    error: string | null
  },
  controller: {
    data: {
      favorites: Record<string, Song>,
      history: Record<string, Song>,
      topPlayed: Record<string, TopPlayed>,
      newSongs: Record<string, Song>,
      disabledSongs: Record<string, DisabledSong>,
      player: {
        queue: Record<string, QueueItem>,
        settings: {
          autoadvance: boolean,
          userpick: boolean
        },
        singers: Record<string, Singer>,
        state: {
          state: PlayerState
        }
      },
      songList: Record<string, SongList>,
      songs: Record<string, Song>
    } | null,
    loading: boolean,
    error: string | null,
    lastUpdated: number | null
  }
}
```

### **Key Selectors (Memoized):**
```typescript
// Authentication
selectIsAuthenticated: (state) => state.auth.data?.authenticated
selectControllerName: (state) => state.auth.data?.controller
selectCurrentSinger: (state) => state.auth.data?.singer
selectIsAdmin: (state) => state.auth.data?.isAdmin

// Controller Data
selectController: (state) => state.controller.data
selectSongs: (state) => state.controller.data?.songs
selectQueue: (state) => state.controller.data?.player.queue
selectFavorites: (state) => state.controller.data?.favorites
selectHistory: (state) => state.controller.data?.history
selectTopPlayed: (state) => state.controller.data?.topPlayed
selectNewSongs: (state) => state.controller.data?.newSongs
selectDisabledSongs: (state) => state.controller.data?.disabledSongs
selectSettings: (state) => state.controller.data?.player.settings
selectSingers: (state) => state.controller.data?.player.singers
selectPlayerState: (state) => state.controller.data?.player.state

// Derived Data
selectSongsArray: createSelector([selectSongs], (songs) => 
  sortSongsByArtistAndTitle(objectToArray(songs))
)
selectQueueWithUserInfo: createSelector([selectQueue, selectCurrentSinger], (queue, currentSinger) => 
  addUserInfoToQueue(queue, currentSinger)
)
selectQueueLength: createSelector([selectQueue], (queue) => 
  Object.keys(queue || {}).length
)
```

### **Action Types:**
```typescript
// Auth Actions
setAuth: Authentication
setLoading: boolean
setError: string
clearError: void
logout: void
updateSinger: string
setAdminStatus: boolean

// Controller Actions
setController: Controller
updateSongs: Record<string, Song>
updateQueue: Record<string, QueueItem>
updateFavorites: Record<string, Song>
updateHistory: Record<string, Song>
updateTopPlayed: Record<string, TopPlayed>
clearError: void
resetController: void
```

---

## 25. Service Layer API Specifications

### **Controller Service:**
```typescript
controllerService.getController(controllerName: string): Promise<Controller | null>
- Validates: controllerName is non-empty string
- Returns: Complete controller object or null if not exists
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

controllerService.setController(controllerName: string, data: Controller): Promise<void>
- Validates: controllerName and data are provided
- Action: Overwrites entire controller object
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

controllerService.updateController(controllerName: string, updates: Partial<Controller>): Promise<void>
- Validates: controllerName and updates are provided
- Action: Updates specific parts of controller
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

controllerService.subscribeToController(controllerName: string, callback: (data: Controller | null) => void): () => void
- Validates: controllerName and callback are provided
- Action: Sets up real-time listener
- Returns: Unsubscribe function
- Throws: Error if listener setup fails
- Timeout: None (Firebase handles)
```

### **Queue Service:**
```typescript
queueService.addToQueue(controllerName: string, queueItem: Omit<QueueItem, 'key'>): Promise<{ key: string }>
- Validates: controllerName, queueItem with required fields
- Calculates: Next sequential key (Math.max(existingKeys) + 1)
- Action: Adds item to queue with sequential key
- Returns: { key: string } with the new key
- Throws: Error if validation fails or Firebase operation fails
- Timeout: None (Firebase handles)

queueService.removeFromQueue(controllerName: string, queueItemKey: string): Promise<void>
- Validates: controllerName and queueItemKey are provided
- Action: Removes item from queue
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

queueService.updateQueueItem(controllerName: string, queueItemKey: string, updates: Partial<QueueItem>): Promise<void>
- Validates: controllerName, queueItemKey, and updates are provided
- Action: Updates specific fields of queue item
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

queueService.cleanupQueueKeys(controllerName: string): Promise<void>
- Validates: controllerName is provided
- Action: Migrates push ID keys to sequential numerical keys
- Logic: Find non-numerical keys, assign sequential keys, update atomically
- Returns: void
- Throws: Error if migration fails
- Timeout: None (Firebase handles)

queueService.subscribeToQueue(controllerName: string, callback: (data: Record<string, QueueItem>) => void): () => void
- Validates: controllerName and callback are provided
- Action: Sets up real-time listener for queue changes
- Returns: Unsubscribe function
- Throws: Error if listener setup fails
- Timeout: None (Firebase handles)
```

### **Disabled Songs Service:**
```typescript
disabledSongsService.generateSongKey(songPath: string): string
- Validates: songPath is non-empty string
- Algorithm: Simple hash function ((hash << 5) - hash) + charCodeAt(i)
- Returns: Base36 string for Firebase-safe key
- Throws: None (pure function)

disabledSongsService.addDisabledSong(controllerName: string, song: Song): Promise<void>
- Validates: controllerName, song.path, song.artist, song.title
- Action: Adds song to disabled list with hash key
- Returns: void
- Throws: Error if validation fails or Firebase operation fails
- Timeout: 10 seconds

disabledSongsService.removeDisabledSong(controllerName: string, songPath: string): Promise<void>
- Validates: controllerName and songPath are provided
- Action: Removes song from disabled list
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: 10 seconds

disabledSongsService.isSongDisabled(controllerName: string, songPath: string): Promise<boolean>
- Validates: controllerName and songPath are provided
- Action: Checks if song is in disabled list
- Returns: boolean
- Throws: Error if Firebase operation fails
- Timeout: 10 seconds

disabledSongsService.getDisabledSongs(controllerName: string): Promise<Record<string, DisabledSong>>
- Validates: controllerName is provided
- Action: Gets all disabled songs
- Returns: Record of disabled songs
- Throws: Error if Firebase operation fails
- Timeout: 10 seconds

disabledSongsService.getDisabledSongPaths(controllerName: string): Promise<Set<string>>
- Validates: controllerName is provided
- Action: Gets disabled song paths as Set for fast lookup
- Returns: Set of disabled song paths
- Throws: Error if Firebase operation fails
- Timeout: 10 seconds

disabledSongsService.subscribeToDisabledSongs(controllerName: string, callback: (data: Record<string, DisabledSong>) => void): () => void
- Validates: controllerName and callback are provided
- Action: Sets up real-time listener for disabled songs
- Returns: Unsubscribe function
- Throws: Error if listener setup fails
- Timeout: None (Firebase handles)
```

### **Singer Service:**
```typescript
singerService.addSinger(controllerName: string, singerName: string): Promise<{ key: string }>
- Validates: controllerName and singerName are non-empty, trimmed
- Checks: Case-insensitive duplicate prevention
- Action: Adds singer with current timestamp
- Returns: { key: string } with Firebase push key
- Throws: Error if validation fails, duplicate exists, or Firebase operation fails
- Timeout: None (Firebase handles)

singerService.removeSinger(controllerName: string, singerName: string): Promise<void>
- Validates: controllerName and singerName are provided
- Action: Removes singer and their queue items
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

singerService.subscribeToSingers(controllerName: string, callback: (data: Record<string, Singer>) => void): () => void
- Validates: controllerName and callback are provided
- Action: Sets up real-time listener for singers
- Returns: Unsubscribe function
- Throws: Error if listener setup fails
- Timeout: None (Firebase handles)
```

### **Player Service:**
```typescript
playerService.updatePlayerStateValue(controllerName: string, state: PlayerState): Promise<void>
- Validates: controllerName and state are provided
- Action: Updates player state
- Returns: void
- Throws: Error if Firebase operation fails
- Timeout: None (Firebase handles)

playerService.subscribeToPlayerState(controllerName: string, callback: (data: Player) => void): () => void
- Validates: controllerName and callback are provided
- Action: Sets up real-time listener for player state
- Returns: Unsubscribe function
- Throws: Error if listener setup fails
- Timeout: None (Firebase handles)
```

---

## 26. Component Architecture Specifications

### **SongItem Component:**
```typescript
interface SongItemProps {
  song: Song;
  context: 'search' | 'queue' | 'history' | 'favorites' | 'topPlayed' | 'newSongs';
  onAddToQueue?: (song: Song) => void;
  onRemoveFromQueue?: (queueItem: QueueItem) => void;
  onToggleFavorite?: (song: Song) => void;
  onDelete?: (song: Song) => void;
  onSelectSinger?: (song: Song) => void;
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

Event Flow:
1. User clicks action button
2. Component calls prop function (e.g., onAddToQueue)
3. Hook handles business logic (useSongOperations)
4. Service updates Firebase (queueService.addToQueue)
5. Real-time listener updates Redux
6. Component re-renders with new data
7. Toast notification shows success/error
```

### **InfiniteScrollList Component:**
```typescript
interface InfiniteScrollListProps {
  items: any[];
  context: 'search' | 'queue' | 'history' | 'favorites' | 'topPlayed' | 'newSongs';
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  renderItem: (item: any, index: number) => React.ReactNode;
  className?: string;
  debug?: boolean;
}

Behavior:
1. Renders items with renderItem function
2. Shows loading spinner when isLoading && items.length === 0
3. Shows empty state when items.length === 0 && !isLoading
4. Shows load more trigger when hasMore && items.length > 0
5. Uses Intersection Observer to detect when user scrolls to bottom 10%
6. Calls onLoadMore when trigger is visible
7. Cleans up observer on unmount
```

### **ActionButton Component:**
```typescript
interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: string;
  className?: string;
}

Behavior:
1. Renders button with variant styling
2. Shows icon if provided
3. Disables button when disabled prop is true
4. Calls onClick when clicked
5. Supports different sizes and variants
```

### **PlayerControls Component:**
```typescript
interface PlayerControlsProps {
  className?: string;
  variant?: 'light' | 'dark';
}

Behavior:
1. Only renders for admin users (selectIsAdmin)
2. Shows current player state with color-coded badge
3. Play button: disabled when queue is empty
4. Pause button: only shown when playing
5. Stop button: only shown when playing or paused
6. Calls playerService.updatePlayerStateValue on button clicks
7. Shows success/error toasts for feedback
```

### **Component Hierarchy:**
```
App
├── ErrorBoundary
├── FirebaseProvider
├── Router
├── AuthInitializer
├── Layout
│   ├── Navigation
│   └── Routes
│       ├── Search
│       │   └── InfiniteScrollList
│       │       └── SongItem
│       ├── Queue
│       │   ├── PlayerControls
│       │   └── InfiniteScrollList
│       │       └── SongItem
│       ├── Favorites
│       │   └── InfiniteScrollList
│       │       └── SongItem
│       ├── History
│       │   └── InfiniteScrollList
│       │       └── SongItem
│       ├── TopPlayed
│       │   └── InfiniteScrollList
│       │       └── SongItem
│       ├── NewSongs
│       │   └── InfiniteScrollList
│       │       └── SongItem
│       ├── Artists
│       │   └── ArtistModal
│       ├── SongLists
│       │   └── SongListModal
│       ├── Singers
│       └── Settings
└── Toast (global)
```

---

## 27. Error Handling Matrix

### **Network Errors:**
```
Firebase Connection Lost:
- Detection: onValue error callback
- Action: Show connection status indicator
- Recovery: Automatic retry with exponential backoff
- User Feedback: "Connection lost. Retrying..."

Firebase Timeout (10s):
- Detection: Promise.race with timeout
- Action: Show error toast
- Recovery: Allow manual retry
- User Feedback: "Operation timed out. Please try again."

Network Unavailable:
- Detection: navigator.onLine or fetch error
- Action: Show offline indicator
- Recovery: Queue operations for when online
- User Feedback: "You're offline. Changes will sync when connected."
```

### **Validation Errors:**
```
Party ID Invalid:
- Detection: Firebase get() returns null
- Action: Show error message
- Recovery: Allow user to retry
- User Feedback: "Invalid Party Id. Please check your Party Id and try again."

Singer Name Empty:
- Detection: singerName.trim().length === 0
- Action: Highlight input field
- Recovery: Prevent form submission
- User Feedback: "Singer name cannot be empty"

Singer Already Exists:
- Detection: Case-insensitive name comparison
- Action: Show error toast
- Recovery: Allow user to choose different name
- User Feedback: "Singer already exists"

Required Fields Missing:
- Detection: Check for undefined/null values
- Action: Highlight missing fields
- Recovery: Prevent operation
- User Feedback: "Please fill in all required fields"
```

### **Permission Errors:**
```
Admin Action by Non-Admin:
- Detection: selectIsAdmin === false
- Action: Hide admin-only UI elements
- Recovery: Show permission error
- User Feedback: "Only admins can perform this action"

Delete During Playback:
- Detection: playerState.state === 'playing'
- Action: Disable delete buttons
- Recovery: Allow delete when stopped/paused
- User Feedback: "Cannot delete while playing"
```

### **Concurrent Conflicts:**
```
Queue Reorder Conflict:
- Detection: Order values don't match expected sequence
- Action: Auto-fix order values
- Recovery: Update all items with sequential order
- User Feedback: "Queue order has been corrected"

Singer Add Conflict:
- Detection: Duplicate name (case-insensitive)
- Action: Prevent addition
- Recovery: Show error message
- User Feedback: "Singer already exists"

Settings Change Conflict:
- Detection: Multiple users changing settings simultaneously
- Action: Last write wins
- Recovery: Show conflict notification
- User Feedback: "Settings updated by another user"
```

### **Data Corruption:**
```
Invalid Queue Order:
- Detection: Order values not sequential (1, 2, 3, ...)
- Action: Auto-fix order values
- Recovery: Update all items with correct order
- User Feedback: "Queue order has been corrected"

Missing Required Fields:
- Detection: Required fields are undefined/null
- Action: Use default values or skip item
- Recovery: Log error and continue
- User Feedback: "Some data could not be loaded"

Invalid Firebase Keys:
- Detection: Non-numerical keys in queue
- Action: Run cleanupQueueKeys()
- Recovery: Migrate to sequential keys
- User Feedback: "Queue has been updated"
```

---

## 28. Performance Specifications

### **Memoization Rules:**
```typescript
// Redux Selectors (Always Memoize)
selectSongsArray: createSelector([selectSongs], (songs) => 
  sortSongsByArtistAndTitle(objectToArray(songs))
)

selectQueueWithUserInfo: createSelector([selectQueue, selectCurrentSinger], (queue, currentSinger) => 
  addUserInfoToQueue(queue, currentSinger)
)

// Component Props (Memoize Expensive Calculations)
const filteredSongs = useMemo(() => 
  filterSongs(allSongs, searchTerm, disabledSongPaths), 
  [allSongs, searchTerm, disabledSongPaths]
)

// Event Handlers (Use useCallback for Async Operations)
const handleAddToQueue = useCallback(async (song: Song) => {
  await addToQueue(song);
}, [addToQueue]);

const handleRemoveFromQueue = useCallback(async (queueItem: QueueItem) => {
  await removeFromQueue(queueItem);
}, [removeFromQueue]);
```

### **Bundle Splitting Strategy:**
```typescript
// Route-based Splitting
const Search = lazy(() => import('./features/Search/Search'));
const Queue = lazy(() => import('./features/Queue/Queue'));
const Favorites = lazy(() => import('./features/Favorites/Favorites'));
const History = lazy(() => import('./features/History/History'));
const TopPlayed = lazy(() => import('./features/TopPlayed/Top100'));
const NewSongs = lazy(() => import('./features/NewSongs/NewSongs'));
const Artists = lazy(() => import('./features/Artists/Artists'));
const SongLists = lazy(() => import('./features/SongLists/SongLists'));
const Singers = lazy(() => import('./features/Singers/Singers'));
const Settings = lazy(() => import('./features/Settings/Settings'));

// Component-based Splitting
const ArtistModal = lazy(() => import('./components/common/ArtistModal'));
const SongListModal = lazy(() => import('./components/common/SongListModal'));

// Vendor Splitting
// Third-party libraries (Ionic, Firebase) in separate chunks
```

### **Virtual Scrolling (Future Implementation):**
```typescript
// For lists with 1000+ items
interface VirtualScrollConfig {
  itemHeight: number;
  overscan: number;
  containerHeight: number;
}

// Only render visible items + buffer
const visibleItems = items.slice(startIndex, endIndex + overscan);
```

### **Image Optimization:**
```typescript
// Lazy load images
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);
  
  return (
    <div>
      {!isLoaded && <Skeleton />}
      {isInView && <img src={src} alt={alt} {...props} />}
    </div>
  );
};
```

### **Firebase Optimization:**
```typescript
// Specific node subscriptions instead of full controller
const queueRef = ref(database, `controllers/${controllerName}/player/queue`);
const favoritesRef = ref(database, `controllers/${controllerName}/favorites`);

// Batch operations for multiple updates
const updates = {};
updates[`controllers/${controllerName}/player/queue/${key1}`] = item1;
updates[`controllers/${controllerName}/player/queue/${key2}`] = item2;
await update(ref(database), updates);
```

### **Memory Management:**
```typescript
// Cleanup listeners on unmount
useEffect(() => {
  const unsubscribe = subscribeToQueue(controllerName, callback);
  return () => unsubscribe();
}, [controllerName]);

// Cleanup observers
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(element);
  return () => observer.disconnect();
}, []);
```

---

## 29. Implementation Guide for New Projects

### **Quick Start Questions for Implementation:**

When starting a new implementation, ask these questions to determine the approach:

#### **1. Platform Target:**
- **Web:** Browser-based application
- **iOS:** Native iOS app (Swift/SwiftUI)
- **Android:** Native Android app (Kotlin/Jetpack Compose)
- **Cross-platform:** Single codebase for multiple platforms (Flutter, React Native)

#### **2. Framework Choice (Based on Platform):**
- **Web:** React, Vue, Svelte, Angular
- **iOS:** SwiftUI, UIKit
- **Android:** Jetpack Compose, Views
- **Cross-platform:** Flutter, React Native

#### **3. State Management:**
- **Centralized:** Redux, Zustand, Pinia, Jotai
- **Local:** React Context, Vue Composition API
- **Platform-specific:** SwiftUI @State, Jetpack Compose StateFlow

#### **4. UI Framework:**
- **Web:** Ionic, Chakra UI, Material UI, Ant Design
- **Native:** Platform-specific components
- **Cross-platform:** Framework-specific UI libraries

#### **5. Backend/Data:**
- **Firebase:** Realtime Database, Firestore
- **Supabase:** PostgreSQL with real-time
- **AWS:** AppSync, DynamoDB
- **Custom:** REST API with WebSockets

#### **6. Build Tool:**
- **Web:** Vite, Webpack, Parcel
- **iOS:** Xcode
- **Android:** Android Studio
- **Cross-platform:** Framework-specific tools

#### **7. Styling:**
- **Web:** Tailwind CSS, CSS Modules, Styled Components
- **Native:** Platform-specific styling
- **Cross-platform:** Framework-specific styling

### **Implementation Checklist:**

#### **Phase 1: Project Setup**
- [ ] Create project with chosen framework/tools
- [ ] Set up Firebase/backend configuration
- [ ] Configure state management
- [ ] Set up routing/navigation
- [ ] Configure build tools and deployment

#### **Phase 2: Core Architecture**
- [ ] Implement service layer (all Firebase operations)
- [ ] Set up state management (Redux slices/selectors)
- [ ] Create base components (SongItem, ActionButton, etc.)
- [ ] Implement authentication flow
- [ ] Set up real-time sync

#### **Phase 3: Feature Implementation**
- [ ] Search functionality with disabled songs filtering
- [ ] Queue management with sequential keys
- [ ] Favorites system
- [ ] History tracking
- [ ] Top played with cloud functions
- [ ] Singer management
- [ ] Player controls
- [ ] Settings and disabled songs
- [ ] Artists and song lists

#### **Phase 4: Error Handling & Performance**
- [ ] Implement error handling matrix
- [ ] Add performance optimizations
- [ ] Set up bundle splitting
- [ ] Add loading states and empty states
- [ ] Implement infinite scroll

#### **Phase 5: Testing & Polish**
- [ ] Test all business logic
- [ ] Verify real-time sync
- [ ] Test error scenarios
- [ ] Performance testing
- [ ] UI/UX polish

### **Key Implementation Notes:**

#### **Must Preserve (Regardless of Framework):**
- **Business Logic:** All validation rules, calculations, and data flows
- **Service Layer:** All Firebase operations with exact signatures
- **State Structure:** Same data organization and relationships
- **Error Handling:** All error scenarios and recovery strategies
- **Performance:** Memoization, bundle splitting, and optimization patterns

#### **Can Replace (Framework-Specific):**
- **UI Components:** Replace with framework-equivalent components
- **State Management Library:** Replace Redux with framework-appropriate solution
- **Styling:** Replace Tailwind with framework-appropriate styling
- **Build Tools:** Replace Vite with framework-appropriate build system

#### **Critical Success Factors:**
- **Follow data flow diagrams exactly**
- **Implement all service functions with exact signatures**
- **Maintain same state structure and relationships**
- **Handle all error scenarios from the matrix**
- **Preserve all business logic and validation rules**

---

## 20. Third-Party UI Library - Ionic React

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

## 21. Design Assets & Visual Reference

### **Design Assets Location:**
The `/docs/design/` folder contains comprehensive UI/UX mockups and visual references for different platforms and features.

### **Current Web Design Assets:**
Located in `/docs/design/web/` with 30+ mockups covering all features:

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

### **Future Platform Design Structure:**
```
design/
├── web/          # Current web mockups (30+ files)
├── ios/          # Future iOS designs (SwiftUI/UIKit)
├── android/      # Future Android designs (Jetpack Compose/Views)
├── tablet/       # Future tablet designs (iPad/Android tablets)
└── desktop/      # Future desktop designs (Windows/macOS)
```

### **Design Asset Guidelines:**
- **Reference during implementation** for visual accuracy
- **Understand UX patterns** and interaction flows
- **Guide UI component design** and layout decisions
- **Ensure consistency** across different implementations
- **Validate feature completeness** against visual requirements

### **Important Note About Current Web Mockups:**
The web mockups were created using an **older version of Ionic** and may not reflect the current Ionic React component API or styling. However, they serve as valuable reference for:

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

## 22. Development Setup & Configuration

