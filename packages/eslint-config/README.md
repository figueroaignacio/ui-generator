# NachAI ESLint Configuration

The NachAI ESLint package provides a centralized and standardized linting configuration for all workspaces within the monorepo. It ensures code quality and consistency across frontend, backend, and shared logic layers.

## Configuration Structure

### Base Configuration
Standard linting rules for Node.js and universal TypeScript logic. It forms the foundation for all other configurations in the repository.

### Next.js Configuration
Extended rules for Next.js 16 projects, incorporating specific React 19 patterns and server component best practices.

### React Internal Configuration
Optimized for shared React libraries (e.g., @repo/ui), focusing on internal component safety and exports management.

## Integration Patterns

Workspaces consume these configurations by extending them in their respective `eslint.config.js` or `package.json` files:

```javascript
import { next } from '@repo/eslint-config';

export default next;
```

## Technical Quality Standards

The configurations incorporate industry-standard plugins for:
- TypeScript linting and type safety.
- Import organization and barrel maintenance.
- Accessibility (A11y) verification for React components.
- Prettier integration for standardized formatting.

Technical Lead: [Ignacio Figueroa](https://github.com/figueroaignacio)
