# AGENTS.md – Repo Operations Guide

## 0. Purpose

- Living handbook for all agentic contributors working inside this Turborepo.
- Covers build/lint/test commands, style rules, and operational expectations.
- Keep this file in sync with repo changes; update sections you touch.

## 1. Monorepo Topology

- Turborepo root with pnpm workspaces across apps and packages.
- apps/web: Next.js 16 (React 19) client.
- apps/api: NestJS 11 HTTP API.
- packages/ui: shared React components + Tailwind tokens.
- packages/eslint-config & packages/typescript-config: internal configs consumed elsewhere.
- packages/ai: AI agent code.

## 2. Toolchain & Prereqs

- Node >= 18.x (LTS recommended) with pnpm 9 via corepack.
- pnpm is the only supported package manager.
- TypeScript strict mode with `noUncheckedIndexedAccess` and ES module output.
- Git hooks may run lint/format; never skip them.
- IDE, Docker, or scripts must respect workspace settings.

## 3. Root Automation Commands

- `pnpm install` bootstraps workspaces; rerun after dependency changes.
- `pnpm build` runs all package builds via Turbo.
- `pnpm dev` runs every dev target concurrently (heavy).
- `pnpm lint` + `pnpm check-types` gate submissions; run both before PRs.
- `pnpm format` applies Prettier everywhere.

## 4. Package-Specific Commands

- apps/web: `pnpm dev` (Next dev), `pnpm build`, `pnpm start`, `pnpm lint`.
- apps/api: `pnpm dev` (start:dev), `pnpm build`, `pnpm start`, `pnpm start:prod`.
- packages/ui: `pnpm lint`, `pnpm check-types`.
- Config packages rarely need direct commands beyond repository root tasks.

## 5. Testing Strategy

- No automated test runner currently configured; add Vitest + Testing Library when ready.
- Co-locate specs with features (e.g., `apps/web/src/features/foo/__tests__`).
- Recommended single-test command once Vitest exists: `pnpm vitest run path/to/file.test.ts`.
- Document any new npm scripts for tests and update this file immediately.
- Until tests arrive, emphasize type checking, linting, and manual QA flows.

## 6. Turbo Filtering & Targeted Tasks

- Use `pnpm <task> --filter=<package>` to scope work (e.g., `pnpm build --filter=web`).
- Depend on `--filter "...^..."` when you need dependency-closure builds.
- Keep commands narrow during iteration to shorten feedback loops.
- Cache artifacts live under `.turbo`; delete only if troubleshooting stale builds.

## 7. Day-to-Day Workflow

- After cloning run `corepack enable` then `pnpm install`.
- Use feature branches; avoid committing directly to main unless told otherwise.
- Keep the worktree clean; never delete or overwrite user-owned changes.
- Capture architectural decisions in README/comments near the change.
- Prefer small, reviewable PRs with focused scope.

## 8. Formatting & Linting

- Prettier: semicolons on, single quotes, width 100, tab width 2, trailing commas all, avoid arrow parens.
- Run `pnpm format` for repo-wide fixes; do not hand-format.
- ESLint extends Next, Nest, and internal configs; local overrides need lead approval.
- Use `eslint-disable-next-line` only with short justification comments.
- Align editorconfig/IDE formatters with Prettier to avoid diff churn.

## 9. Import Organization

- Order: external libs → `@repo/*` packages → app aliases (`@/*`) → relative paths.
- Prefer named exports; keep default exports for Next.js route handlers only.
- Avoid deep relative walks; create barrel files under `index.ts` when needed.
- Place side-effect imports (styles/polyfills) at the top once per module.

## 10. Types & Naming

- Explicitly type public function params/returns; allow inference only for local consts.
- Replace potential `any` with `unknown` plus type guards.
- Component/types/interfaces use PascalCase; variables/hooks/functions use camelCase.
- Hooks must start with `use`; Zustand stores live under `store/<feature>`.
- Files: kebab-case for React components/hooks, PascalCase for standalone type files, DTOs named `CreateXDto`.

## 11. React & Component Patterns

- Default to client components; add `'use client'` when using hooks or state.
- Functional components only; add explicit return types for exported APIs.
- Use `forwardRef` + `displayName` for primitives requiring refs.
- Manage variants through `class-variance-authority` definitions exported alongside the component.
- Keep effects deterministic; add dependencies and abort async work when race conditions are possible.

## 12. State, Data, and Hooks

- Scope Zustand stores per feature; never share mutable objects across slices directly.
- Memoize derived state with `useMemo` and stabilize callbacks with `useCallback`.
- House remote calls under `api/` modules; components import typed helpers instead of calling `fetch`.
- Hooks live in `hooks/` folders and re-export through local `index.ts` barrels.
- Prefer server actions or API routes over reaching into backend internals from the client.

## 13. Styling & UI System

- Tailwind CSS v4 provides utility-first styling; extend tokens in `@repo/ui`.
- Use the shared `cn` helper for conditional classes.
- Favor component variants over ad-hoc class strings; keep CSS files tiny.
- Animations rely on `motion/react` + `AnimatePresence`; share transition tokens in UI package.
- Respect WCAG AA contrast, keyboard focus, and aria roles.

## 14. Error Handling & Logging

- Wrap async logic with try/catch; bubble actionable messages while logging stack context.
- apps/api throws Nest exceptions (`BadRequestException`, `NotFoundException`, etc.) instead of generic errors.
- apps/web renders explicit loading/error/empty states instead of crashing UI.
- Never log secrets or tokens to the browser console; redact server logs when needed.
- Validate payloads with class-validator DTOs before touching services.

## 15. Backend/API Patterns

- Modules live under `apps/api/src/modules/<feature>` with controller/service/dto/entity folders.
- Controllers stay slim; services encapsulate data access and business rules.
- Leverage Nest dependency injection; never instantiate providers manually.
- Use async/await plus `Promise.allSettled` for fan-out flows.
- Mirror shared schemas/types into packages if multiple apps consume them.

## 16. File Organization & Naming

- apps/web/src/app contains Next.js routes/layouts; keep page-level loaders/actions there.
- apps/web/src/features/<feature>/[api|components|hooks|store|types] encapsulate feature logic.
- apps/api/src/main.ts boots Nest; modules follow feature-first structure.
- Shared UI lives in `packages/ui/src/components`; export via index barrels.
- Config packages expose only tsconfig/eslint presets; avoid runtime logic.

## 17. Git & Review Discipline

- Never rewrite history or force-push unless explicitly instructed.
- Stage only relevant files; leave unrelated dirty changes untouched.
- Follow conventional commit-style wording summarizing why the change exists.
- Pull latest main before long branches and resolve conflicts locally.
- Request reviews with lint/type checks green.

## 18. Environment Variables & Secrets

- apps/web: `.env.local` for machine-specific values; never commit.
- apps/api: `.env` loaded by Nest config; provide `.env.example` if new keys appear.
- Document required keys in feature README or module notes.
- Rotate secrets in CI/CD promptly when onboarding new environments.
- Avoid logging secrets; scrub tokens before analytics or metrics capture.

## 19. Tooling & Extensions

- Align editors with workspace TypeScript via `"typescript.tsdk"` pointing to repo version.
- Disable global ESLint/Prettier plugins that fight project settings.
- No Cursor or Copilot rule files currently exist; add them under `.cursor/rules/` or `.github/copilot-instructions.md` and document changes here.
- Prefer GitHub CLI (`gh`) for scripting PR/issue workflows.
- Keep CI definitions aligned with commands documented above.

## 20. Quick Checklist Before You Ship

- `pnpm lint` (or filtered equivalent) passes.
- `pnpm check-types` passes.
- Critical flows manually smoke-tested in apps/web or Postman hits for apps/api.
- Changelogs, READMEs, or AGENTS.md updated if behavior/contracts shift.
- Reviewers can reproduce your work with documented commands.

## 21. Documentation & Support

- Keep feature READMEs current with domain-specific setup or decisions.
- Update this AGENTS guide whenever workflows, commands, or tooling change materially.
- Surface architectural rationales inside PR descriptions for reviewer context.
- Use GitHub Discussions or issues to clarify open questions before coding major shifts.
- Tag maintainers when work spans multiple packages to coordinate reviews.
- Record manual QA steps or verification notes alongside code reviews for posterity.
