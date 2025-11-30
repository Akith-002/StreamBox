# StreamBox - System Architecture

**Enterprise-Grade Full-Stack Architecture**

---

## Architecture Overview

StreamBox implements a **Backend for Frontend (BFF)** pattern with a monorepo structure, demonstrating production-ready architecture used by companies like Netflix, Spotify, and Uber.

```
┌─────────────────────────────────────────────────────────────┐
│                     StreamBox Architecture                   │
│                    (Monorepo with npm workspaces)            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────┐      │
│   │         Mobile App (React Native + Expo)        │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  UI Components                            │  │      │
│   │  │  - MovieCard, SkeletonLoader, etc.       │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Navigation                               │  │      │
│   │  │  - Stack, Tabs, Conditional Auth          │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  State Management (Redux Toolkit)         │  │      │
│   │  │  - authSlice, uiSlice, RTK Query          │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Security Layer                           │  │      │
│   │  │  - Expo SecureStore (JWT tokens)          │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   └─────────────────────────────────────────────────┘      │
│                            │                                 │
│                    HTTPS (REST API)                          │
│                      JWT Bearer Token                        │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                      BACKEND LAYER                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────┐      │
│   │    Backend Server (Node.js + Express)           │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Middleware Stack                         │  │      │
│   │  │  - CORS, Helmet (security headers)        │  │      │
│   │  │  - JSON body parser                       │  │      │
│   │  │  - JWT auth middleware                    │  │      │
│   │  │  - Error handler                          │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Routes Layer                             │  │      │
│   │  │  - /api/auth/*     (public)               │  │      │
│   │  │  - /api/movies/*   (public)               │  │      │
│   │  │  - /api/favorites/* (protected)           │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Controllers Layer                        │  │      │
│   │  │  - auth.controller.ts                     │  │      │
│   │  │  - movies.controller.ts                   │  │      │
│   │  │  - favorites.controller.ts                │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Services Layer (Business Logic)          │  │      │
│   │  │  - auth.service.ts (JWT, Argon2)          │  │      │
│   │  │  - tmdb.service.ts (API proxy)            │  │      │
│   │  │  - favorites.service.ts (CRUD)            │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  Security Utilities                       │  │      │
│   │  │  - JWT generation/verification            │  │      │
│   │  │  - Argon2 password hashing                │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   └─────────────────────────────────────────────────┘      │
│                     │                    │                   │
│              ┌──────┴──────┐     ┌──────▼──────┐           │
│              │  Database   │     │  External   │           │
│              │  (Prisma)   │     │  API Proxy  │           │
│              └──────┬──────┘     └──────┬──────┘           │
└─────────────────────┼─────────────────────┼─────────────────┘
                      │                     │
┌─────────────────────▼─────────────────────▼─────────────────┐
│                    DATA LAYER                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────────┐        ┌──────────────────────┐ │
│   │  SQLite Database     │        │  TMDB API            │ │
│   │  (via Prisma ORM)    │        │  (themoviedb.org)    │ │
│   │                      │        │                      │ │
│   │  Tables:             │        │  Endpoints:          │ │
│   │  - User              │        │  - /trending/movie   │ │
│   │  - Favorite          │        │  - /search/movie     │ │
│   │                      │        │  - /movie/:id        │ │
│   │  Features:           │        │                      │ │
│   │  - Type-safe queries │        │  Security:           │ │
│   │  - Migrations        │        │  - API key hidden    │ │
│   │  - Relations         │        │  - Proxied by server │ │
│   └──────────────────────┘        └──────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   SHARED TYPE LAYER                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────┐      │
│   │      Shared Package (@streambox/shared)         │      │
│   │  ┌───────────────────────────────────────────┐  │      │
│   │  │  DTOs (Data Transfer Objects)             │  │      │
│   │  │  - auth.dto.ts                            │  │      │
│   │  │  - movie.dto.ts                           │  │      │
│   │  │  - favorite.dto.ts                        │  │      │
│   │  │                                           │  │      │
│   │  │  Benefits:                                │  │      │
│   │  │  - End-to-end type safety                 │  │      │
│   │  │  - Single source of truth                 │  │      │
│   │  │  - Prevents API mismatches                │  │      │
│   │  │  - Compile-time error detection           │  │      │
│   │  └───────────────────────────────────────────┘  │      │
│   └─────────────────────────────────────────────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Architecture Patterns

### 1. Backend for Frontend (BFF)

**Problem**: Exposing TMDB API key in mobile app is a security risk.

**Solution**: Custom backend acts as a proxy:

- Mobile app calls our backend
- Backend forwards requests to TMDB
- API key stays secure on server
- Backend can add custom business logic

**Benefits**:

- Security: API keys never exposed
- Flexibility: Backend can aggregate multiple APIs
- Control: Rate limiting, caching, logging
- Privacy: User data stays on our servers

### 2. Monorepo Architecture

**Structure**:

```
StreamBox/
├── packages/
│   ├── mobile/    # React Native app
│   ├── server/    # Node.js backend
│   └── shared/    # TypeScript types
```

**Benefits**:

- Single repository for entire project
- Shared code between frontend/backend
- Consistent versioning
- Simplified dependency management
- Easier refactoring

### 3. Service-Oriented Architecture (SOA)

**Layers**:

```
Routes → Controllers → Services → Data Access
```

**Responsibilities**:

- **Routes**: HTTP endpoint definitions
- **Controllers**: Request/response handling
- **Services**: Business logic implementation
- **Data Access**: Database operations (Prisma)

**Benefits**:

- Clear separation of concerns
- Easy to test (mock services)
- Reusable business logic
- Maintainable codebase

### 4. Repository Pattern (via Prisma)

**Implementation**:

```typescript
// Service layer uses Prisma client
const user = await prisma.user.findUnique({ where: { email } });
```

**Benefits**:

- Database abstraction
- Type-safe queries
- Auto-generated types
- Migration management
- Easy database switching

---

## Data Flow

### Authentication Flow

```
┌──────────┐  1. Register/Login   ┌──────────┐
│  Mobile  │ ────────────────────> │  Server  │
│   App    │                       │          │
└──────────┘                       └────┬─────┘
     ↑                                  │
     │                                  │ 2. Hash password
     │                                  │    (Argon2)
     │                                  │
     │                                  │ 3. Save to DB
     │                                  │    (Prisma)
     │                                  ↓
     │                            ┌──────────┐
     │                            │   SQLite │
     │                            │ Database │
     │                            └──────────┘
     │                                  │
     │                                  │ 4. Generate JWT
     │                                  │
     │ 5. Return JWT token              │
     │    + user info                   │
     ←────────────────────────────────────
     │
     │ 6. Store in SecureStore
     │    (hardware encrypted)
     ↓
┌──────────┐
│  Secure  │
│ Storage  │
└──────────┘
```

### Movie Browsing Flow

```
┌──────────┐  1. Get trending   ┌──────────┐
│  Mobile  │ ──────────────────> │  Server  │
│   App    │    movies           │          │
└──────────┘                     └────┬─────┘
     ↑                                │
     │                                │ 2. Forward request
     │                                │    to TMDB API
     │                                ↓
     │                          ┌──────────┐
     │                          │   TMDB   │
     │                          │   API    │
     │                          └────┬─────┘
     │                               │
     │                               │ 3. Return movie data
     │                               │
     │ 4. Return movies to           │
     │    mobile app            ←─────
     ←────────────────────────────────
     │
     │ 5. Display in UI
     │    (with skeleton loaders)
     ↓
```

### Favorites Sync Flow

```
┌──────────┐  1. Add favorite   ┌──────────┐
│  Mobile  │ ──────────────────> │  Server  │
│   App    │    + JWT token      │          │
└──────────┘                     └────┬─────┘
     ↑                                │
     │                                │ 2. Verify JWT
     │                                │    (auth middleware)
     │                                │
     │                                │ 3. Save to DB
     │                                │    (Prisma)
     │                                ↓
     │                          ┌──────────┐
     │                          │  SQLite  │
     │                          │ Database │
     │                          └────┬─────┘
     │                               │
     │                               │ 4. Return success
     │                               │
     │ 5. Update UI                  │
     │    (optimistic update)   ←─────
     ←────────────────────────────────
     │
     │ 6. Cloud sync complete
     │    (persists across devices)
     ↓
```

---

## Security Architecture

### Multi-Layer Security

**1. Client-Side Security**

- Hardware-encrypted token storage (Expo SecureStore)
- No sensitive data in client code
- Secure HTTPS communication

**2. Network Security**

- JWT Bearer token authentication
- HTTPS only (no HTTP allowed)
- CORS configuration
- Helmet security headers

**3. Server-Side Security**

- Argon2 password hashing (OWASP recommended)
- JWT secret key (environment variable)
- Authentication middleware on protected routes
- Input validation on all endpoints
- SQL injection prevention (Prisma)

**4. API Security**

- TMDB API key hidden on server
- Rate limiting (optional, can be added)
- Request sanitization
- Error messages don't leak sensitive info

### Authentication Token Flow

```
┌─────────────────────────────────────────────────────────┐
│                    JWT Token Lifecycle                   │
└─────────────────────────────────────────────────────────┘

1. User Login
   ↓
2. Server verifies password (Argon2)
   ↓
3. Server generates JWT
   {
     userId: "123",
     email: "user@example.com",
     iat: 1234567890,
     exp: 1234654290
   }
   ↓
4. Server signs JWT with secret key
   ↓
5. Client receives token
   ↓
6. Client stores in SecureStore (hardware encrypted)
   ↓
7. Client includes in all requests:
   Authorization: Bearer <token>
   ↓
8. Server verifies token signature
   ↓
9. Server extracts userId from payload
   ↓
10. Server processes request
```

---

## Technology Stack Rationale

### Frontend (Mobile)

**React Native + Expo**

- Cross-platform (iOS + Android)
- Hot reload for fast development
- Large ecosystem
- Native module access

**Redux Toolkit**

- Predictable state management
- DevTools for debugging
- RTK Query for API caching
- Type-safe with TypeScript

**React Navigation**

- Standard navigation library
- Type-safe navigation params
- Flexible navigation patterns

**Expo SecureStore**

- Hardware-backed encryption
- Simple API
- iOS Keychain / Android Keystore

### Backend (Server)

**Node.js + Express**

- JavaScript/TypeScript ecosystem
- Fast development
- Large middleware ecosystem
- Easy deployment

**Prisma ORM**

- Type-safe database queries
- Auto-generated types
- Migration system
- Multiple database support

**SQLite**

- File-based (easy setup)
- Zero configuration
- Production-ready for small-medium apps
- Can migrate to PostgreSQL later

**JWT (jsonwebtoken)**

- Stateless authentication
- No session storage needed
- Standard format
- Scalable

**Argon2**

- OWASP recommended
- More secure than bcrypt
- Memory-hard function
- Resistant to GPU attacks

### Shared

**TypeScript**

- Type safety across stack
- Catch errors at compile time
- Better IDE support
- Self-documenting code

---

## Scalability Considerations

### Current Architecture

**Suitable for:**

- 1-10,000 users
- Personal projects
- MVPs and prototypes
- Small to medium apps

**Limitations:**

- SQLite (file-based database)
- No load balancing
- No caching layer
- No CDN for assets

### Production Enhancements

**For 10,000+ users:**

1. **Database Migration**
   - SQLite → PostgreSQL/MySQL
   - Connection pooling
   - Read replicas

2. **Caching Layer**
   - Redis for session storage
   - API response caching
   - Database query caching

3. **Load Balancing**
   - Multiple server instances
   - Nginx/HAProxy load balancer
   - Auto-scaling

4. **CDN & Assets**
   - CloudFront/Cloudflare CDN
   - Image optimization
   - Static asset caching

5. **Monitoring & Logging**
   - Sentry for error tracking
   - New Relic/Datadog for performance
   - Winston for structured logging

6. **CI/CD Pipeline**
   - GitHub Actions/GitLab CI
   - Automated testing
   - Automated deployment

---

## Performance Optimizations

### Implemented

- ✅ **Skeleton loaders** - Perceived performance
- ✅ **Infinite scroll** - Lazy loading
- ✅ **RTK Query caching** - Reduce API calls
- ✅ **Optimistic updates** - Instant UI feedback
- ✅ **Pull-to-refresh** - Manual data refresh

### Future Optimizations

- [ ] Redis caching for API responses
- [ ] Image lazy loading and compression
- [ ] Backend pagination optimization
- [ ] GraphQL (replace REST API)
- [ ] Service Workers (offline mode)

---

## Deployment Architecture

### Mobile App

```
Developer Machine
      ↓
   Git Push
      ↓
GitHub Repository
      ↓
Expo EAS Build
      ↓
   ┌────────┬────────┐
   ↓        ↓        ↓
iOS App  Android  Web App
 Store     Play    (PWA)
           Store
```

### Backend Server

```
Developer Machine
      ↓
   Git Push
      ↓
GitHub Repository
      ↓
CI/CD Pipeline
      ↓
   ┌────────┬────────┬────────┐
   ↓        ↓        ↓        ↓
Railway  Render   AWS    Vercel
(Free)   (Free)  (Paid) (Free)
```

### Recommended Production Stack

```
┌──────────────────────────────────────┐
│      Mobile Apps (Users)             │
└──────────────┬───────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼───────────────────────┐
│    Cloudflare CDN + DDoS Protection  │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│    Load Balancer (AWS ALB)           │
└──────┬───────────────────────┬───────┘
       │                       │
┌──────▼──────┐        ┌──────▼──────┐
│ Server      │        │ Server      │
│ Instance 1  │        │ Instance 2  │
└──────┬──────┘        └──────┬──────┘
       │                       │
       └───────────┬───────────┘
                   │
┌──────────────────▼───────────────────┐
│    PostgreSQL Database (RDS)         │
│    with Read Replicas                │
└──────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────┐
│    Redis Cache (ElastiCache)         │
└──────────────────────────────────────┘
```

---

## Testing Architecture

### Test Pyramid

```
            ┌─────────┐
           / E2E Tests \          ← Few (expensive, slow)
          /   (Manual)  \
         └───────────────┘
        ┌─────────────────┐
       /  Integration Tests\      ← Some (API tests)
      /    (Supertest)      \
     └──────────────────────┘
    ┌────────────────────────┐
   /      Unit Tests          \   ← Many (fast, cheap)
  /   (Jest + Services)       \
 └──────────────────────────────┘
```

### Current Test Coverage

- **Backend Auth**: 9 tests ✅
- **Backend Favorites**: 16 tests ✅
- **Backend Movies**: 16 tests (skipped without API key)
- **Frontend**: Manual testing ✅

### Future Testing

- Component tests (React Native Testing Library)
- E2E tests (Detox/Appium)
- Performance tests (Lighthouse)
- Security tests (OWASP ZAP)

---

## Conclusion

StreamBox demonstrates production-ready architecture with:

- ✅ **Security**: JWT, Argon2, SecureStore, API proxy
- ✅ **Scalability**: Service-oriented design, modular structure
- ✅ **Maintainability**: Type safety, testing, documentation
- ✅ **Performance**: Caching, lazy loading, optimizations
- ✅ **Best Practices**: BFF pattern, monorepo, separation of concerns

The architecture is designed to be:

- **Easy to understand** - Clear layers and responsibilities
- **Easy to extend** - Modular, loosely coupled
- **Easy to test** - Service layer, dependency injection
- **Easy to deploy** - Multiple deployment options
- **Production-ready** - Security, error handling, monitoring

---

**Total Architectural Patterns Used**: 6

- Backend for Frontend (BFF)
- Monorepo Architecture
- Service-Oriented Architecture
- Repository Pattern
- Layered Architecture
- Middleware Pattern

**Design Principles Applied**:

- SOLID principles
- Separation of Concerns
- DRY (Don't Repeat Yourself)
- Single Source of Truth
- Security by Design
- Fail Fast (validation)

This architecture can scale from 1 user to 1 million users with appropriate infrastructure upgrades while maintaining the same codebase structure.
