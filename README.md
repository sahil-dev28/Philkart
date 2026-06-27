# philkart

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Express, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Express** - Fast, unopinionated web framework
- **Node.js** - Runtime environment
- **Mongoose** - TypeScript-first ORM
- **MongoDB** - Database engine
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Prerequisites

Starting from a fresh machine, you'll need:

- **Git** — to clone the repository.
- **Node.js 20.9 or newer** (LTS recommended). Verify with `node -v`. Install from [nodejs.org](https://nodejs.org) or a version manager such as [nvm](https://github.com/nvm-sh/nvm) / [fnm](https://github.com/Schniz/fnm).
- **pnpm 10.21.0** — this repo pins its package manager. The easiest way is to enable [Corepack](https://nodejs.org/api/corepack.html) (bundled with Node):

  ```bash
  corepack enable
  ```

  Running any `pnpm` command inside the repo will then automatically use the pinned version. Alternatively, install it globally with `npm install -g pnpm@10.21.0`.
- **MongoDB** — either:
  - A local instance via [MongoDB Community Server](https://www.mongodb.com/try/download/community) (default URL `mongodb://localhost:27017`), or
  - A free hosted cluster from [MongoDB Atlas](https://www.mongodb.com/atlas) (gives you a `mongodb+srv://...` connection string).

## Getting Started

1. **Clone and install dependencies** from the repo root:

   ```bash
   git clone <repo-url> philkart
   cd philkart
   pnpm install
   ```

2. **Configure environment variables** (see [Environment Variables](#environment-variables) below). Create `apps/server/.env` and `apps/web/.env`.

3. **Start everything in development mode:**

   ```bash
   pnpm run dev
   ```

   - Web app: [http://localhost:3001](http://localhost:3001)
   - API: [http://localhost:8000](http://localhost:8000) (endpoints are served under `/api/v1`)

   You can also run a single app with `pnpm run dev:web` or `pnpm run dev:server`.

## Environment Variables

Neither `.env` file is committed, so you must create both before running the apps. The environment is validated at startup (via `@philkart/env`), so the apps will fail fast if a required value is missing or malformed.

### `apps/server/.env`

```bash
# MongoDB connection string used by Mongoose
DATABASE_URL=mongodb://localhost:27017/philkart

# Origin allowed by CORS — the web app's URL
CORS_ORIGIN=http://localhost:3001

# Port the API listens on (defaults to 8001 if unset)
PORT=8000
```

### `apps/web/.env`

```bash
# Base URL of the API server (must match the server's PORT)
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```

> If you change `PORT` on the server, update `NEXT_PUBLIC_SERVER_URL` in the web app to match.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@philkart/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Run checks: `pnpm run check`

## Project Structure

```
philkart/
├── apps/
│   ├── web/         # Frontend application (Next.js, port 3001)
│   └── server/      # Backend API (Express, port 8000)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── db/          # Mongoose connection, schema & queries
│   ├── env/         # Type-safe environment variable validation
│   └── config/      # Shared TypeScript config
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:server`: Start only the server
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run check`: Run Biome formatting and linting
