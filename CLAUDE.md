# CLAUDE.md

## Project Overview

Subscription Central is a Red Hat Insights micro-frontend for managing Satellite subscription manifests, served on `console.redhat.com`. Built with React/TypeScript and loaded into the Insights Chrome shell via Webpack Module Federation (`fec` CLI).

## Common Commands

- `npm run start` — dev server with proxy (requires Red Hat VPN + proxy setup)
- `npm run build` — production build
- `npm test` — run Jest tests
- `npm run lint` — ESLint + Stylelint
- `npm run verify` — build + lint + test (full CI check)
- `npm run format` — Prettier formatting

## Architecture & Conventions

- Functional components only, arrow functions, typed with `FC<Props>` or inline prop interfaces
- PascalCase directories with `index.ts` barrel exports for each component
- Types colocated with hooks/components (no central types directory)
- PatternFly v6 with tree-shaking imports from `dist/dynamic/` paths
- Plain SCSS with `sub-`/`sub-c-` class name prefix
- Native `fetch` + TanStack React Query v5 for data fetching; JWT auth via `useToken()` from platform services
- React Router v6 with lazy loading
- No Redux — React Query for server state, React Context for notifications, `useState` for UI state
- Prefer code reuse over duplication — extract shared logic into hooks or utilities
- Prefer small, focused React components over large complex ones
- Stay in scope — do not refactor or "improve" unrelated code when working on a feature. Instead, note potential improvements for the developer as a follow-up for a future ticket

## Testing

- Jest + React Testing Library + jest-fetch-mock
- Tests colocated in `__tests__/` subdirectories
- Test data via `fishery` factories in `src/utilities/factories/`
- `createQueryWrapper()` from `src/utilities/testHelpers.tsx` for wrapping hook tests
- Coverage thresholds: 80% branches/functions/statements, 85% lines
- New features must include unit tests
- Do NOT use snapshot tests — test observable behavior and functionality (what the user sees and does), not implementation details (internal state, component structure, CSS classes)
- Pre-existing test failures are a code smell — if existing tests break after your changes, investigate the unintended consequences rather than just updating the test to pass. The failing test may be revealing buggy behavior introduced by your changes

## Key Caveats

- Pre-commit hook runs Prettier + ESLint via husky
- App runs inside Red Hat Insights Chrome shell — `useChrome()` provides auth, navigation, and environment
- Local dev requires Red Hat VPN and proxy setup
- `fec.config.js` configures Webpack/Module Federation — app is exposed as `./RootApp`
