# NachAI

NachAI is an AI-driven UI generation platform that converts natural language descriptions into production-ready web interfaces. Developed with a modern monorepo architecture, it utilizes generative AI to optimize the design-to-code pipeline.

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Turbo](https://img.shields.io/badge/Turbo-2.0-EF4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)

## Technical Features

- AI-Driven Generation: Orchestrates professional UI component generation through structured natural language processing.
- Real-Time Streaming Middleware: Implements live AI response streaming for instantaneous feedback loops.
- Identity and Access Management: Secure authentication architecture utilizing GitHub and Google OAuth providers, implemented via Passport.js and JSON Web Tokens (JWT).
- Unified Design System: Comprehensive UI framework built on Tailwind CSS 4, Motion, and Hugeicons for a standardized, responsive interface.
- Data Persistence: Manages session history and creative assets through a scalable storage layer.
- Monorepo Infrastructure: Optimized development workflow using Turborepo and pnpm for efficient workspace management.

## Technical Architecture

### Frontend (apps/web)

- Framework: Next.js 16+ utilizing App Router and Server Components.
- Styling: Utility-first CSS via Tailwind CSS 4 with PostCSS.
- Animations: Declarative motion logic using Framer Motion.
- State Management: Lightweight client state with Zustand and server state synchronization via TanStack Query.
- API Client: Type-safe communication layer powered by tRPC.

### Backend (apps/api)

- Framework: NestJS 11 for a modular, scalable server-side architecture.
- Persistence: TypeORM with PostgreSQL for relational data mapping and migrations.
- AI Integration: Vercel AI SDK and Google Gemini for advanced model orchestration.
- Security Infrastructure: Passport-based middleware for multi-provider OAuth and JWT-based session management.

### Shared Infrastructure (packages/*)

- @repo/ui: Standardized React component library and theme tokens.
- @repo/ai: Core AI orchestration logic and prompt management.
- @repo/trpc: Shared API contract ensuring full stack type safety.
- @repo/typescript-config: Centralized TypeScript configurations.
- @repo/eslint-config: Unified linting and code quality standards.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9 or higher)
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ui-generator.git
   cd ui-generator
   ```

2. Bootstrap dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   - apps/api: Define variables in .env (refer to .env.example).
   - apps/web: Define variables in .env.local (refer to .env.local.example).

### Running Locally

Execute the following command to start all workspaces in development mode:
```bash
pnpm dev
```

Project endpoints:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Workspace Structure

```text
.
├── apps
│   ├── api           # NestJS backend service
│   └── web           # Next.js frontend application
├── packages
│   ├── ai            # Core AI orchestration library
│   ├── ui            # Shared component library
│   ├── trpc          # Type-safe API contract
│   ├── eslint-config # Shared ESLint configurations
│   └── tsconfig      # Shared TypeScript configurations
├── package.json
└── turbo.json
```

## Build Process

To compile all applications and packages via Turborepo:
```bash
pnpm build
```

Created by [Ignacio Figueroa](https://github.com/figueroaignacio)

