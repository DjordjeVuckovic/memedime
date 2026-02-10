# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MemeDime** is an AI-powered meme coin idea generator that uses x402 micropayments. Users pay $0.10 per spin to generate unique meme coin concepts through a slot machine interface.

**Core Concept**: "Pull the lever, launch a legend" - A slot machine generates combinations of emojis (Animal + Food + Vibe) which are sent to AI to create complete meme coin ideas. Users can optionally provide context to influence the generated concepts.

**Tech Stack**: Bun monorepo with React frontend (TanStack Router) and Elysia backend.

## Repository Structure

This is a **Bun workspace monorepo** with the following structure:

```
memedime/
├── apps/
│   ├── api/          # Elysia backend API
│   └── ui/           # React frontend (Vite + TanStack Router)
├── packages/         # Shared packages (currently empty)
└── docs/
    └── REQUREMENTS.md  # Complete MVP specification
```

### apps/api - Backend API

- **Framework**: Hono (Bun-native web framework)
- **Port**: 3000
- **Entry**: `apps/api/src/stats.ts`
- **Dev command**: `bun --filter api dev` or `bun run --watch src/stats.ts`

### apps/ui - Frontend Application

- **Framework**: React 19 + TanStack Router
- **Styling**: Tailwind CSS v4
- **Port**: 3000 (Vite dev server)
- **Dev command**: `bun --filter ui dev` or `vite --port 3000`
- **Build**: `vite build && tsc`
- **Path aliases**: `@/` maps to `apps/ui/src/`

#### Frontend Tech Details:
- **Router**: TanStack Router with file-based routing (`src/routes/`)
- **Code splitting**: Auto-enabled via TanStack Router plugin
- **Dev tools**: TanStack Router DevTools and React DevTools included

## Common Development Commands

### Run all apps in development:
```bash
bun dev:all
```

### Run individual apps:
```bash
bun dev:api    # Start backend (Elysia on port 3000)
bun dev:ui     # Start frontend (Vite on port 3000)
```

### Frontend-specific:
```bash
cd apps/ui
bun run build   # Build for production
bun run test    # Run tests with Vitest
bun run lint    # Run ESLint
bun run check   # Format and lint (Prettier + ESLint)
```

### Backend-specific:
```bash
cd apps/api
bun run dev     # Run with --watch flag
```

## Application Architecture

### Slot Machine System

The app generates meme coin ideas based on a **3-reel slot machine**:

### User Flow (Core Experience)

1. User connects Solana wallet
2. User optionally enters context (e.g., "make it about gaming")
3. User pulls lever → reels spin with animation
4. Payment modal appears showing combo + context
5. User pays $0.10 USDC via x402 protocol
6. AI generates coin idea (influenced by optional context)
7. Result displays with:
   - Name & ticker
   - Logo (AI-generated)
   - Concept & tagline
   - Tokenomics
   - Marketing angle
8. User can: Tweet, Launch on pump.fun, Download assets, or Spin again

## Payment Flow (x402 Protocol)

1. Spin completes → payment modal shows
2. User approves 0.01 USDC transaction via Solana wallet
3. Wait for blockchain confirmation (~2 seconds)
4. Retry API call with payment signature + combo + context
5. Backend validates payment before generating

**Error handling**: Payment failures allow retry without charging.

## AI Generation Logic

### Backend sends to AI:
```javascript
{
  "combo": {
    "animal": "🦫",
    "animal_name": "Capybara",
    "food": "🍕",
    "food_name": "Pizza",
    "vibe": "💎",
    "vibe_name": "Diamond"
  },
  "context": "make it about gaming" // OPTIONAL
}
```

### Expected AI Output:
```json
{
  "name": "CAPYBARA PIZZA QUEST",
  "ticker": "$CAPYPIZZA",
  "tagline": "AFK farming with diamond paws",
  "concept": "The first gaming coins coin...",
  "supply": "420,690,000,000",
  "tokenomics": {
    "lp_burned": "80%",
    "dev": "5%",
    "community": "15%"
  },
  "marketing": "We're launching a browser game..."
}
```

**Important**: When context is provided, AI must incorporate that theme while maintaining humor and memeability.

## Design Principles

1. **Casino aesthetic** - Vegas vibes, gold accents, dramatic animations
2. **Web3 native** - Purple gradients, glassmorphism
3. **Clear CTAs** - Big buttons, obvious next steps
4. **Instant feedback** - Every action has visual response

### Typography & Style:
- **Funny, crypto-oriented** - Playful but with meme culture authenticity
- **Monospace fonts** - Use for tickers, code-like elements, technical displays
- **Modern & aesthetic** - Clean, contemporary typefaces for readability
- Consider mixing monospace for data/numbers with sans-serif for body text
- Embrace crypto/meme culture typography trends (bold headers, tight spacing)

## Testing

Frontend tests use:
- **Vitest** for test runner
Backend tests use:
- **Bun testing**

Run tests: `bun run test`

## Important Context from Requirements

- Payment is **$0.10 USD** (0.01 USDC on Solana)
- x402 protocol for micropayments (research implementation)
- Context input is **optional but powerful** - drives replayability
- AI should use Groq or similar fast inference
- Focus on **viral shareability** – Twitter integration is key
- The "magic moment" is when users realize context actually works

# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
