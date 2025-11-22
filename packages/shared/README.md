# @streambox/shared

Shared TypeScript types and DTOs for the StreamBox monorepo.

## Overview

This package contains shared type definitions, interfaces, and DTOs (Data Transfer Objects) that are used across both the mobile app and backend server. This ensures end-to-end type safety and prevents API mismatches.

## Structure

```
src/
├── dtos/
│   ├── auth.dto.ts       # Authentication types
│   ├── movie.dto.ts      # Movie data types
│   └── favorite.dto.ts   # Favorites types
└── index.ts              # Main exports
```

## Usage

### In Mobile App

```typescript
import { LoginDto, AuthResponse, MovieDto } from "@streambox/shared";

const loginData: LoginDto = {
  username: "user",
  password: "password",
};
```

### In Backend Server

```typescript
import { RegisterDto, AuthResponse } from "@streambox/shared";

const response: AuthResponse = {
  user: { ... },
  token: "..."
};
```

## Benefits

- **Type Safety**: Compile-time error detection across the entire stack
- **Single Source of Truth**: Types are defined once and used everywhere
- **API Contract**: Ensures mobile and backend always stay in sync
- **Refactoring**: Changes to types are automatically reflected everywhere

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run watch
```
