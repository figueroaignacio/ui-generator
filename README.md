# NachAI 🚀

**NachAI** is a cutting-edge, AI-powered UI generation platform designed to transform natural language descriptions into production-ready web interfaces. Built with a modern monorepo architecture, it leverages advanced generative AI to streamline the design-to-code workflow.

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Turbo](https://img.shields.io/badge/Turbo-2.0-EF4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)

## ✨ Key Features

- 🤖 **AI-Powered Generation**: Instantly generate professional UI components using simple text prompts.
- ⚡ **Real-Time Streaming**: Watch your designs come to life with live AI response streaming.
- 🔐 **Secure Authentication**: Seamless login via GitHub and Google OAuth, powered by Passport.js and JWT.
- 🎨 **Modern Design System**: Built with Tailwind CSS 4, Motion, and Hugeicons for a premium, responsive experience.
- 🗄️ **Persistent History**: Save, search, and manage your previous creative sessions.
- 🏗️ **Robust Architecture**: A scalable monorepo structure using Turborepo and pnpm.

## 🛠️ Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4 & PostCSS
- **Animations**: Framer Motion
- **State Management**: Zustand & TanStack Query
- **Markdown Support**: React Markdown & Highlight.js

### Backend (`apps/api`)

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **AI Integration**: Vercel AI SDK & Google Gemini
- **Security**: Passport (JWT, Google, GitHub), Bcrypt, Helmet

### Shared Packages (`packages/*`)

- `@repo/ui`: Shared React component library.
- `@repo/typescript-config`: Shared TypeScript configurations.
- `@repo/eslint-config`: Shared linting rules.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ui-generator.git
   cd ui-generator
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Create a `.env` file in `apps/api/` (see `apps/api/.env.example`).
   - Create a `.env.local` file in `apps/web/` (see `apps/web/.env.local`).

### Development

Run all applications in development mode:

```bash
pnpm dev
```

The applications will be available at:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```text
.
├── apps
│   ├── api           # NestJS backend service
│   └── web           # Next.js frontend application
├── packages
│   ├── ui            # Shared component library
│   ├── eslint-config # Shared ESLint configuration
│   └── tsconfig      # Shared TypeScript configuration
├── package.json
└── turbo.json
```

## 🏗️ Build

To build all apps and packages:

```bash
pnpm build
```

---

Built with ❤️ by [Ignacio Figueroa](https://github.com/figueroaignacio)
