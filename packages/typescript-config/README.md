# NachAI TypeScript Configuration

The NachAI TypeScript configuration package defines shared compiler options and project-level settings for the monorepo. It ensures that all workspaces adhere to the same language standards and optimization targets.

## Configuration Profiles

### Base Options (base.json)
The root configuration file that establishes common TypeScript standards:
- Strict mode: Enabled by default for maximum type safety.
- ESNext targets: Alignment with modern Node.js and browser environments.
- Module resolution: Node-compatible resolution module systems.

### Next.js Profile (nextjs.json)
Specific settings for Next.js applications:
- JSX transformation for React 19.
- Custom module path aliasing.
- Integrated library support for Next.js features.

### React Library Profile (react-library.json)
Tailored for shared components and libraries (@repo/ui):
- Optimized for bundle size and module exports.
- Preservation of JSX for consuming applications.

## Technical Standards

All profiles enforce:
- No unchecked indexed access for safer array/object operations.
- Explicit member accessibility in classes.
- Standardized emission patterns for consistent build results.

## Usage and Integration

Workspaces extend these configurations in their `tsconfig.json` files:

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

Technical Lead: [Ignacio Figueroa](https://github.com/figueroaignacio)
