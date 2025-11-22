# 🎬 StreamBox - Enterprise-Grade Movie Browsing App

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6.svg)

A professional, full-stack cross-platform movie browsing application built with **React Native** (Expo), **Redux Toolkit**, and **TypeScript**, featuring a **monorepo architecture** with shared type definitions.

## 📋 Project Overview

**Course**: IN3210 Mobile Applications Development  
**Assignment**: Assignment 2 - Cross-Platform Mobile Development  
**Architecture**: Monorepo with npm workspaces  
**Pattern**: Backend for Frontend (BFF) - Ready for Phase 7+

---

## ✨ Features Implemented (Phases 1-5 Complete)

### ✅ Phase 1-2: Setup & Authentication

- [x] Expo TypeScript project setup
- [x] Redux Toolkit with persistence
- [x] Complete navigation structure (Stack + Bottom Tabs)
- [x] Login & Registration screens with validation
- [x] React Hook Form + Yup validation
- [x] Conditional auth flow

### ✅ Phase 3: API Integration

- [x] RTK Query setup for TMDB API
- [x] Home screen with trending movies
- [x] Movie Details screen
- [x] MovieCard component
- [x] Error handling & loading states

### ✅ Phase 4: State Management & Favourites

- [x] Favourites Redux slice with persistence
- [x] Add/Remove favourites functionality
- [x] Favourites screen with grid layout
- [x] Animated interactions

### ✅ Phase 5: UI/UX Polish & Dark Mode

- [x] Profile screen with user info
- [x] Dark mode implementation
- [x] Theme system with custom hook
- [x] Professional UI with gradients & animations
- [x] Responsive design

### ✅ Phase 6: Monorepo Restructuring (CURRENT)

- [x] npm workspaces setup
- [x] Shared package with TypeScript types
- [x] End-to-end type safety
- [x] Organized package structure

---

## 📦 Monorepo Structure

```
StreamBox/
├── package.json                    # Root workspace config
├── IMPLEMENTATION_PLAN.md          # Detailed implementation guide
├── README.md                       # This file
└── packages/
    │
    ├── mobile/                     # React Native app
    │   ├── package.json            # @streambox/mobile
    │   ├── app.json
    │   ├── App.tsx
    │   ├── index.ts
    │   ├── tsconfig.json
    │   ├── assets/
    │   └── src/
    │       ├── api/                # RTK Query
    │       ├── components/         # Reusable components
    │       ├── constants/          # Theme & config
    │       ├── hooks/              # Custom hooks
    │       ├── navigation/         # Navigation setup
    │       ├── screens/            # App screens
    │       ├── store/              # Redux store & slices
    │       ├── types/              # TypeScript types
    │       └── utils/              # Utilities
    │
    └── shared/                     # Shared TypeScript types
        ├── package.json            # @streambox/shared
        ├── tsconfig.json
        ├── README.md
        └── src/
            ├── index.ts
            └── dtos/
                ├── auth.dto.ts
                ├── movie.dto.ts
                └── favorite.dto.ts
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/StreamBox.git
cd StreamBox

# Install all dependencies (monorepo)
npm install

# Start the mobile app
npm run mobile
```

### Available Scripts

```bash
# Mobile App
npm run mobile              # Start Expo dev server
npm run mobile:android      # Start on Android
npm run mobile:ios          # Start on iOS

# Shared Package
npm run shared:build        # Build shared types
npm run shared:watch        # Watch for changes

# Utilities
npm run install:all         # Install all workspace dependencies
npm run clean              # Clean all workspaces
```

---

## 🏗️ Architecture

### Monorepo with npm Workspaces

This project uses **npm workspaces** to manage multiple packages in a single repository. This is the same approach used by companies like Google, Facebook, and Microsoft.

### Benefits

- **End-to-End Type Safety**: Shared types ensure mobile and backend (Phase 7+) stay in sync
- **Code Reusability**: Common logic shared across packages
- **Atomic Changes**: Update types once, changes reflect everywhere
- **Simplified Dependencies**: Single node_modules at root
- **Better Developer Experience**: Easier to navigate and maintain

### Packages

#### `@streambox/mobile`

The React Native application built with Expo. Contains all mobile-specific code including UI components, navigation, and state management.

**Key Technologies**:

- React Native (Expo)
- Redux Toolkit + RTK Query
- React Navigation
- React Hook Form + Yup
- TypeScript

#### `@streambox/shared`

Shared TypeScript types and DTOs (Data Transfer Objects) used across the entire stack. Ensures type consistency between mobile app and backend (Phase 7+).

**Exports**:

- Authentication DTOs
- Movie DTOs
- Favorites DTOs
- User types

---

## 🎨 Features in Detail

### Authentication System

- **Login/Registration**: Full validation with React Hook Form + Yup
- **Token Storage**: Redux Persist for seamless sessions
- **Conditional Navigation**: Automatic routing based on auth state
- **User Profile**: Display and manage user information

### Movie Browsing

- **Hero Section**: Auto-rotating featured movies with smooth transitions
- **TMDB Integration**: Real-time data from The Movie Database API
- **Movie Details**: Comprehensive information with ratings, genres, budget, etc.
- **Search & Filters**: (Ready for Phase 7+)

### Favourites Management

- **Add/Remove**: Toggle favourites with animated feedback
- **Persistent Storage**: Redux Persist keeps favourites across sessions
- **Grid Layout**: Beautiful card-based grid with glassmorphism effects
- **Cloud Sync**: (Ready for Phase 7+ backend integration)

### Dark Mode

- **System-wide Theme**: Toggle between light and dark modes
- **Custom Hook**: `useTheme()` for easy theming
- **Persistent Preference**: Theme selection saved to storage
- **Smooth Transitions**: Animated theme switching

### UI/UX Excellence

- **Gradient Accents**: Professional color gradients throughout
- **Animations**: Smooth micro-interactions with Animated API
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper contrast ratios and touch targets
- **Error Handling**: Graceful error states with retry options

---

## 🛠️ Tech Stack

### Mobile Frontend

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| React Native (Expo) | Cross-platform mobile framework |
| TypeScript          | Type safety and better DX       |
| Redux Toolkit       | State management                |
| RTK Query           | API data fetching & caching     |
| React Navigation    | Navigation system               |
| React Hook Form     | Form handling                   |
| Yup                 | Schema validation               |
| Expo Vector Icons   | Icon library                    |
| Redux Persist       | State persistence               |

### Shared Package

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| TypeScript     | Shared type definitions |
| npm workspaces | Monorepo management     |

### Development Tools

| Technology | Purpose                 |
| ---------- | ----------------------- |
| ESLint     | Code linting (ready)    |
| Prettier   | Code formatting (ready) |
| Husky      | Git hooks (ready)       |

---

## 🎯 What's Next: Backend Integration (Phase 7+)

The monorepo structure is ready for backend integration. The next phases will add:

### Phase 7: Backend Foundation

- Node.js + Express server
- Prisma ORM with SQLite
- JWT authentication
- Real database schema

### Phase 8: Authentication Backend

- Argon2 password hashing
- JWT token generation
- Protected routes
- Auth middleware

### Phase 9: TMDB API Proxy (BFF Pattern)

- API key hidden from mobile app
- Server-side TMDB requests
- Favorites API with cloud sync
- Search & filtering endpoints

### Phase 10: Mobile-Backend Integration

- Update mobile API client
- Expo Secure Store for tokens
- Cloud-synced favorites
- Real authentication flow

### Phase 11: Biometric Authentication

- FaceID/TouchID support
- Seamless login experience

### Phase 12: Advanced UX

- Shared element transitions
- Skeleton loading states
- Pull-to-refresh
- Infinite scroll

---

## 📸 Screenshots

> Add screenshots of your app here showing:
>
> - Login & Registration screens
> - Home screen with movie carousel
> - Movie details screen
> - Favourites screen
> - Profile screen (light & dark mode)

---

## 🧪 Testing

Testing setup ready for implementation:

```bash
# Unit tests (Phase 13)
npm test

# E2E tests (Phase 13)
npm run test:e2e
```

---

## 📝 Environment Variables

For Phase 7+, create `.env` files:

### Mobile (`packages/mobile/.env`)

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Backend (`packages/server/.env`) - Phase 7+

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
TMDB_API_KEY=your_tmdb_api_key_here
DATABASE_URL=file:./dev.db
```

---

## 🤝 Contributing

This is an academic project for IN3210. Future contributions welcome after course completion.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

**StreamBox Team** - IN3210 Mobile Applications Development

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data API
- [Expo](https://expo.dev/) for the excellent React Native development platform
- [Redux Toolkit](https://redux-toolkit.js.org/) for simplified state management
- React Native community for amazing libraries

---

## 📊 Project Status

| Phase                          | Status          | Completion |
| ------------------------------ | --------------- | ---------- |
| Phase 1-2: Setup & Auth        | ✅ Complete     | 100%       |
| Phase 3: API Integration       | ✅ Complete     | 100%       |
| Phase 4: Favourites            | ✅ Complete     | 100%       |
| Phase 5: UI Polish & Dark Mode | ✅ Complete     | 100%       |
| **Phase 6: Monorepo**          | ✅ **Complete** | **100%**   |
| Phase 7: Backend Foundation    | 🔜 Next         | 0%         |
| Phase 8: Auth Backend          | 🔜 Upcoming     | 0%         |
| Phase 9: API Proxy             | 🔜 Upcoming     | 0%         |
| Phase 10: Integration          | 🔜 Upcoming     | 0%         |
| Phase 11: Biometric            | 🔜 Upcoming     | 0%         |
| Phase 12: Advanced UX          | 🔜 Upcoming     | 0%         |
| Phase 13: Testing              | 🔜 Upcoming     | 0%         |

---

## 📚 Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Detailed 27-day implementation guide
- [Shared Package README](./packages/shared/README.md) - TypeScript types documentation
- [Mobile Package](./packages/mobile/) - React Native app documentation (Phase 7+)
- [Backend Package](./packages/server/) - Node.js backend documentation (Phase 7+)

---

**Built with ❤️ for IN3210 Mobile Applications Development**

Last Updated: November 22, 2025
