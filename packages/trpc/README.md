# NachAI tRPC Contract

The NachAI tRPC package defines the shared API contract between the backend (apps/api) and the frontend (apps/web). It serves as a single source of truth for the application's data exchange layer, ensuring end-to-end type safety and reducing runtime errors.

## Core Technologies

- Communication: tRPC v11 (Release Candidate)
- Validation: Zod schemas for request and response verification
- Integration: Shared workspace package (@repo/trpc)

## Architectural Role

### Type-Safe API Definition
The package exports the `AppRouter` type and all relevant input/output schemas. This allows:
- Backend implementation: NestJS controllers implementing defined procedures.
- Frontend consumption: React Query hooks generated from the trpc client.

### Shared Schemas
Complex data structures, such as conversation history, generated UI assets, and user profiles, are defined using Zod schemas within this package. This eliminates duplication and ensures that both ends of the application agree on the data format.

## Implementation Structure

### Workspace Configuration
The package is structured for efficient distribution within the pnpm monorepo:
```json
{
  "name": "@repo/trpc",
  "dependencies": {
    "@trpc/server": "^11.0.0-rc.820",
    "zod": "^3.24.2"
  }
}
```

### Shared Exports
- `AppRouter`: The complete router definition for the API.
- `RouterInputs`: Utility type for deriving procedure input types.
- `RouterOutputs`: Utility type for deriving procedure output types.

## Usage in Workspaces

### Backend Integration
```typescript
import { AppRouter } from '@repo/trpc';

// NestJS implementation logic
```

### Frontend Integration
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@repo/trpc';

export const trpc = createTRPCReact<AppRouter>();
```

## Technical Maintenance

### Build and Validation
- `check-types`: Ensures that all schema and router definitions are valid.
- `pnpm lint`: Standardized code quality checks.

Technical Lead: [Ignacio Figueroa](https://github.com/figueroaignacio)
