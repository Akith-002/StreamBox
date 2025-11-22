# 📦 StreamBox Monorepo Guide

This guide explains the monorepo structure, how it works, and why we use it.

## What is a Monorepo?

A **monorepo** (monolithic repository) is a software development strategy where code for many projects is stored in a single repository. Companies like Google, Facebook, Microsoft, and Uber use monorepos.

## Why Use a Monorepo for StreamBox?

### 1. **End-to-End Type Safety**

With shared TypeScript types, we ensure the mobile app and backend (Phase 7+) always stay in sync:

```typescript
// Defined once in @streambox/shared
export interface LoginDto {
  username: string;
  password: string;
}

// Used in mobile
import { LoginDto } from "@streambox/shared";

// Used in backend (Phase 7+)
import { LoginDto } from "@streambox/shared";
```

### 2. **Single Source of Truth**

- Types are defined once in `@streambox/shared`
- Changes automatically propagate to all packages
- No API contract mismatches

### 3. **Simplified Dependency Management**

- Single `node_modules` at root
- Shared dependencies are deduplicated
- Easier to upgrade libraries

### 4. **Better Developer Experience**

- Everything in one place
- Easy to navigate
- Easier to refactor across packages

### 5. **Atomic Changes**

- Update types and implementations together
- Single PR for cross-package changes
- Better git history

## Package Structure

```
StreamBox/
├── package.json                  # Root workspace config
├── packages/
│   ├── mobile/                   # @streambox/mobile
│   │   └── package.json
│   ├── shared/                   # @streambox/shared
│   │   └── package.json
│   └── server/                   # @streambox/server (Phase 7+)
│       └── package.json
```

## Package Descriptions

### `@streambox/mobile`

The React Native mobile application.

**Technologies**:

- React Native (Expo)
- Redux Toolkit
- React Navigation
- TypeScript

**Depends On**:

- `@streambox/shared` - For type definitions

### `@streambox/shared`

Shared TypeScript types and DTOs.

**Exports**:

- Authentication types (`LoginDto`, `RegisterDto`, `AuthResponse`)
- Movie types (`MovieDto`, `MovieDetailsDto`, `PaginatedMoviesResponse`)
- Favorite types (`FavoriteDto`, `AddFavoriteDto`)

**Used By**:

- `@streambox/mobile`
- `@streambox/server` (Phase 7+)

### `@streambox/server` (Phase 7+)

Node.js + Express backend with Prisma ORM.

**Technologies**:

- Node.js + Express
- Prisma ORM
- SQLite
- JWT Authentication

**Depends On**:

- `@streambox/shared` - For type definitions

## npm Workspaces Commands

### Basic Commands

```bash
# Install all dependencies
npm install

# Run mobile app
npm run mobile

# Build shared package
npm run shared:build

# Watch shared package for changes
npm run shared:watch
```

### Workspace-Specific Commands

```bash
# Run command in specific workspace
npm run <script> --workspace=@streambox/<package>

# Examples:
npm run start --workspace=@streambox/mobile
npm run build --workspace=@streambox/shared
npm run dev --workspace=@streambox/server  # Phase 7+

# Install dependency to specific workspace
npm install <package> --workspace=@streambox/<package>

# Example:
npm install lodash --workspace=@streambox/mobile
```

### Advanced Commands

```bash
# Run command in all workspaces
npm run <script> --workspaces

# List all workspaces
npm list --workspaces --depth=0

# Clean all workspaces
npm run clean --workspaces --if-present
```

## How Shared Types Work

### 1. Define Types Once

In `packages/shared/src/dtos/auth.dto.ts`:

```typescript
export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}
```

### 2. Build Shared Package

```bash
npm run shared:build
```

This compiles TypeScript and generates:

- `packages/shared/dist/index.js` - Compiled JavaScript
- `packages/shared/dist/index.d.ts` - Type definitions

### 3. Use in Mobile App

In `packages/mobile/src/screens/LoginScreen.tsx`:

```typescript
import { LoginDto, AuthResponse } from "@streambox/shared";

const onSubmit = async (data: LoginDto) => {
  const response: AuthResponse = await loginApi(data);
  // TypeScript knows exactly what fields are in response!
};
```

### 4. Use in Backend (Phase 7+)

In `packages/server/src/controllers/auth.controller.ts`:

```typescript
import { LoginDto, AuthResponse } from "@streambox/shared";

export const login = async (req: Request, res: Response) => {
  const loginData: LoginDto = req.body;
  const response: AuthResponse = {
    user: { ... },
    token: "..."
  };
  res.json(response);
};
```

### 5. Type Safety Guaranteed!

If you change the type definition:

```typescript
export interface LoginDto {
  username: string;
  password: string;
  rememberMe?: boolean; // New field
}
```

TypeScript will immediately show errors in:

- Mobile app (if not handling the field)
- Backend (if not sending the field)
- All places that use `LoginDto`

## Development Workflow

### Daily Development

1. **Start shared package watcher** (runs in background):

   ```bash
   npm run shared:watch
   ```

2. **Start mobile app**:

   ```bash
   npm run mobile
   ```

3. **Make changes to shared types**:

   - Edit files in `packages/shared/src/`
   - Watcher automatically rebuilds
   - Changes reflect in mobile app

4. **Start backend** (Phase 7+):
   ```bash
   npm run server
   ```

### Adding New Shared Types

1. Create new file in `packages/shared/src/dtos/`
2. Export from `packages/shared/src/index.ts`
3. Build: `npm run shared:build`
4. Import in mobile/server: `import { ... } from "@streambox/shared"`

### Example: Adding Search Types

1. Create `packages/shared/src/dtos/search.dto.ts`:

   ```typescript
   export interface SearchQuery {
     query: string;
     page?: number;
     includeAdult?: boolean;
   }

   export interface SearchResult {
     results: MovieDto[];
     totalResults: number;
   }
   ```

2. Export in `packages/shared/src/index.ts`:

   ```typescript
   export * from "./dtos/search.dto";
   ```

3. Build:

   ```bash
   npm run shared:build
   ```

4. Use anywhere:
   ```typescript
   import { SearchQuery, SearchResult } from "@streambox/shared";
   ```

## Benefits in Action

### Scenario 1: Changing API Response

**Without Monorepo**:

1. Change backend response structure
2. Hope you remember to update mobile app
3. Runtime errors when fields are missing
4. Debug production issues

**With Monorepo**:

1. Change type in `@streambox/shared`
2. TypeScript immediately shows errors in mobile and backend
3. Fix all issues before running
4. No runtime surprises!

### Scenario 2: Adding New Feature

**Without Monorepo**:

1. Define types in mobile
2. Define same types in backend
3. Keep both in sync manually
4. API contract drift over time

**With Monorepo**:

1. Define types once in `@streambox/shared`
2. Use in both mobile and backend
3. Always in sync
4. Single source of truth

### Scenario 3: Refactoring

**Without Monorepo**:

1. Change field name in backend
2. Find all places in mobile that use it
3. Miss some places
4. Production bugs

**With Monorepo**:

1. Change type in `@streambox/shared`
2. TypeScript shows all places that need updates
3. Fix all at once
4. Compile errors prevent bugs

## Best Practices

### 1. Always Build Shared Package After Changes

```bash
npm run shared:build
```

Or use watch mode during development:

```bash
npm run shared:watch
```

### 2. Don't Duplicate Types

❌ **Bad**:

```typescript
// In mobile
interface User {
  id: number;
  name: string;
}

// In backend
interface User {
  id: number;
  name: string;
}
```

✅ **Good**:

```typescript
// In @streambox/shared
export interface User {
  id: number;
  name: string;
}

// In mobile and backend
import { User } from "@streambox/shared";
```

### 3. Use Semantic Versioning for Shared Package

When making breaking changes to shared types:

1. Update version in `packages/shared/package.json`
2. Update dependencies in other packages
3. Document breaking changes

### 4. Keep Shared Package Lightweight

Only include:

- ✅ Type definitions
- ✅ Interfaces
- ✅ DTOs
- ✅ Constants (if truly shared)

Don't include:

- ❌ React components
- ❌ Backend-specific logic
- ❌ Mobile-specific code

## Troubleshooting

### Issue: "Cannot find module '@streambox/shared'"

**Solution**:

```bash
# 1. Build shared package
npm run shared:build

# 2. Reinstall dependencies
npm install

# 3. Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
```

### Issue: Changes to shared types not reflecting

**Solution**:

```bash
# 1. Rebuild shared package
npm run shared:build

# 2. Restart mobile app
npm run mobile

# 3. Or use watch mode
npm run shared:watch
```

### Issue: TypeScript errors after updating shared types

**Solution**:
This is expected! TypeScript is showing you all places that need updates.

1. Read the error messages
2. Update the code to match new types
3. Compile again

## Moving Forward (Phase 7+)

When adding the backend in Phase 7, the structure becomes:

```
StreamBox/
├── packages/
│   ├── mobile/          # Uses @streambox/shared
│   ├── server/          # Uses @streambox/shared
│   └── shared/          # Source of truth
```

All three packages will share the same type definitions, ensuring perfect synchronization across the entire stack!

## Resources

- [npm Workspaces Documentation](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**Built with ❤️ for IN3210 Mobile Applications Development**
