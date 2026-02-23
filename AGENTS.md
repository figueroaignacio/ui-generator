# AGENTS.md - Development Guide

## Project Overview

This is a Turborepo monorepo containing:
- `apps/web` - Next.js 16 web application (React 19)
- `apps/api` - NestJS backend API
- `packages/ui` - Shared React component library
- `packages/eslint-config` - ESLint configurations
- `packages/typescript-config` - TypeScript configurations

## Build/Lint/Test Commands

### Root Commands (from monorepo root)

```bash
# Build all packages
pnpm build

# Develop all packages
pnpm dev

# Lint all packages
pnpm lint

# Check types across all packages
pnpm check-types

# Format code (Prettier)
pnpm format
```

### App-Specific Commands

```bash
# Web app (Next.js)
cd apps/web
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# API app (NestJS)
cd apps/api
pnpm dev          # Start with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm start:prod   # Start from built files

# UI Package
cd packages/ui
pnpm lint         # Run ESLint
pnpm check-types  # Type check
```

### Running a Single Test

**Note:** This project does not currently have a test framework configured. Tests are not being run. If adding tests, use:
- Vitest for unit tests (recommended for this stack)
- Testing Library for React component testing

### Turbo Filtering

Use Turbo filters to run commands on specific packages:
```bash
pnpm build --filter=web
pnpm lint --filter=api
pnpm dev --filter=@repo/ui
```

## Code Style Guidelines

### Formatting (Prettier)

- **Semicolons**: Yes
- **Single quotes**: Yes
- **Print width**: 100
- **Tab width**: 2
- **Trailing commas**: All
- **Arrow parens**: Avoid

Run `pnpm format` to auto-format all code.

### TypeScript

- **Strict mode**: Enabled globally
- **`noUncheckedIndexedAccess`**: Enabled - array access returns `T | undefined`
- **Module system**: ESNext for Next.js, NodeNext for packages
- **Always use explicit types** for function parameters and return types
- **Avoid `any`** - use `unknown` if type is truly unknown

### Imports

- Use **path aliases** (`@/*` for apps/web):
  ```typescript
  import { useAuth } from '@/features/auth/hooks/use-auth';
  import { Button } from '@repo/ui/button';
  ```
- **Group imports** in this order:
  1. External libraries (React, Next.js, etc.)
  2. Internal packages (`@repo/ui`, etc.)
  3. Path alias imports (`@/features/...`)
  4. Relative imports (`../`, `./`)
- Use **named exports** over default exports for components

### Naming Conventions

- **Components**: PascalCase (`ChatPage`, `ButtonGroup`)
- **Hooks**: camelCase with `use` prefix (`useConversations`, `useAuth`)
- **Utilities/functions**: camelCase (`cn`, `createConversation`)
- **Types/Interfaces**: PascalCase (`ButtonProps`, `Message`)
- **Files**: kebab-case for components/hooks (`chat-page.tsx`), PascalCase for types (`User.ts`)

### React Components

- Use **client components** with `'use client'` directive at top
- Use **functional components** with explicit return types when needed
- Use `forwardRef` for components that need ref forwarding
- Always set `displayName` for forwarded ref components
- Use **CVA (class-variance-authority)** for component variants

### State Management

- Use **Zustand** for global state in the web app
- Use local `useState` for component-level state
- Use `useCallback` and `useMemo` for performance optimization

### Styling

- **Tailwind CSS v4** - use utility classes
- Use `cn()` utility (from `@repo/ui/lib/cn`) for conditional class merging
- Use `cva` for component variants

### Error Handling

- Use **try/catch** for async operations
- Use appropriate **NestJS exceptions** in API (`NotFoundException`, `BadRequestException`, etc.)
- Log errors appropriately (`console.error` in client code)
- Return meaningful error messages to clients

### Animations

- Use **motion/react** for animations
- Use `AnimatePresence` for exit animations
- Define transitions consistently

### ESLint Configuration

- **apps/web**: Uses `eslint-config-next` with TypeScript support
- **apps/api**: Uses `@typescript-eslint` with recommended rules
- **packages/ui**: Uses `@repo/eslint-config/react-internal`

Run `pnpm lint` before committing to catch issues.

### File Organization

```
apps/web/src/
  features/       # Feature-based organization
    chat/
      api/       # API calls
      components/# Feature components
      hooks/    # Feature hooks
      store/    # Zustand stores
      types/    # TypeScript types
  lib/           # Shared utilities
  app/           # Next.js app router pages

apps/api/src/
  modules/       # NestJS modules (feature-based)
    users/
      dto/      # Data Transfer Objects
      entities/ # TypeORM entities
```

### Common Patterns

- **API calls**: Separate API functions from components in `api/` folders
- **Types**: Export from `index.ts` in types folder
- **Components**: Co-locate types with component file or in separate `types/` folder
- **Store**: Single Zustand store per feature domain

## Environment Variables

Create `.env` files as needed (never commit secrets):
- `apps/web/.env.local` for Next.js
- `apps/api/.env` for NestJS

## Dependencies

- **Package Manager**: pnpm v9.0.0
- **Node**: >= 18
- **Runtime**: React 19, Next.js 16, NestJS 11
