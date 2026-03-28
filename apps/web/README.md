# NachAI Web

The NachAI Web application is a modern, high-performance frontend built with Next.js 16 and React 19. It provides an intuitive, real-time interface for AI-driven code and UI generation, optimized for developer experience and rapid prototyping.

## Core Technologies

- Framework: Next.js 16 (App Router)
- UI Library: React 19 / Tailwind CSS 4
- Animations: Motion (Framer Motion)
- State Management: Zustand & TanStack Query
- API Integration: tRPC Client & Vercel AI SDK (React)
- Icons: Hugeicons & Lucide

## Architectural Overview

### Rendering Strategy
The application utilizes Next.js App Router to optimize performance:
- Server Components (RSC): Efficient data fetching and reduced client-side JavaScript for static content.
- Client Components: Interactive AI chat interface, live code previews, and real-time streaming components.

### Real-Time AI Interaction
The interface leverages the Vercel AI SDK's `useChat` and `useChatTransport` hooks for seamless, low-latency communication with the AI models. It supports:
- Multi-part message rendering.
- Code block syntax highlighting via Highlight.js.
- Interactive component previews.

### State and Data Synchronization
- Zanzibar-inspired state management: Global UI state is handled via Zimmer, while server state is synchronized through TanStack Query, ensuring consistent data across the application.
- Type-Safe API Access: All communication with the backend is strictly typed using tRPC, preventing runtime errors and improving developer productivity.

## Design System

The application implements a custom design system built on Tailwind CSS 4:
- Dynamic Theming: Integrated dark and light modes with custom palette tokens.
- Fluid Layouts: Fully responsive grid and flex architecture optimized for all device types.
- Motion Design: Subtle entrance and exit animations powered by Framer Motion's `AnimatePresence`.

## Development Workflow

### Startup and Build
```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Configuration
The application requires the following environment variables (refer to .env.local.example):
- NEXT_PUBLIC_API_URL: Base URL for the backend API.
- NEXT_PUBLIC_TRPC_URL: Base URL for tRPC procedures.

Frontend Lead: [Ignacio Figueroa](https://github.com/figueroaignacio)
