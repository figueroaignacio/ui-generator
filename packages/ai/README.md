# NachAI AI Workflows

The NachAI AI package is the core orchestration layer for generative AI workflows within the NachAI monorepo. It provides a standardized interface for interacting with Large Language Models (LLMs) and manages complex prompt logic for UI generation.

## Core Technologies

- AI SDK: Vercel AI SDK (Core and Provider)
- Providers: Google Gemini (Generative AI)
- Validation: Zod for schema-based response verification
- Deployment: Distributed as a shared workspace package (@repo/ai)

## Architectural Design

### Provider Abstraction

The package implements a provider-agnostic interface that allows for seamless switching between different LLMs. Current primary integration is with Google Gemini, specifically `gemini-2.5-pro` and `gemini-2.5-flash`.

### AI Agent Logic

The agentic component is responsible for:

- Prompt Engineering: Managing system and user prompts for consistent UI generation.
- Tool Calling: Orchestrating model interactions with defined tools (e.g., code execution, component lookup).
- Context Management: Maintaining conversation state and message history for iterative design sessions.

### Schema-Based Generation

All AI outputs are validated against Zod schemas before being processed by the backend or frontend. This ensures:

- Structural Integrity: Prevents malformed JSON or invalid component structures.
- Type Safety: Guarantees that the generated code adheres to the project's React component patterns.

## Implementation Details

### Provider Configuration

The package handles API key management and provider initialization:

```typescript
import { google } from '@ai-sdk/google';

const provider = google('gemini-1.5-pro');
```

### Prompt Management

System prompts are versioned and stored within the package to ensure consistency across different application versions. Prompts are optimized for:

- Tailwind CSS 4 utility usage.
- React 19 best practices.
- Modern visual design aesthetics.

## Workspace Integration

The package is consumed by:

- `apps/api`: To process backend-driven AI workflows and tool orchestration.
- `apps/web`: For real-time streaming and UI-specific generative tasks.

## Technical Maintenance

### Build and Distribution

The package is bundled using `tsup` for flexible export formats (ESM, CJS):

```bash
# Build the package
pnpm build

# Watch for changes
pnpm dev
```

### Dependency Graph

- @repo/typescript-config: Shared TS configurations.
- tsup: Build orchestration.
- vitest: (Future) Unit and integration testing for AI workflows.

Principal Engineer: [Ignacio Figueroa](https://github.com/figueroaignacio)
