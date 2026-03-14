# Skulkestudio

A modern architecture combining a .NET backend with a React Router 7 frontend that supports both pre-rendered (static) pages and an authenticated SPA — all from a single codebase.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  .NET Backend  (serves everything in production)        │
│                                                         │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────────┐ │
│  │ Cookie Auth  │  │ Minimal    │  │ Static files    │ │
│  │ /login       │  │ API        │  │ from wwwroot/   │ │
│  │ /logout      │  │ /api/*     │  │ (frontend build)│ │
│  └──────────────┘  └────────────┘  └─────────────────┘ │
│                                                         │
│  Auth injection middleware:                             │
│  Injects window.initialState into HTML <head>           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  React Router 7 Frontend  (single framework)            │
│                                                         │
│  Pre-rendered routes (SSG)      SPA routes              │
│  /                              /app/*                  │
│  /tv-aksjonen                   (auth required)         │
│  /tv-aksjonen/:id               client-side routing     │
│                                                         │
│  Monorepo: apps/web + packages/ui                       │
│  Build: Vite + React Router                             │
│  Styling: Vanilla Extract                               │
└─────────────────────────────────────────────────────────┘
```

### Rendering Modes

| Route | Mode | Auth | Description |
|-------|------|------|-------------|
| `/` | Pre-rendered | Public | Landing page |
| `/tv-aksjonen` | Pre-rendered | Public | Static content pages |
| `/tv-aksjonen/:id` | Pre-rendered | Public | Static content sub-pages |
| `/app/*` | SPA (client) | Required | Authenticated application |

### How It Works

1. **Build**: `react-router build` pre-renders public pages and produces a `__spa-fallback.html` for the SPA. The `move` script copies `dist/client/*` into `backend/Skulkestudio.Api/wwwroot`.

2. **Serve**: The .NET backend serves static files from `wwwroot`. An `AuthInjectionMiddleware` intercepts HTML responses and injects a `<script>` tag into `<head>` with the current user's auth status (`window.initialState`).

3. **SPA routing**: Any `/app/*` path that isn't a real file falls back to `__spa-fallback.html`, which is protected by `.RequireAuthorization()`. React Router handles client-side navigation from there.

4. **Auth**: The React client reads `window.initialState.user` synchronously on page load — no flash-of-unauthenticated-content, no extra fetch.

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [Yarn 4](https://yarnpkg.com/) (via corepack: `corepack enable`)

## Getting Started

### 1. Install frontend dependencies

```bash
cd frontend
yarn install
```

### 2. Start the backend

```bash
cd backend/Skulkestudio.Api
dotnet run
```

The backend starts on `http://localhost:5000`.

### 3. Start the frontend dev server

```bash
cd frontend
yarn dev
```

The Vite dev server proxies `/api`, `/login`, and `/logout` to the backend automatically.

### Building for Production

```bash
# Backend must be running for pre-render API calls
cd backend/Skulkestudio.Api
dotnet run &

# Build frontend and copy output to wwwroot
cd frontend
yarn build

# Now the backend serves everything
cd backend/Skulkestudio.Api
dotnet run
```

## Project Structure

```
├── backend/
│   └── Skulkestudio.Api/
│       ├── Program.cs                    # App setup, auth, routes, middleware
│       ├── PageService.cs                # In-memory page data
│       ├── Middleware/
│       │   └── AuthInjectionMiddleware.cs # Injects auth state into HTML
│       └── wwwroot/                      # Frontend build output (gitignored)
│
└── frontend/
    ├── turbo.json                        # Turbo task config
    ├── apps/
    │   └── web/
    │       ├── react-router.config.ts    # SSR off, prerender config
    │       ├── vite.config.ts            # Vite + proxy config
    │       └── app/
    │           ├── routes.ts             # Route definitions
    │           ├── api.ts                # API client
    │           ├── auth.ts               # Reads window.initialState
    │           └── routes/
    │               ├── site/             # Public landing
    │               ├── tv-aksjonen/      # Pre-rendered content
    │               └── app/              # Authenticated SPA
    └── packages/
        └── ui/                           # Shared component library
```

## Environment Variables

| Variable | Where | Default | Description |
|----------|-------|---------|-------------|
| `VITE_API_URL` | Frontend | `http://localhost:5000` | Backend API URL (used during build/prerender; browser uses relative URLs) |
