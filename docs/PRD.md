# Karaoke App - Product Requirements Document

> **Platform-Agnostic Business Logic & Firebase Architecture**  
> **For implementation details, see platform-specific PRDs in `platforms/` folder**

This document defines the **core business logic, data models, and Firebase architecture** for the Karaoke App. All platform-specific implementation details are documented in separate platform PRDs.

---

## How to Use This PRD

### **For AI-Assisted Development:**
1. **Read this PRD completely** for core business logic and Firebase structure
2. **Choose your platform** and read the corresponding platform PRD:
   - **Web:** `platforms/web/PRD-web.md`
   - **iOS:** `platforms/ios/PRD-ios.md` (future)
   - **Android:** `platforms/android/PRD-android.md` (future)
3. **Follow the implementation guide** in Section 29
4. **Reference design assets** in the platform-specific design folder

### **For Human Developers:**
- **Reference during implementation** for business logic and data flows
- **Guide for architecture decisions** and technology choices
- **Source of truth** for all functional requirements
- **Migration guide** when switching frameworks/platforms

---

## 1. Purpose

This document defines the functional, technical, and UX requirements for the Karaoke App, designed for **in-home party use**. The app leverages **Firebase Realtime Database** for real-time synchronization, with all business logic and validation handled **client-side**.

### **Core Principles:**
- **Platform-Agnostic Design** - Core requirements work on any platform
- **Real-time Synchronization** - All clients stay in sync via Firebase
- **Client-Side Business Logic** - All validation and rules enforced in app
- **Single Session Focus** - Designed for one-party-at-a-time use
- **Admin/User Role System** - Different permissions for different users

---

## 2. Scope & Business Objectives

### **Primary Goals:**
- Deliver a single-session karaoke experience where users connect to a controller and manage/search songs
- Utilize Firebase for real-time multi-user synchronization of queues, history, and playback state
- Prioritize fast performance, reusable modular architecture, and clear business logic separation
- Enable adding songs from multiple entry points (search, history, top played, favorites, new songs, artists, song lists)
- Ensure graceful handling of Firebase sync issues using retry patterns and partial node updates

### **Architecture Principles:**
- **True Separation of Concerns** - UI components only handle presentation
- **Reusable Business Logic** - Business rules implemented in platform-agnostic services
- **Testable Code** - Business logic separated from UI for easy testing
- **Maintainability** - Changes to logic don't affect UI
- **Performance** - Optimized data access and state management
- **Type Safety** - Strong typing throughout the codebase
- **Single Responsibility** - Each file has one clear purpose

---

## 3. User Roles & Permissions

### **Core Requirements (Platform-Agnostic):**

#### **Two User Roles:**
1. **Host/Admin** - Full control over the karaoke session
2. **Singer/User** - Can add songs and view content

#### **Admin Permissions:**
- **Queue Management** - Reorder or delete queue items
- **Playback Control** - Play, pause, stop the music
- **Singer Management** - Add or remove singers
- **Settings Access** - Change player settings (autoadvance, userpick)
- **Song Management** - Disable or enable songs

#### **User Permissions:**
- **Add Songs** - Add songs to queue from any source
- **View Content** - Browse songs, history, favorites, etc.
- **Manage Favorites** - Add/remove personal favorites

#### **Business Rules:**
- **First Queue Item Protection** - Cannot be deleted while playing (only when stopped/paused)
- **Automatic Singer Addition** - Singers are automatically added to the list when they join
- **Admin Access Control** - Admin mode is a privileged state (see platform details for implementation)

#### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#authentication` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#authentication` (future)
- **Android:** See `platforms/android/PRD-android.md#authentication` (future)

---

## 4. Feature Overview

### **Authentication & Session Management**
**Requirements (Platform-Agnostic):**
- Login requires both Party ID and singer name
- Party ID is validated against the backend before login is allowed
- Authentication state is managed in the app state and lost on app reload (unless platform supports persistence)
- Admin access is a privileged mode (see platform details for implementation)

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#authentication` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#authentication` (future)
- **Android:** See `platforms/android/PRD-android.md#authentication` (future)

### **Search**
**Requirements (Platform-Agnostic):**
- Local search on preloaded song catalog
- Instant search results as user types
- Paginated/infinite scroll results
- Context actions for each song (add to queue, favorite, etc.)

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#search` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#search` (future)
- **Android:** See `platforms/android/PRD-android.md#search` (future)

### **Queue Management**
**Requirements (Platform-Agnostic):**
- Shared queue synchronized across all clients
- Queue items must always use sequential numerical keys (0, 1, 2, ...)
- The system must automatically fix any inconsistencies in order values or keys on every update
- Queue reordering must be atomic; when two items are swapped, both order values are updated in a single operation
- Only admins can reorder or delete queue items, and only when playback is stopped or paused
- Duplicate songs are prevented in the queue by checking the song's `path`
- Each queue item shows which singer added it

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#queue-management` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#queue-management` (future)
- **Android:** See `platforms/android/PRD-android.md#queue-management` (future)

### **Favorites**
**Requirements (Platform-Agnostic):**
- Shared favorites list synchronized across all clients
- Anyone can add/remove favorites
- Duplicate prevention by song `path`
- Paginated/infinite scroll display

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#favorites` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#favorites` (future)
- **Android:** See `platforms/android/PRD-android.md#favorites` (future)

### **New Songs**
**Requirements (Platform-Agnostic):**
- Shows recently added songs from the `newSongs` node
- Real-time updates and infinite scroll
- **Data Format Support**: Handles both full song objects and path-only references
- **Reverse Lookup**: Automatically resolves song paths to full song objects from main catalog
- **Backward Compatibility**: Works with both old and new data formats

**Implementation Details:**
- **Format Detection**: Automatically detects whether `newSongs` contains full song objects or path-only references
- **Reverse Lookup**: When path-only data is detected, performs lookup against main songs catalog
- **Error Resilience**: Gracefully handles missing songs without breaking the UI
- **Debug Logging**: Provides detailed logging for troubleshooting missing songs

**Data Formats Supported:**
1. **New Format**: `{ path: "song_path", key: "firebase_key" }` → Performs reverse lookup
2. **Old Format**: Full song objects with `artist`, `title`, `path`, etc. → Uses as-is

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#new-songs` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#new-songs` (future)
- **Android:** See `platforms/android/PRD-android.md#new-songs` (future)

### **Artists**
**Requirements (Platform-Agnostic):**
- Browse songs by artist with search functionality
- Modal view for all songs by an artist
- Song count per artist
- Paginated/infinite scroll artist list

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#artists` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#artists` (future)
- **Android:** See `platforms/android/PRD-android.md#artists` (future)

### **Song Lists**
**Requirements (Platform-Agnostic):**
- Predefined song lists with themes/collections
- Song matching to catalog
- Expandable view for available versions
- Modal interface for viewing list contents
- Shows which songs are available in the catalog

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#song-lists` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#song-lists` (future)
- **Android:** See `platforms/android/PRD-android.md#song-lists` (future)

### **History Tracking**
**Requirements (Platform-Agnostic):**
- Songs automatically added to history when played
- Shows when each song was last played
- Append-only, shared across all clients
- Paginated/infinite scroll display

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#history` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#history` (future)
- **Android:** See `platforms/android/PRD-android.md#history` (future)

### **Top Played**
**Requirements (Platform-Agnostic):**
- Popular songs generated by backend based on history
- Shows play count for each song
- Real-time updates and infinite scroll

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#top-played` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#top-played` (future)
- **Android:** See `platforms/android/PRD-android.md#top-played` (future)

### **Singer Management**
**Requirements (Platform-Agnostic):**
- Only admins can add or remove singers
- Singer names must be unique and non-empty
- Singers are automatically added to the list when they join
- All users can view the current singers list
- Tracks when each singer last joined

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#singer-management` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#singer-management` (future)
- **Android:** See `platforms/android/PRD-android.md#singer-management` (future)

### **Playback Control**
**Requirements (Platform-Agnostic):**
- Only admins can control playback (play, pause, stop)
- Play button is disabled if the queue is empty
- UI state (play/pause/stop) must reflect the current player state

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#playback-control` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#playback-control` (future)
- **Android:** See `platforms/android/PRD-android.md#playback-control` (future)

### **Error Handling & Sync**
**Requirements (Platform-Agnostic):**
- Graceful handling of sync failures with retry patterns
- Full controller object loaded on initial connection
- Incremental updates target specific child nodes
- Real-time connection status monitoring
- Graceful handling of missing or empty data

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#error-handling` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#error-handling` (future)
- **Android:** See `platforms/android/PRD-android.md#error-handling` (future)

### **Disabled Songs**
**Requirements (Platform-Agnostic):**
- Admins can disable or enable songs
- Disabled songs are stored using a hash of the song path for key safety

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#disabled-songs` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#disabled-songs` (future)
- **Android:** See `platforms/android/PRD-android.md#disabled-songs` (future)

### **Settings**
**Requirements (Platform-Agnostic):**
- Only admins can change player settings (autoadvance, userpick)

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#settings` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#settings` (future)
- **Android:** See `platforms/android/PRD-android.md#settings` (future)

### **Navigation**
**Requirements (Platform-Agnostic):**
- Admin-only pages (e.g., settings) must be hidden from non-admin users

**Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#navigation` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#navigation` (future)
- **Android:** See `platforms/android/PRD-android.md#navigation` (future)

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

### **Complete Structure:**
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

### **Data Flow:**
- **Initial Sync:** Loads the complete `controller` object on connection
- **Real-time Updates:** Subscribes to specific nodes for incremental updates
- **Key Management:** Uses sequential numerical keys for queue items
- **Auto-initialization:** Creates empty controller structure if none exists

### **Empty Controller Structure:**
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

### **Key Generation Rules:**
- **Queue Items:** Sequential numerical keys (0, 1, 2, ...)
- **Top Played:** `sanitizedArtist_sanitizedTitle` (lowercase, trimmed, invalid chars replaced with `_`)
- **Disabled Songs:** Hash of song path (simple character-based hash)
- **Singers:** Firebase push IDs (auto-generated)

### **Character Sanitization for Top Played Keys:**
- Replace invalid Firebase characters `[.#$/[\]]` with `_`
- Convert to lowercase and trim whitespace
- Format: `${sanitizedArtist}_${sanitizedTitle}`

---

## 7. UI/UX Behavior

### **Core Requirements (Platform-Agnostic):**
- **Responsive design** that works on all device sizes
- **Support for light/dark mode** themes
- **Modern, clean, intuitive interface** with consistent styling
- **Accessibility support** (keyboard navigation, screen readers)
- **Tab-based navigation** with clear active states
- **Consistent empty state views** for all lists
- **Loading states** with spinner animations
- **Toast notifications** for success/error feedback
- **Consistent button styling** with variants
- **Reusable song display** with context-aware actions
- **Infinite scroll** for automatic loading of additional content
- **Context-specific behavior** for different screens (search, queue, history, etc.)
- **Admin-specific UI elements** (playback controls, queue reorder, singer management)

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#uiux-behavior` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#uiux-behavior` (future)
- **Android:** See `platforms/android/PRD-android.md#uiux-behavior` (future)

---

## 8. UI Rules & Constraints

### **Core Requirements (Platform-Agnostic):**

#### **Queue Management Rules:**
- Only admin users can reorder queue items
- First queue item cannot be deleted while playing (only when stopped/paused)
- Reorder constraints: items not at top/bottom can move up/down
- Queue items must maintain sequential order (1, 2, 3, etc.)
- Automatic cleanup of inconsistent order values on queue initialization
- Queue items use sequential numerical keys (0, 1, 2, etc.)

#### **Playback Control Rules:**
- Player controls only visible to admin users
- Play button is disabled when queue is empty
- State-based controls: play/pause/stop buttons shown/hidden based on current state
- Current player state must be clearly displayed

#### **Search Rules:**
- Search only activates after 2+ characters
- Debounce delay before search execution
- Search scope includes both song title and artist fields (case-insensitive)
- Empty search shows all songs
- Search resets to page 1 when search term changes

#### **Pagination & Infinite Scroll Rules:**
- 20 items loaded per page
- Load more logic only shows when there are more items than currently displayed
- Triggers load more when user scrolls to bottom 10% of list
- Each feature maintains its own page state independently
- All lists must use pagination to prevent UI blocking
- Progressive loading of items as user scrolls
- Loading state management with spinner when no items are loaded yet
- Page reset on search term changes
- Memory optimization for smooth scrolling
- Error handling for load more failures
- Accessibility support for infinite scroll

#### **Toast Notification Rules:**
- Duration settings: Success/Info 3 seconds, Error 5 seconds
- Auto-dismiss after duration
- Manual dismiss option
- Multiple toasts can be displayed simultaneously

#### **Authentication Rules:**
- Admin access is a privileged mode (see platform details for implementation)
- Session persistence behavior varies by platform
- Both Party ID and singer name required for login

#### **Data Display Rules:**
- Loading states with spinner when data count is 0
- Empty states when data exists but filtered results are empty
- Debug information display for development
- User attribution indicators for current user's queue items
- Availability status for unmatched song list items

#### **Action Button Rules:**
- Context-based actions for different screens
- Permission-based visibility based on user role
- State-based disabling of buttons
- Confirmation feedback for all actions

#### **Modal & Overlay Rules:**
- Modal views for artist songs and song lists
- Proper backdrop and close actions

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#ui-rules` for React/Ionic implementation details
- **iOS:** See `platforms/ios/PRD-ios.md#ui-rules` (future)
- **Android:** See `platforms/android/PRD-android.md#ui-rules` (future)

### **Error Handling Rules:**
- **Graceful Degradation:** App continues to work with cached data during connection issues
- **User Feedback:** Clear error messages with recovery options
- **Retry Logic:** Automatic retry for failed Firebase operations
- **Fallback Values:** Default values provided for missing or corrupted data

### **Performance Rules:**
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

---

## 9. Codebase Organization & File Structure

### **Platform-Agnostic Architecture:**
- **Business Logic Layer** - Core rules and validation
- **Data Access Layer** - Firebase operations and data management
- **State Management Layer** - Application state and synchronization
- **UI Layer** - Platform-specific presentation components

### **Required Separation:**
- **UI Components** only handle presentation
- **Business Logic** implemented in platform-agnostic services
- **Data Models** shared across all layers
- **Firebase Integration** abstracted through service layer

### **Architecture Principles:**
- **Separation of Concerns** - UI components handle presentation, business logic in services
- **Reusable Business Logic** - Business rules implemented in platform-agnostic services
- **Testable Code** - Business logic separated from UI for easy testing
- **Maintainability** - Changes to logic don't affect UI
- **Performance** - Optimized data access and state management
- **Type Safety** - Strong typing throughout the codebase
- **Single Responsibility** - Each file has one clear purpose

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#codebase-organization` for React/Ionic structure
- **iOS:** See `platforms/ios/PRD-ios.md#codebase-organization` (future)
- **Android:** See `platforms/android/PRD-android.md#codebase-organization` (future)

---

## 10. External Reference Files

| File | Purpose |
|------|---------|
| [`types.ts`](./types.ts) | Core TypeScript interfaces for data models |
| [`firebase_schema.json`](./firebase_schema.json) | Complete Firebase database structure |
| `platforms/web/PRD-web.md` | Web-specific implementation details |
| `platforms/web/design/` | Web UI/UX design assets |

---

## 11. Data Access Model & Validation

### **Client-Controlled Access Model:**
- **No server-side validation** - all rules enforced client-side
- **Firebase security rules** allow full read/write access
- **Data validation** against TypeScript interfaces before Firebase writes
- **Business logic** implemented in application layer

### **Validation Requirements:**
- ✅ **Data validation** against TypeScript interfaces before Firebase writes
- ✅ **Required field validation** for all critical operations
- ✅ **Duplicate prevention** using song path field
- ✅ **Order validation** for queue items
- ✅ **Permission validation** for admin-only operations

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#data-access` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#data-access` (future)
- **Android:** See `platforms/android/PRD-android.md#data-access` (future)

---

## 12. Performance & Optimization

### **Core Performance Requirements:**
- **Real-time synchronization** with minimal latency
- **Efficient data loading** with pagination and infinite scroll
- **Optimized state management** to prevent unnecessary re-renders
- **Caching strategy** for frequently accessed data
- **Memory management** for large datasets

### **Performance Requirements:**
- **Real-time synchronization** with minimal latency
- **Efficient data loading** with pagination and infinite scroll
- **Optimized state management** to prevent unnecessary re-renders
- **Caching strategy** for frequently accessed data
- **Memory management** for large datasets
- **Component optimization** for expensive UI operations
- **Data filtering and search** with efficient algorithms

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#performance` for React/Ionic optimization
- **iOS:** See `platforms/ios/PRD-ios.md#performance` (future)
- **Android:** See `platforms/android/PRD-android.md#performance` (future)

---

## 13. Error Handling & Resilience

### **Core Error Handling:**
- **Firebase Connection:** Graceful handling of connection issues
- **Data Sync:** Retry patterns for failed operations
- **User Feedback:** Clear error messages with recovery options
- **Graceful Degradation:** App continues to work with cached data

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#error-handling` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#error-handling` (future)
- **Android:** See `platforms/android/PRD-android.md#error-handling` (future)

---

## 14. Testing Strategy

### **Core Testing Requirements:**
- **Unit Testing:** Business logic and data validation
- **Integration Testing:** Firebase operations and data flow
- **UI Testing:** User interactions and state changes
- **Performance Testing:** Real-time sync and data loading

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#testing` for React/Ionic testing
- **iOS:** See `platforms/ios/PRD-ios.md#testing` (future)
- **Android:** See `platforms/android/PRD-android.md#testing` (future)

---

## 15. Deployment & Environment

### **Core Deployment Requirements:**
- **Environment Configuration:** Firebase project setup
- **Build Process:** Platform-specific build tools
- **Environment Variables:** Configuration management
- **Deployment Targets:** Platform-specific deployment

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#deployment` for React/Ionic deployment
- **iOS:** See `platforms/ios/PRD-ios.md#deployment` (future)
- **Android:** See `platforms/android/PRD-android.md#deployment` (future)

---

## 16. Firebase Implementation Patterns

### **Key Management & Data Structure:**
- **Sequential Keys:** Queue items use sequential numerical keys (0, 1, 2, ...)
- **Auto-initialization:** Empty controller structure created if none exists
- **Key Cleanup:** Inconsistent keys automatically migrated to sequential format
- **Order Validation:** Queue order automatically fixed on every update

### **Real-time Synchronization:**
- **Initial Load:** Complete controller object loaded on connection
- **Incremental Updates:** Specific child nodes updated for efficiency
- **Connection Monitoring:** Real-time connection status tracking
- **Retry Logic:** Automatic retry for failed operations

### **Data Validation:**
- **Type Safety:** All data validated against TypeScript interfaces
- **Required Fields:** Critical fields validated before Firebase writes
- **Duplicate Prevention:** Songs identified by path field
- **Order Validation:** Queue order automatically fixed

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#firebase-patterns` for React/Ionic implementation
- **iOS:** See `platforms/ios/PRD-ios.md#firebase-patterns` (future)
- **Android:** See `platforms/android/PRD-android.md#firebase-patterns` (future)

---

## 17. Critical Implementation Notes

### **DO NOT CHANGE These Patterns:**
- **Sequential Queue Keys:** Must always use 0, 1, 2, ... for queue items
- **Firebase Structure:** Controller object structure must remain unchanged
- **Data Validation:** All data must be validated against TypeScript interfaces
- **Business Logic:** Core rules must be enforced client-side
- **Real-time Sync:** All clients must stay synchronized via Firebase

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#critical-notes` for React/Ionic specifics
- **iOS:** See `platforms/ios/PRD-ios.md#critical-notes` (future)
- **Android:** See `platforms/android/PRD-android.md#critical-notes` (future)

---

## 18. Environment Configuration & .env.local Setup

### **Core Configuration Requirements:**
- **Firebase Configuration:** API keys and project settings
- **Environment Variables:** Platform-specific configuration
- **Development vs Production:** Different settings for different environments

### **Platform Implementation:**
- **Web:** See `platforms/web/PRD-web.md#environment-setup` for React/Ionic configuration
- **iOS:** See `platforms/ios/PRD-ios.md#environment-setup` (future)
- **Android:** See `platforms/android/PRD-android.md#environment-setup` (future)

---

## 19. Implementation Guide for New Projects

### **Quick Start Questions for Implementation:**

#### **1. Platform Choice:**
- **What platform** are you building for? (Web, iOS, Android, Desktop)
- **What framework** will you use? (React, Vue, SwiftUI, Jetpack Compose, etc.)
- **What UI library** will you use? (Ionic, Material-UI, native components, etc.)

#### **2. State Management:**
- **How will you manage state?** (Redux, Context API, Zustand, native state management)
- **How will you handle real-time updates?** (Firebase listeners, WebSockets, etc.)

#### **3. Data Flow:**
- **How will you structure your data layer?** (Services, repositories, etc.)
- **How will you handle Firebase integration?** (Direct SDK, abstraction layer, etc.)

#### **4. UI/UX:**
- **How will you implement the UI?** (Components, layouts, navigation)
- **How will you handle responsive design?** (Mobile-first, adaptive layouts, etc.)

#### **5. Performance:**
- **How will you optimize performance?** (Memoization, lazy loading, etc.)
- **How will you handle large datasets?** (Pagination, virtualization, etc.)

#### **6. Testing:**
- **How will you test your implementation?** (Unit tests, integration tests, etc.)
- **How will you validate business logic?** (Test coverage, validation tests, etc.)

#### **7. Deployment:**
- **How will you deploy your app?** (Build tools, hosting, app stores, etc.)
- **How will you manage environments?** (Development, staging, production)

### **Implementation Checklist:**

#### **Phase 1: Foundation**
- [ ] Set up project structure and dependencies
- [ ] Configure Firebase project and environment
- [ ] Implement data models and TypeScript interfaces
- [ ] Set up state management architecture
- [ ] Create basic UI components and layout

#### **Phase 2: Core Features**
- [ ] Implement authentication and user management
- [ ] Create Firebase service layer
- [ ] Build queue management functionality
- [ ] Implement search and song browsing
- [ ] Add favorites and history tracking

#### **Phase 3: Advanced Features**
- [ ] Implement real-time synchronization
- [ ] Add admin controls and permissions
- [ ] Build singer management system
- [ ] Create settings and configuration
- [ ] Implement error handling and resilience

#### **Phase 4: Polish & Optimization**
- [ ] Add performance optimizations
- [ ] Implement comprehensive testing
- [ ] Add accessibility features
- [ ] Optimize for different screen sizes
- [ ] Prepare for deployment

#### **Phase 5: Deployment & Launch**
- [ ] Set up production environment
- [ ] Configure build and deployment pipeline
- [ ] Perform final testing and validation
- [ ] Deploy to target platform
- [ ] Monitor and maintain

### **Critical Success Factors:**
- **Follow the Firebase structure** exactly as defined
- **Implement all business logic** client-side
- **Maintain real-time synchronization** across all clients
- **Validate all data** against TypeScript interfaces
- **Test thoroughly** before deployment

### **Platform-Specific Guidance:**
- **Web:** See `platforms/web/PRD-web.md` for React/Ionic implementation details
- **iOS:** See `platforms/ios/PRD-ios.md` for Swift/SwiftUI implementation (future)
- **Android:** See `platforms/android/PRD-android.md` for Kotlin/Jetpack Compose implementation (future)

---

_This document contains platform-agnostic business logic and Firebase architecture. For platform-specific implementation details, see the corresponding platform PRD in the `platforms/` folder._

