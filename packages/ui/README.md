# NachAI UI Components

The NachAI UI package is a shared React component library that defines the visual identity of the NachAI platform. It is built with a focus on accessibility, performance, and developer productivity using Tailwind CSS 4 and React 19.

## Core Technologies

- Framework: React 19
- Styling: Tailwind CSS 4 (Utility-first)
- Variant Management: Class Variance Authority (CVA)
- Utilities: clsx, tailwind-merge
- Animations: Motion (Framer Motion)
- Iconography: Hugeicons & Lucide

## Architectural Principles

### Component Composition
The library follows a modular approach where complex components are composed from smaller foundations. Most components are exported as functional React components with proper TypeScript typing.

### Design System Tokens
The package extends Tailwind's default configuration with custom design tokens for:
- Colors: Specialized HSL palettes for background, foreground, primary, and accented states.
- Typography: Shared font families and scaling systems.
- Layout: Standardized spacing and radius tokens.

### Theme Integration
The UI components are theme-aware and support both light and dark modes through CSS variables and Tailwind utility classes. They are designed to work seamlessly with the `nach-themes` provider.

## Component Library Overview

### Foundational Elements
- Buttons: High-performance button components with multiple variants (primary, secondary, outline, ghost).
- Inputs: Accessible form controls with validation states and focus indicators.
- Icons: Standardized wrappers for Hugeicons and Lucide icons.

### Interactive Components
- Modals and Overlays: Managed via declarative state and Framer Motion for smooth transitions.
- Card Systems: Versatile layout containers for content encapsulation.
- Navigation: Header and Sidebar skeleton frameworks for diverse layouts.

## Usage and Development

### Integration
To use these components in other applications, import them from the `@repo/ui` workspace:
```tsx
import { Button } from '@repo/ui';

const MyComponent = () => (
  <Button variant="primary">Click Me</Button>
);
```

### Scripted Automation
The package includes a custom generator for boilerplate component creation:
```bash
pnpm generate:component
```

### Standards
All components must adhere to:
- WCAG AA accessibility contrast ratios.
- Consistent keyboard focus states.
- Modular, well-documented TypeScript prop interfaces.

Maintainer: [Ignacio Figueroa](https://github.com/figueroaignacio)
