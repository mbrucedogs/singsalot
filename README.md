# SingSalot AI - Karaoke App

> **Modern React + TypeScript + Ionic + Firebase Realtime Database**

A real-time karaoke application designed for in-home party use with multi-user synchronization, admin controls, and comprehensive song management.

## 🎯 Features

### **Core Functionality**
- **Real-time Queue Management** - Synchronized across all connected devices
- **Multi-User Support** - Admin and user roles with different permissions
- **Comprehensive Search** - Instant search through song catalog with pagination
- **Favorites System** - Shared favorites list across all users
- **History Tracking** - Automatic tracking of played songs
- **Artist Browsing** - Browse songs by artist with modal views
- **Song Lists** - Predefined song collections with availability matching
- **Top Played** - Popular songs based on play history
- **New Songs** - Recently added songs to the catalog (see PRD for implementation details) (see PRD for implementation details) (see PRD for implementation details)

### **Admin Features**
- **Queue Control** - Reorder and delete queue items
- **Playback Control** - Play, pause, stop music
- **Singer Management** - Add/remove singers
- **Settings Management** - Configure autoadvance and userpick
- **Song Management** - Disable/enable songs

### **Technical Features**
- **Real-time Sync** - Firebase Realtime Database synchronization
- **Performance Optimized** - Memoized components, virtualized lists, pagination
- **Type Safety** - Full TypeScript implementation
- **Responsive Design** - Mobile-first with touch-friendly interface
- **Error Handling** - Graceful degradation and retry patterns

## 🏗️ Architecture

### **Refactored Architecture (Latest)**
The codebase has been completely refactored for better maintainability and performance:

#### **Domain-Specific Redux Slices**
- `songsSlice.ts` - Song catalog management
- `queueSlice.ts` - Queue operations and state
- `favoritesSlice.ts` - Favorites management
- `historySlice.ts` - History tracking

#### **Composable Hooks**
- `useFilteredSongs.ts` - Reusable song filtering logic
- `usePaginatedData.ts` - Generic pagination with search
- `useErrorHandler.ts` - Centralized error handling
- `usePerformanceMonitor.ts` - Performance tracking

#### **Optimized Components**
- `SongItem.tsx` - Memoized with React.memo and useCallback
- `ListItem.tsx` - Generic list item with TypeScript support
- `VirtualizedList.tsx` - High-performance list rendering
- `ActionButton.tsx` - Reusable action buttons

#### **Performance Optimizations**
- **React.memo** for component memoization
- **useMemo/useCallback** for expensive computations
- **Virtualized rendering** for large datasets
- **Infinite scroll** with pagination
- **Optimized Redux selectors**

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd singsalot-ai

# Install dependencies
npm install

# Set up environment variables
cp env.template .env.local
# Edit .env.local with your Firebase configuration

# Start development server
npm run dev
```

### **Environment Setup**
Create a `.env.local` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

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
├── hooks/              # Custom React hooks (refactored)
├── redux/              # State management (domain-specific slices)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### **Key Development Patterns**

#### **Adding New Features**
1. Create feature component in `src/features/`
2. Add corresponding Redux slice if needed
3. Create custom hooks for business logic
4. Add TypeScript types in `src/types/`

#### **Component Guidelines**
- Use `React.memo` for performance-critical components
- Implement `useMemo` and `useCallback` for expensive operations
- Follow the established prop patterns for consistency

#### **State Management**
- Use domain-specific Redux slices for related functionality
- Implement async thunks for Firebase operations
- Use memoized selectors for performance

## 🔧 Firebase Configuration

### **Database Structure**
The app uses Firebase Realtime Database with the following structure:
```json
{
  "controllers": {
    "[controllerName]": {
      "favorites": {},
      "history": {},
      "topPlayed": {},
      "newSongs": {},
      "disabledSongs": {},
      "player": {
        "queue": {},
        "settings": {},
        "singers": {},
        "state": {}
      },
      "songList": {},
      "songs": {}
    }
  }
}
```

### **Security Rules**
The app uses client-side validation with permissive Firebase rules for real-time synchronization.

## 📱 User Experience

### **Authentication**
- Login requires Party ID and singer name
- Admin access is a privileged mode
- Session state managed in app (lost on reload)

### **Queue Management**
- Real-time synchronization across all clients
- Sequential numerical keys (0, 1, 2, ...)
- Admin-only reordering and deletion
- First item protection during playback

### **Search & Discovery**
- Instant search with debouncing
- Paginated results with infinite scroll
- Multiple entry points (search, history, favorites, etc.)
- Context-aware actions for each song

## 🧪 Testing

### **Current Testing Status**
- ✅ TypeScript compilation
- ✅ ESLint validation
- ✅ Build process
- 🔄 Unit tests (planned)
- 🔄 Integration tests (planned)

### **Testing Strategy**
- Unit tests for business logic and hooks
- Integration tests for Firebase operations
- Component testing with React Testing Library
- Performance testing for large datasets

## 🚀 Deployment

### **Build Process**
```bash
npm run build
```

The build process:
- Compiles TypeScript
- Bundles with Vite
- Optimizes for production
- Generates static assets

### **Deployment Options**
- **Firebase Hosting** - Recommended for Firebase integration
- **Vercel** - Easy deployment with automatic builds
- **Netlify** - Static site hosting with CI/CD
- **Traditional hosting** - Any static file server

## 📚 Documentation

### **Related Documents**
- [`docs/PRD.md`](docs/PRD.md) - Product Requirements Document
- [`docs/platforms/web/PRD-web.md`](docs/platforms/web/PRD-web.md) - Web-specific implementation guide
- [`docs/firebase_schema.json`](docs/firebase_schema.json) - Firebase database schema

### **Design Assets**
- [`docs/platforms/web/design/`](docs/platforms/web/design/) - UI/UX design mockups and assets

## 🤝 Contributing

### **Development Workflow**
1. Create feature branch from main
2. Implement changes following established patterns
3. Ensure TypeScript compilation passes
4. Run linting and type checking
5. Test functionality manually
6. Submit pull request

### **Code Standards**
- Follow TypeScript best practices
- Use established component patterns
- Maintain performance optimizations
- Add appropriate error handling
- Update documentation as needed

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions about the implementation:
- Check the documentation in the `docs/` folder
- Review the TypeScript types for API contracts
- Examine the Firebase schema for data structure
- Refer to the platform-specific PRD for implementation details

---

**Built with ❤️ using React, TypeScript, Ionic, and Firebase**
