# NachAI API

The NachAI API is a modular NestJS 11 application that serves as the backend engine for the NachAI platform. It orchestrates AI model interactions, manages user sessions, and provides a type-safe interface for the frontend application.

## Core Technologies

- Framework: NestJS 11
- Communication: tRPC v11 & REST
- AI Orchestration: Vercel AI SDK
- Database: PostgreSQL & TypeORM
- Security: Passport.js (JWT, OAuth)
- Validation: Zod & Class-Validator

## Architectural Modules

### AI Orchestration
The API integrates with Google Gemini via the Vercel AI SDK to process natural language prompts. It handles prompt engineering, response streaming, and context management for UI generation tasks.

### Authentication and Identity
A robust security layer implemented using Passport.js supports multiple authentication strategies:
- JWT: Secure stateless session management.
- OAuth 2.0: Integration with GitHub and Google for streamlined user onboarding.

### Data Persistence
The persistence layer utilizes TypeORM for relational mapping with PostgreSQL. Key entities include:
- Users: Profile and account synchronization.
- Conversations: Historical record of AI interactions and generated assets.

### Type-Safe Communication (tRPC)
The API exposes a tRPC router that shares schemas with the frontend, ensuring end-to-end type safety and reducing runtime overhead.

## Technical Specifications

### API Design Patterns
- Dependency Injection: Leverages NestJS's powerful DI system for decoupled, testable services.
- DTO Validation: Uses Class-Validator and Zod for strict payload verification.
- Interceptors and Filters: Implements global exception handling and response transformation.

### Environment Configuration
The application requires the following environment variables (refer to .env.example):
- DATABASE_URL: PostgreSQL connection string.
- JWT_SECRET: Secret key for token signing.
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET: OAuth credentials.
- GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET: OAuth credentials.
- GOOGLE_GENERATIVE_AI_API_KEY: Gemini API access.

## Development Workflow

### Build and Execution
```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Start in development mode
pnpm dev

# Start in production mode
pnpm start:prod
```

### Database Management
Migrations are managed via TypeORM CLI:
```bash
pnpm typeorm migration:run
```

Technical Lead: [Ignacio Figueroa](https://github.com/figueroaignacio)
