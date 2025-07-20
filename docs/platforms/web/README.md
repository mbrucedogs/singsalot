# Web Platform Documentation

> **Platform:** Web (React + Ionic + TypeScript)  
> **Core Business Logic:** See `../../PRD.md`

This folder contains **web-specific implementation details** for the Karaoke App.

---

## 📁 File Structure

```
docs/platforms/web/
├── PRD-web.md        # Web-specific implementation guide
└── README.md         # This file - quick reference
```

---

## 🚀 Quick Start

### **For AI-Assisted Development:**
1. **Read the main PRD:** `../../PRD.md` (core business logic)
2. **Read this web PRD:** `PRD-web.md` (web implementation details)
3. **Follow the implementation guide** in the main PRD
4. **Reference design assets:** `design/`

### **For Human Developers:**
1. **Review business requirements** in main PRD
2. **Study web implementation** patterns in `PRD-web.md`
3. **Set up development environment** using provided configs
4. **Follow component architecture** and state management patterns

---

## 📋 What's Included

### **PRD-web.md Contains:**
- **UI/UX Behavior** - Web-specific patterns and interactions
- **Component Architecture** - React/Ionic component structure
- **State Management** - Redux Toolkit implementation
- **Development Setup** - Project configuration and environment
- **Design Assets** - Web-specific visual references
- **Toolset Choices** - Technology rationale and migration notes
- **Implementation Notes** - Critical web-specific patterns
- **Migration Guide** - How to adapt to other platforms

### **Key Web Technologies:**
- **React 18** + **TypeScript** for component architecture
- **Ionic React** for mobile-first UI components
- **Redux Toolkit** for state management
- **Firebase Realtime Database** for backend
- **Vite** for build tooling

---

## 🔗 Cross-References

### **Main PRD Sections:**
- **Business Logic:** See `../../PRD.md#business-logic`
- **Data Models:** See `../../PRD.md#data-models`
- **User Roles:** See `../../PRD.md#user-roles`
- **Feature Specs:** See `../../PRD.md#feature-overview`

### **Design Assets:**
- **Web Mockups:** See `design/`
- **30+ Visual References** for all features

### **Implementation Guide:**
- **Core Requirements:** See `../../PRD.md#implementation-guide`
- **Web-Specific Details:** See `PRD-web.md#implementation-notes`

---

## 🛠️ Development Workflow

### **1. Setup Project:**
```bash
# Install dependencies
npm install

# Set up environment
cp .env.template .env.local
# Edit .env.local with your Firebase config

# Start development server
npm run dev
```

### **2. Follow Architecture:**
- **Components:** Use React functional components with TypeScript
- **State:** Use Redux Toolkit for global state
- **Styling:** Use Ionic components with custom CSS variables
- **Data:** Use Firebase Realtime Database with custom hooks

### **3. Reference Patterns:**
- **Firebase Integration:** See `PRD-web.md#firebase-integration`
- **Real-time Listeners:** See `PRD-web.md#real-time-listeners`
- **Error Handling:** See `PRD-web.md#error-handling`

---

## 🔄 Migration Paths

### **To Other Web Frameworks:**
- **Vue.js:** Replace React with Vue, Redux with Pinia
- **Svelte:** Replace React with Svelte, Redux with Svelte stores
- **Keep:** All business logic and Firebase integration

### **To Mobile Platforms:**
- **React Native:** Replace Ionic with React Native components
- **Native iOS/Android:** Replace React with native UI frameworks
- **Keep:** All business logic and Firebase integration

---

## 📚 Additional Resources

### **Documentation:**
- **Main PRD:** `../../PRD.md` - Core business logic
- **Design Assets:** `design/` - Visual references
- **Type Definitions:** `../../types.ts` - Data models

### **External Resources:**
- **Ionic React:** https://ionicframework.com/docs/react
- **Redux Toolkit:** https://redux-toolkit.js.org/
- **Firebase:** https://firebase.google.com/docs
- **React:** https://react.dev/

---

_This document provides web-specific implementation details. For core business logic and platform-agnostic requirements, see the main `../../PRD.md`._ 