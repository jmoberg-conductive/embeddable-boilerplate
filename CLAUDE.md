# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a boilerplate repository for Embeddable (https://embeddable.com), a developer toolkit for building fast, fully-custom analytics experiences directly into your app. The platform combines:
- **Code-first development**: Define data models and React components in your codebase
- **No-code builder**: Non-technical users can drag and drop charts, filters, and controls
- **Flexible embedding**: Web components, React, or Vue integrations with bi-directional communication

The project uses React and TypeScript with Vite.js bundling to create custom components and Cube.js-based data models.

## Requirements

- Node.js 20 or later
- npm 9.0.0 or later

## Common Commands

### Development
- `npm run embeddable:dev` - Start local preview workspace with hot reloading. Uses max 4GB memory allocation.
- `npm run dev` - Alias for `embeddable:dev`

### Build & Deploy
- `npm run embeddable:build` - Build the code bundle for deployment
- `npm run embeddable:push -- --api-key <API Key> --email <Email> --message <Message>` - Push built bundle to Embeddable workspace
- `npm run embeddable:login` - Authenticate with Embeddable

### Other
- `npm run ct` - Type check with TypeScript (no emit)
- `npm run embeddable:upgrade` - Upgrade all @embeddable/* packages to latest versions

## Architecture

### Configuration
The main configuration is in [embeddable.config.ts](embeddable.config.ts):
- Set `region: 'US'` or `region: 'EU'` based on deployment target
- Uses `@embeddable.com/sdk-react` plugin for React support
- Enable vanilla components library via `componentLibraries: ['@embeddable.com/vanilla-components']` (currently enabled)

### Directory Structure
- `src/embeddable.com/components/` - Custom React components
- `src/embeddable.com/models/` - Data models defined in Cube.js YAML format
- `src/embeddable.com/presets/` - Client contexts (.cc.yml) and security contexts (.sc.yml)
- `src/embeddable.com/scripts/` - Custom scripts
- `src/themes/` - Custom theme definitions (e.g., `pw.theme.ts` for Peak Workflow)

### Components
Each component consists of:
1. **Component file** (`index.tsx`) - React component implementation
2. **Metadata file** (`*.emb.ts`) - Defines component inputs, labels, defaults using `defineComponent` and `EmbeddedComponentMeta`

The `.emb.ts` file:
- Exports a `meta` object defining component name, label, dimensions, category, and input schema
- Exports default function from `defineComponent()` that maps inputs to component props
- Input types: `string`, `number`, `boolean`, `dataset`, `dimension`, `measure`

**Loading Data**: Use `loadData()` from `@embeddable.com/core` with parameters:
- `from` (required): Dataset to query
- `select` (required): Dimensions/measures to retrieve
- `filters`: Array with operators like `equals`, `gt`, `contains`, `inDateRange`
- `orderBy`, `limit` (default: 100), `offset`, `timezone` (default: UTC)

See [src/embeddable.com/components/claude.md](src/embeddable.com/components/claude.md) for detailed component documentation.

### Data Models
Data models use Cube.js YAML format (`.cube.yml` files) and provide a "single source of truth" for data:
- **Cubes**: Define table sources with `sql_table` or custom SQL queries
- **Dimensions**: Virtual columns for filtering/grouping (types: `string`, `number`, `time`)
- **Measures**: Numeric aggregations (types: `count`, `sum`, `avg`, `min`, `max`, `countDistinct`)
- **Joins**: Define relationships between cubes (`one_to_many`, `many_to_one`, `one_to_one`)
- **Security**: Reference `{COMPILE_CONTEXT.securityContext.property}` for row-level security
- **Protection**: Default 100-row query limit protects database

Automatically generates optimized SQL and ensures consistent metrics across dashboards.

See [src/embeddable.com/models/claude.md](src/embeddable.com/models/claude.md) for detailed data modeling documentation.

### Presets
- **Client Contexts** (`.cc.yml`) - Front-facing runtime customization passed via web component
  - Used for theming, localization, dark/light mode
  - Accessible in React components via `clientContext` prop
  - Visible to end users (not for security)

- **Security Contexts** (`.sc.yml`) - Backend-only row-level security
  - Passed securely via security tokens during authentication
  - Used in data models for SQL filtering with Jinja templating
  - Never exposed to frontend

See [src/embeddable.com/presets/claude.md](src/embeddable.com/presets/claude.md) for detailed preset documentation.

### Theming

Custom themes allow you to define brand-specific colors, fonts, and styling for your analytics components.

**Theme Architecture:**
- **Root theme provider**: [embeddable.theme.ts](embeddable.theme.ts) - Contains the main `themeProvider` function
- **Theme files**: Store in `src/themes/` (e.g., `src/themes/pw.theme.ts`)
- **Theme switching**: Based on client context values (see [src/embeddable.com/presets/client-contexts.cc.yml](src/embeddable.com/presets/client-contexts.cc.yml))

**Creating Custom Themes:**

1. **Create a theme file** in `src/themes/yourtheme.theme.ts`:
```typescript
import { ThemePartial } from '@embeddable.com/vanilla-components';

const yourtheme: ThemePartial = {
  brand: {
    primary: '#206bbb',
    secondary: '#4f5095',
  },
  charts: {
    colors: ['#206bbb', '#4f5095', '#10b981', '#f59e0b', '#ef4444'],
    // Override specific chart types
    pie: {
      colors: ['#206bbb', '#4f5095', '#10b981', '#f59e0b', '#ef4444'],
    },
    bar: {
      colors: ['#206bbb', '#4f5095', '#10b981', '#f59e0b', '#ef4444'],
    },
  },
  font: {
    family: 'Arial, sans-serif',
  },
};

export default yourtheme;
```

2. **Import and register** in [embeddable.theme.ts](embeddable.theme.ts):
```typescript
import { defineTheme } from '@embeddable.com/core';
import { Theme } from '@embeddable.com/vanilla-components';
import yourtheme from './src/themes/yourtheme.theme';

const themeProvider = (clientContext: any, parentTheme: Theme): Theme => {
  if (clientContext?.theme === 'yourtheme') {
    return defineTheme(parentTheme, yourtheme) as Theme;
  }
  return parentTheme;
};
```

3. **Add client context** in [src/embeddable.com/presets/client-contexts.cc.yml](src/embeddable.com/presets/client-contexts.cc.yml):
```yaml
- name: Your Theme Name
  clientContext:
    theme: 'yourtheme'
  canvas:
    background: "#fff"
```

**Using Themes in Custom Components:**

To access theme values in your React components, use the `useTheme()` hook:

```typescript
import { useTheme } from '@embeddable.com/react';
import { Theme } from '@embeddable.com/vanilla-components';

export default (props) => {
  const theme = useTheme() as Theme;

  // Access theme colors
  const colors = theme?.charts?.pie?.colors || theme?.charts?.colors || [];
  const primaryColor = theme?.brand?.primary;

  // Use in your component...
};
```

**Important Notes:**
- Components using hardcoded colors will **override** theme colors
- Always use `useTheme()` hook to respect theme settings
- The `defineTheme()` function merges your customizations with defaults
- Theme changes require a rebuild: `npm run embeddable:build`
- Select the theme in the builder using the client context dropdown

**Available Theme Properties:**
- `brand.primary`, `brand.secondary` - Brand colors
- `charts.colors` - Global chart color palette
- `charts.[chartType].colors` - Chart-specific colors (pie, bar, line, bubble, scatter, kpi)
- `charts.[chartType].borderRadius`, `.borderWidth` - Border styling
- `charts.[chartType].font.size`, `.font.weight` - Typography
- `font.family` - Global font family
- `controls.borders.colors` - Control element styling

See the `Theme` interface in `node_modules/@embeddable.com/vanilla-components/dist/themes/theme.d.ts` for complete options.

## Deployment Workflow
1. Set region in [embeddable.config.ts](embeddable.config.ts) (`'US'` or `'EU'`)
2. Build: `npm run embeddable:build` - Bundles components with Vite.js
3. Push: `npm run embeddable:push -- --api-key <key> --email <email> --message <msg>`
4. Create embeddables in the web UI at https://app.us.embeddable.com or https://app.eu.embeddable.com

## Troubleshooting

### Build Errors (SWC Native Bindings)
If you encounter SWC native binding errors on Mac:
```bash
rm -rf node_modules package-lock.json && npm install
```

## References

### Official Documentation
- Official documentation: https://docs.embeddable.com/
- Getting started: https://docs.embeddable.com/getting-started/first-embeddable
- Component development: https://docs.embeddable.com/development/introduction
- Data modeling: https://docs.embeddable.com/data-modeling/introduction
- Row-level security: https://docs.embeddable.com/data-modeling/row-level-security
- Theming guide: https://docs.embeddable.com/development/theming
- Defining components: https://docs.embeddable.com/development/defining-components
- Building interactive components: https://docs.embeddable.com/development/interactivity

### GitHub Resources
- Vanilla Components Library: https://github.com/embeddable-hq/vanilla-components
  - Starter pack of beautiful components with full source code
  - Contains reference implementations for charts (Pie, Bar, Line, etc.)
  - Examples of theme integration and best practices
  - Location: `src/components/vanilla/charts/[ChartType]/`
- Embeddable Organization: https://github.com/embeddable-hq

### Key Concepts
- **Vanilla Components** are reference implementations, not pre-built imports
  - The library provides starter code that can be copied and customized
  - Enables full control over component behavior and styling
  - Located in the vanilla-components repository on GitHub
- **useTheme() Hook** enables theme-aware components
  - Import from `@embeddable.com/react`
  - Returns current active theme based on client context
  - Must cast to `Theme` type from `@embeddable.com/vanilla-components`
- **Client Context** drives theme selection in the builder
  - Defined in `.cc.yml` files
  - Accessible via dropdown in preview workspace
  - Not for security (use Security Context for that)
