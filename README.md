# StreamBox 🎬

**Enterprise-Grade Full-Stack Movie Browsing Application**

A production-ready, cross-platform mobile application demonstrating modern full-stack development practices with React Native, Node.js, and a custom backend implementing the Backend for Frontend (BFF) pattern.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![Expo](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Demo Video](#-demo-video)
- [Development Workflow](#-development-workflow)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

StreamBox is a full-stack movie browsing application demonstrating industry-standard practices used by companies like Netflix, Spotify, and Uber, featuring:

- **Backend for Frontend (BFF) Pattern** - Custom Node.js backend proxying TMDB API
- **Monorepo Architecture** - Organized workspace with shared TypeScript types
- **End-to-End Type Safety** - Type-safe communication between frontend and backend
- **Production-Ready Security** - JWT authentication, Argon2 password hashing, hardware-encrypted storage
- **Modern UX** - Skeleton loaders, infinite scroll, shared element transitions, dark mode
- **Cloud Persistence** - Favorites synced across devices via custom backend

---

## ✨ Features

### Core Features

#### 🔐 Authentication

- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Real-time form validation (Yup schemas)
- ✅ Argon2 password hashing (OWASP recommended)
- ✅ Hardware-encrypted token storage (Expo SecureStore)

#### 🧭 Navigation

- ✅ Stack navigation for authentication flow
- ✅ Bottom tab navigation with 5 tabs (Home, Search, Discover, Favorites, Profile)
- ✅ Conditional rendering based on authentication state
- ✅ Type-safe navigation parameters
- ✅ Smooth screen transitions

#### 🎬 API Integration

- ✅ Custom Node.js backend proxying TMDB API (BFF pattern)
- ✅ Multiple endpoints (trending, popular, top-rated, search, details)
- ✅ Skeleton loading states
- ✅ Error handling with user-friendly messages
- ✅ Automatic request caching (RTK Query)

#### 📦 State Management

- ✅ Redux Toolkit for global state
- ✅ Auth slice with login/logout actions
- ✅ UI slice for theme management
- ✅ Cloud-synced favorites via backend API
- ✅ Optimistic UI updates

#### 🎨 UI/UX Design

- ✅ Professional, clean interface
- ✅ Responsive grid layouts
- ✅ Custom theme system (light/dark)
- ✅ Smooth animations and transitions
- ✅ Consistent spacing and typography

#### 💻 Code Quality

- ✅ TypeScript with strict mode
- ✅ Monorepo architecture (npm workspaces)
- ✅ 25 passing tests (Jest + Supertest)
- ✅ ESLint + Prettier + Husky configuration
- ✅ Comprehensive documentation

### Advanced Features

#### 🌙 Dark Mode

- ✅ Toggle in profile settings
- ✅ Consistent theme across all screens
- ✅ Smooth theme transitions
- ✅ Theme persistence with Redux

#### 🖥️ Custom Backend

- ✅ Node.js + Express server
- ✅ Prisma ORM with SQLite database
- ✅ JWT authentication system
- ✅ Argon2 password hashing
- ✅ TMDB API proxy (API key hidden)
- ✅ Protected routes with middleware
- ✅ Error handling middleware
- ✅ CORS and Helmet security

#### 👤 Biometric Authentication

- ✅ FaceID/TouchID support (Expo Local Authentication)
- ✅ Auto-login on app launch
- ✅ Toggle in profile settings
- ✅ Hardware support detection
- ✅ Fallback to password login

#### ✨ Advanced UX

- ✅ Shared element transitions (React Native Reanimated)
- ✅ Skeleton loading placeholders
- ✅ Infinite scroll with pagination
- ✅ Pull-to-refresh functionality
- ✅ Optimistic UI updates

### Additional Highlights

- ✅ **Monorepo Architecture** - Enterprise-grade project organization
- ✅ **End-to-End Type Safety** - Shared TypeScript types between frontend/backend
- ✅ **Comprehensive Testing** - 25 passing tests with Jest + Supertest
- ✅ **Code Quality Tools** - ESLint, Prettier, Husky, lint-staged
- ✅ **Production-Ready** - Environment variables, error handling, security headers

---

## 🏗️ Architecture

StreamBox implements a **Backend for Frontend (BFF)** pattern with a monorepo structure:

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (Client)                      │
│  React Native + Expo + Redux Toolkit + TypeScript          │
│  - UI Components & Screens                                  │
│  - Navigation (Stack + Tabs)                                │
│  - State Management (Redux)                                 │
│  - Secure Storage (SecureStore)                             │
│  - Biometric Auth (Local Authentication)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                 HTTPS (REST)
               JWT Bearer Token
                      │
┌─────────────────────▼───────────────────────────────────────┐
│               Backend Server (Node.js)                      │
│  Express + Prisma + SQLite + TypeScript                     │
│  - JWT Authentication (Argon2 hashing)                      │
│  - TMDB API Proxy (BFF Pattern)                             │
│  - Favorites Management (CRUD)                              │
│  - Protected Routes (Auth Middleware)                       │
│  - Error Handling                                           │
└─────────────┬────────────────────────┬──────────────────────┘
              │                        │
       ┌──────▼──────┐         ┌──────▼──────┐
       │   SQLite    │         │  TMDB API   │
       │  Database   │         │ (External)  │
       │  (Prisma)   │         │             │
       └─────────────┘         └─────────────┘
```

### Key Architecture Patterns

- **Backend for Frontend (BFF)** - Custom backend proxies external APIs, hides API keys
- **Monorepo** - Single repository with multiple packages (mobile, server, shared)
- **Service-Oriented Architecture** - Clear separation: Routes → Controllers → Services → Data
- **Repository Pattern** - Database abstraction via Prisma ORM
- **Type Safety** - Shared TypeScript types between frontend and backend

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🛠️ Technology Stack

### Frontend (Mobile App)

| Category             | Technology                  | Purpose                           |
| -------------------- | --------------------------- | --------------------------------- |
| **Framework**        | React Native + Expo         | Cross-platform mobile development |
| **Language**         | TypeScript                  | Type safety and better DX         |
| **State Management** | Redux Toolkit + RTK Query   | Global state and API caching      |
| **Navigation**       | React Navigation v7         | Stack and tab navigation          |
| **Forms**            | React Hook Form + Yup       | Form handling and validation      |
| **Security**         | Expo SecureStore            | Hardware-encrypted token storage  |
| **Biometrics**       | Expo Local Authentication   | FaceID/TouchID integration        |
| **UI**               | React Native built-ins      | Responsive, animated components   |
| **Icons**            | Expo Vector Icons (Feather) | Consistent iconography            |
| **Animations**       | React Native Reanimated     | Shared element transitions        |

### Backend (Server)

| Category             | Technology         | Purpose                        |
| -------------------- | ------------------ | ------------------------------ |
| **Runtime**          | Node.js 18+        | JavaScript server runtime      |
| **Framework**        | Express.js         | Web application framework      |
| **Language**         | TypeScript         | Type safety on backend         |
| **Database**         | SQLite             | File-based relational database |
| **ORM**              | Prisma             | Type-safe database client      |
| **Authentication**   | JWT (jsonwebtoken) | Stateless authentication       |
| **Password Hashing** | Argon2             | Secure password storage        |
| **Security**         | Helmet + CORS      | HTTP security headers          |
| **HTTP Client**      | Axios              | External API requests          |
| **Testing**          | Jest + Supertest   | Unit and integration tests     |
| **Dev Tools**        | ts-node-dev        | Hot reloading in development   |

### Shared

| Category               | Technology     | Purpose                    |
| ---------------------- | -------------- | -------------------------- |
| **Types**              | TypeScript     | Shared DTOs and interfaces |
| **Package Management** | npm workspaces | Monorepo organization      |

### Development Tools

| Tool            | Purpose                            |
| --------------- | ---------------------------------- |
| **ESLint**      | Code linting and style enforcement |
| **Prettier**    | Code formatting                    |
| **Husky**       | Git hooks for quality checks       |
| **lint-staged** | Pre-commit linting                 |
| **Git**         | Version control                    |

### External APIs

- **TMDB API** - Movie data (proxied through backend)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** 18.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`
- **npm** 9.0.0 or higher
  - Comes with Node.js
  - Verify: `npm --version`

- **Git**
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Mobile Development (Choose One)

#### Option 1: Expo Go App (Easiest)

- Install **Expo Go** on your iOS or Android device
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

#### Option 2: iOS Simulator (macOS only)

- **Xcode** 14.0 or higher
  - Install from Mac App Store
  - Open Xcode, go to Preferences → Locations, select Command Line Tools

#### Option 3: Android Emulator

- **Android Studio**
  - Download: https://developer.android.com/studio
  - Set up Android Virtual Device (AVD)

### API Keys

- **TMDB API Key** (Required)
  - Register at https://www.themoviedb.org/
  - Go to Settings → API → Create API key
  - Choose "Developer" option
  - Accept terms and get your API key

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Akith-002/StreamBox.git
cd StreamBox
```

### 2. Install Dependencies

Install all dependencies for the monorepo (mobile, server, and shared packages):

```bash
npm install
```

This will install dependencies for all workspaces using npm workspaces.

### 3. Setup Environment Variables

#### Backend Server Configuration

Create a `.env` file in `packages/server/`:

```bash
cd packages/server
cp .env.example .env
```

Edit `packages/server/.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

**Important:**

- Replace `your_tmdb_api_key_here` with your actual TMDB API key
- Generate a strong `JWT_SECRET` for production (minimum 32 characters)
- You can generate a secure secret with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### Mobile App Configuration

Update the backend URL in `packages/mobile/src/constants/config.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api" // For iOS simulator
  : // ? 'http://10.0.2.2:3000/api'  // For Android emulator
    // ? 'http://YOUR_IP:3000/api'    // For physical device (replace YOUR_IP)
    "https://your-production-api.com/api";
```

**Note:** For physical devices, replace `YOUR_IP` with your computer's local IP address (find it with `ipconfig` on Windows or `ifconfig` on macOS/Linux).

### 4. Initialize Database

Set up the SQLite database with Prisma:

```bash
cd packages/server
npm run prisma:migrate
npm run prisma:generate
```

This will:

- Create the `prisma/dev.db` SQLite database file
- Run all migrations (create User and Favorite tables)
- Generate the Prisma Client with TypeScript types

---

## 🚀 Running the Application

### Development Mode (Recommended)

You need to run both the backend server and the mobile app.

#### Terminal 1: Start Backend Server

```bash
# From project root
cd packages/server
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:3000
```

The server will hot-reload when you make changes.

#### Terminal 2: Start Mobile App

```bash
# From project root
cd packages/mobile
npm start
```

This will open Expo Dev Tools in your browser. You can then:

- Press `i` to open iOS Simulator (macOS only)
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your physical device

### Using npm Scripts from Root

Alternatively, from the project root:

```bash
# Start mobile app
npm run mobile

# Or use concurrently to run both (if configured)
npm run dev  # If you've set up concurrently
```

### Production Build

#### Backend

```bash
cd packages/server
npm run build
npm start
```

#### Mobile App

Build standalone apps:

```bash
cd packages/mobile

# iOS (requires macOS and Apple Developer account)
eas build --platform ios

# Android
eas build --platform android

# Both
eas build --platform all
```

---

## 🧪 Testing

### Run All Tests

From project root:

```bash
npm test
```

### Backend Tests Only

```bash
cd packages/server
npm test
```

### Test Coverage

```bash
cd packages/server
npm run test:coverage
```

### Test Results

Current test status:

- ✅ **25 passing tests** (Auth: 9, Favorites: 16)
- 📊 **Coverage**: Critical paths covered (auth, favorites CRUD)
- ⏭️ **16 skipped tests** (Movies - requires TMDB API key)

To run skipped tests, ensure `TMDB_API_KEY` is set in `.env`.

### Manual Testing Checklist

- [ ] User can register a new account
- [ ] User can login with valid credentials
- [ ] Invalid login shows error message
- [ ] Home screen loads trending movies
- [ ] Movie details screen displays correct information
- [ ] User can add movies to favorites
- [ ] User can remove movies from favorites
- [ ] Favorites persist after logout/login
- [ ] Dark mode toggle works across all screens
- [ ] Biometric authentication works (if device supports it)
- [ ] Infinite scroll loads more movies
- [ ] Pull-to-refresh updates movie list
- [ ] Search functionality returns correct results

---

## 📁 Project Structure

```
StreamBox/                          # Root monorepo
├── package.json                    # Root package (workspaces config)
├── tsconfig.base.json              # Base TypeScript config
├── eslint.config.js                # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
├── ARCHITECTURE.md                 # Architecture documentation
│
├── packages/
│   │
│   ├── mobile/                     # React Native mobile app
│   │   ├── app.json                # Expo configuration
│   │   ├── App.tsx                 # Root component
│   │   ├── package.json            # Mobile dependencies
│   │   ├── tsconfig.json           # TypeScript config
│   │   ├── babel.config.js         # Babel configuration
│   │   ├── index.ts                # Entry point
│   │   ├── assets/                 # Images, fonts, etc.
│   │   │   ├── icon.png
│   │   │   └── splash.png
│   │   └── src/
│   │       ├── api/
│   │       │   ├── axiosInstance.ts      # Axios configuration
│   │       │   ├── backendApi.ts         # RTK Query API (backend)
│   │       │   └── tmdbApi.ts            # Direct TMDB (legacy)
│   │       ├── components/
│   │       │   ├── Button.tsx            # Custom button
│   │       │   ├── FormInput.tsx         # Form input field
│   │       │   ├── Input.tsx             # Text input
│   │       │   ├── Logo.tsx              # App logo
│   │       │   ├── MediaCard.tsx         # Generic media card
│   │       │   ├── MovieCard.tsx         # Movie card component
│   │       │   └── SkeletonLoader.tsx    # Loading placeholder
│   │       ├── constants/
│   │       │   ├── config.ts             # API URLs, constants
│   │       │   └── theme.ts              # Colors, typography
│   │       ├── hooks/
│   │       │   ├── useAuth.ts            # Auth hook
│   │       │   └── useTheme.ts           # Theme hook
│   │       ├── navigation/
│   │       │   ├── RootNavigator.tsx     # Root nav (auth check)
│   │       │   ├── AuthStack.tsx         # Login/Register stack
│   │       │   └── MainTabNavigator.tsx  # Bottom tabs
│   │       ├── screens/
│   │       │   ├── LoginScreen.tsx       # Login form
│   │       │   ├── RegisterScreen.tsx    # Registration form
│   │       │   ├── HomeScreen.tsx        # Trending movies
│   │       │   ├── SearchScreen.tsx      # Movie search
│   │       │   ├── DiscoverScreen.tsx    # Popular/Top-rated
│   │       │   ├── DetailsScreen.tsx     # Movie details
│   │       │   ├── PersonDetailsScreen.tsx  # Actor/Director details
│   │       │   ├── TVDetailsScreen.tsx   # TV show details
│   │       │   ├── FavouritesScreen.tsx  # User favorites
│   │       │   ├── ProfileScreen.tsx     # User profile/settings
│   │       │   └── SplashScreen.tsx      # App splash
│   │       ├── store/
│   │       │   ├── store.ts              # Redux store config
│   │       │   └── features/
│   │       │       ├── authSlice.ts      # Auth state
│   │       │       ├── favouritesSlice.ts # Favorites (legacy)
│   │       │       └── uiSlice.ts        # UI state (theme)
│   │       ├── types/
│   │       │   ├── Auth.ts               # Auth types
│   │       │   └── Movie.ts              # Movie types
│   │       └── utils/
│   │           ├── secureStorage.ts      # Token management
│   │           └── validationSchemas.ts  # Yup schemas
│   │
│   ├── server/                     # Node.js backend
│   │   ├── package.json            # Server dependencies
│   │   ├── tsconfig.json           # TypeScript config
│   │   ├── jest.config.js          # Jest configuration
│   │   ├── .env                    # Environment variables (gitignored)
│   │   ├── .env.example            # Environment template
│   │   ├── prisma/
│   │   │   ├── schema.prisma       # Database schema
│   │   │   ├── dev.db              # SQLite database (gitignored)
│   │   │   └── migrations/         # Database migrations
│   │   ├── src/
│   │   │   ├── index.ts            # Express app entry
│   │   │   ├── config/
│   │   │   │   └── database.ts     # Prisma client
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts         # JWT verification
│   │   │   │   └── errorHandler.ts # Error handling
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts      # Auth endpoints
│   │   │   │   ├── movies.routes.ts    # Movie endpoints
│   │   │   │   └── favorites.routes.ts # Favorites endpoints
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts      # Auth logic
│   │   │   │   ├── movies.controller.ts    # Movie logic
│   │   │   │   └── favorites.controller.ts # Favorites logic
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts         # Auth business logic
│   │   │   │   ├── tmdb.service.ts         # TMDB API proxy
│   │   │   │   └── favorites.service.ts    # Favorites logic
│   │   │   └── utils/
│   │   │       ├── jwt.ts              # JWT utilities
│   │   │       └── passwordHash.ts     # Argon2 hashing
│   │   └── tests/
│   │       ├── auth.test.ts        # Auth endpoint tests
│   │       ├── favorites.test.ts   # Favorites tests
│   │       └── movies.test.ts      # Movies tests
│   │
│   └── shared/                     # Shared TypeScript types
│       ├── package.json            # Shared package
│       ├── tsconfig.json           # TypeScript config
│       ├── README.md               # Package documentation
│       └── src/
│           ├── index.ts            # Export all types
│           └── dtos/
│               ├── auth.dto.ts     # Auth DTOs
│               ├── movie.dto.ts    # Movie DTOs
│               └── favorite.dto.ts # Favorite DTOs
│
└── .husky/                         # Git hooks
    └── pre-commit                  # Pre-commit checks
```

---

## 📡 API Documentation

### Backend Endpoints

#### Authentication (Public)

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatarUrl": null
  },
  "token": "jwt_token_here"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### Movies (Public)

```http
GET /api/movies/trending?page=1
Response: 200 OK
{
  "results": [...],
  "page": 1,
  "totalPages": 100,
  "totalResults": 2000
}
```

```http
GET /api/movies/popular?page=1
GET /api/movies/top-rated?page=1
GET /api/movies/search?q=avatar&page=1
GET /api/movies/:id
GET /api/tv/popular?page=1
GET /api/tv/:id
GET /api/person/:id
```

#### Favorites (Protected - Requires JWT)

```http
GET /api/favorites
Authorization: Bearer <jwt_token>

Response: 200 OK
[
  {
    "id": "uuid",
    "tmdbId": 550,
    "title": "Fight Club",
    "posterPath": "/path.jpg",
    "userId": "user_uuid",
    "createdAt": "2025-11-22T00:00:00.000Z"
  }
]
```

```http
POST /api/favorites
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "tmdbId": 550,
  "title": "Fight Club",
  "posterPath": "/path.jpg"
}

Response: 201 Created
```

```http
DELETE /api/favorites/:tmdbId
Authorization: Bearer <jwt_token>

Response: 204 No Content
```

```http
GET /api/favorites/:tmdbId/check
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "isFavorite": true
}
```

---

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Light Mode

- **Login Screen** - Clean authentication interface
- **Registration** - Form with validation
- **Home Screen** - Trending movies grid
- **Movie Details** - Comprehensive movie information
- **Skeleton Loaders** - Loading state placeholders

### Dark Mode

- **Home Screen (Dark)** - Dark theme with proper contrast
- **Movie Details (Dark)** - Professional dark mode design
- **Profile Screen** - User settings and theme toggle

### Features

- **Favorites Screen** - Cloud-synced favorites
- **Search Screen** - Movie search functionality
- **Biometric Prompt** - FaceID/TouchID authentication
- **Shared Element Transition** - Smooth poster animation

Screenshots are located in the `screenshots/` folder.

</details>

---

## 🎥 Demo Video

A comprehensive 3-minute demo video showcasing all features is available:

- **Video Link**: [Watch Demo Video](#) _(Update with actual link)_
- **Features Shown**:
  - User registration and login
  - Movie browsing and details
  - Add/remove favorites
  - Cloud sync demonstration (logout/login test)
  - Dark mode toggle
  - Biometric authentication
  - Infinite scroll and pull-to-refresh
  - Backend showcase

---

## 💻 Development Workflow

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make changes and commit (Husky will run pre-commit hooks)
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

```
feat(auth): implement JWT authentication
fix(mobile): resolve navigation bug
docs(readme): update installation instructions
```

### Code Quality Checks

Before committing, the following checks run automatically (via Husky):

1. **ESLint** - Lints TypeScript files
2. **Prettier** - Formats code
3. **TypeScript** - Checks types

You can also run manually:

```bash
# Lint and fix
npm run lint:fix

# Format code
npm run format

# Type check
npx tsc --noEmit
```

### Database Changes

When modifying the database schema:

```bash
cd packages/server

# 1. Edit prisma/schema.prisma
# 2. Create migration
npm run prisma:migrate

# 3. Regenerate Prisma Client
npm run prisma:generate

# 4. View database (optional)
npm run prisma:studio
```

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**Problem**: Server won't start

```bash
Error: Cannot find module '@prisma/client'
```

**Solution**: Generate Prisma Client

```bash
cd packages/server
npm run prisma:generate
```

---

**Problem**: Database errors

```bash
Error: P1003: Database does not exist
```

**Solution**: Run migrations

```bash
cd packages/server
npm run prisma:migrate
```

---

**Problem**: TMDB API errors

```bash
Error: Invalid API key
```

**Solution**: Check `.env` file in `packages/server/`

- Ensure `TMDB_API_KEY` is set correctly
- Verify API key is active on TMDB website

---

#### Mobile App Issues

**Problem**: Can't connect to backend

```bash
Error: Network request failed
```

**Solution**: Check API URL in `packages/mobile/src/constants/config.ts`

- iOS Simulator: Use `http://localhost:3000/api`
- Android Emulator: Use `http://10.0.2.2:3000/api`
- Physical Device: Use `http://YOUR_LOCAL_IP:3000/api`

To find your local IP:

- Windows: `ipconfig`
- macOS/Linux: `ifconfig` or `hostname -I`

---

**Problem**: Metro bundler cache issues

**Solution**: Clear cache

```bash
cd packages/mobile
npx expo start --clear
```

---

**Problem**: iOS build fails

```bash
Error: Command PhaseScriptExecution failed
```

**Solution**:

1. Clean build folder: `cd ios && rm -rf build && cd ..`
2. Reinstall pods: `cd ios && pod install && cd ..`
3. Restart Expo: `npx expo start --clear`

---

**Problem**: Android build fails

**Solution**:

1. Clean Gradle cache: `cd android && ./gradlew clean && cd ..`
2. Restart Expo: `npx expo start --clear`
3. Ensure Android SDK is properly configured

---

#### TypeScript Issues

**Problem**: Type errors

```bash
Error: Type '...' is not assignable to type '...'
```

**Solution**: Ensure Prisma Client is generated

```bash
cd packages/server
npm run prisma:generate
```

---

### Getting Help

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/Akith-002/StreamBox/issues)
2. Consult [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

## 🤝 Contributing

Contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages (Conventional Commits)
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 StreamBox Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Project Maintainer**: Akith-002

- **GitHub**: [@Akith-002](https://github.com/Akith-002)
- **Repository**: [StreamBox](https://github.com/Akith-002/StreamBox)

---

## 🙏 Acknowledgments

- **TMDB** - Movie data and images (https://www.themoviedb.org/)
- **Expo Team** - Amazing React Native framework
- **Prisma Team** - Type-safe ORM
- **Redux Team** - Redux Toolkit and RTK Query
- **React Navigation** - Navigation library

---

## 📚 Additional Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed system architecture

---

## 🎯 Project Highlights

### What Makes StreamBox Special

✨ **Production-Ready Architecture**

- Backend for Frontend (BFF) pattern
- Monorepo with npm workspaces
- End-to-end type safety

🔒 **Enterprise Security**

- JWT authentication with Argon2 hashing
- Hardware-encrypted token storage
- Protected API routes
- API key abstraction

🎨 **Professional UX**

- Skeleton loading states
- Infinite scroll pagination
- Pull-to-refresh
- Shared element transitions
- Dark mode support
- Biometric authentication

💻 **Code Quality**

- TypeScript strict mode
- 25 passing tests
- ESLint + Prettier + Husky
- Comprehensive documentation

🚀 **Scalable Design**

- Service-oriented architecture
- Repository pattern
- Modular components
- Easy to extend

---

## 📊 Project Statistics

- **Lines of Code**: ~5,000+
- **Files**: 60+
- **Packages**: 3 (mobile, server, shared)
- **Tests**: 25 passing
- **Features**: 30+ implemented
- **Screens**: 10+ mobile screens
- **API Endpoints**: 15+

---

**⭐ If you find this project helpful, please give it a star on GitHub!**

---

**Built with ❤️ by the StreamBox Team**

---

**Last Updated**: November 2025
