# Migration from Next.js to Monorepo

This project has been migrated from a Next.js application to a client-server monorepo structure.

## Structure

```
slo-idv2/
├── client/              # React client application (Vite + React Router)
│   ├── src/            # React source code
│   ├── public/         # Static assets
│   ├── dist/           # Built client (production)
│   ├── package.json    # Client dependencies
│   ├── vite.config.ts  # Vite configuration
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── server/              # Express.js server application
│   ├── src/            # Server source code
│   ├── dist/           # Built server (production)
│   ├── package.json    # Server dependencies
│   └── tsconfig.json
├── .github/             # GitHub Actions workflows
├── package.json         # Root workspace configuration
├── tsconfig.json        # Root TypeScript config
├── .env.local          # Environment variables
├── README.md           # Project documentation
└── MIGRATION.md        # This file
```

## Client (React + Vite)

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **UI Components**: Material-UI (MUI)

### Key Changes from Next.js:
- Replaced `next/link` with `react-router-dom/Link`
- Replaced `next/navigation` with `react-router-dom`
- Replaced `next/image` with regular `img` tags
- Replaced Next.js pages with React components in `/pages`
- Removed Next.js specific features (SSR, API routes, middleware)

## Server (Express.js)

- **Framework**: Express.js with TypeScript
- **Middleware**: CORS, Cookie Parser
- **Routes**: Converted from Next.js API routes to Express routes

### API Routes:
- `/api/geolocate` - Geolocation services
- `/api/images` - Image handling (S3 integration)
- `/api/session` - User session management
- `/api/suggestions` - AI-powered species suggestions
- `/api/uploadImage` - Image upload to S3
- `/api/weather` - Weather data

## Setup Instructions

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
- Copy `.env.local` to `server/.env` for server configuration
- Copy client environment variables as needed

3. Start development servers:
```bash
yarn dev
```

This will start:
- Client on http://localhost:5173
- Server on http://localhost:3001

## Build and Production

```bash
yarn build
yarn start
```

## Key Dependencies

### Client:
- React 18
- Vite
- React Router DOM
- TanStack Query
- Material-UI
- Tailwind CSS

### Server:
- Express.js
- TypeScript
- AWS SDK
- Firebase
- CORS
- Cookie Parser

## Notes

- All functionality has been preserved from the original Next.js application
- API routes have been converted to Express.js routes
- Client-side routing now uses React Router
- The application maintains the same user experience and features
