# LegalTech Platform - Frontend

Frontend application built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features Implemented

### Authentication
- User registration with AWS Cognito
- Login with email/password
- Automatic token management
- Protected routes

### Cases Management
- List all cases with status badges
- Create new case
- View case details
- Professional UI with shadcn/ui

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_1ymcfdKOl
NEXT_PUBLIC_COGNITO_CLIENT_ID=5srg7hsd63jpnhaqt0fbvruujc
NEXT_PUBLIC_COGNITO_REGION=us-east-1
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui (Radix UI)
- AWS Amplify (Cognito)
- Axios

## Available Routes

- `/` - Landing page
- `/login` - Login
- `/register` - Registration
- `/dashboard` - Cases dashboard (protected)
- `/cases/new` - Create case (protected)

## Project Structure

```
app/          # Next.js pages
components/   # UI components
modules/      # Feature modules (auth, cases)
lib/          # Utilities (API client, Cognito config)
types/        # TypeScript types
```

## Build

```bash
pnpm build
pnpm start
```
