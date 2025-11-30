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

- **Framework**: Elysia (Bun-native web framework)
- **Port**: 3000
- **Entry**: `apps/api/src/index.ts`
- **Dev command**: `bun --filter api dev` or `bun run --watch src/index.ts`

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
- **Testing**: Vitest + Testing Library + jsdom

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

1. **Reel 1 - Animals**: Various animal emojis (🦫 🐕 🐸 🦄 🐱 🦍 etc.)
2. **Reel 2 - Foods**: Various food emojis (🍕 🍔 🌮 🍜 🍰 🌭 etc.)
3. **Reel 3 - Vibes**: Various vibe emojis (💎 🌙 🚀 💀 ⚡ 🔥 etc.)

**Important**: The emoji lists are configurable and may expand over time. Do not hard-code specific emoji arrays - design for easy addition/modification of emoji options.

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

### Optional Context Feature

**Critical**: The context input is OPTIONAL but powerful:
- Allows users to personalize results (e.g., "super aggressive marketing", "wholesome and family friendly")
- Persists between spins (sticky input)
- 100 character limit
- When provided, AI incorporates theme into concept
- Same emoji combo + different context = different coins (increases replayability)

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
  "concept": "The first gaming meme coin...",
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

1. **Fun first** - Entertainment, not serious finance
2. **Casino aesthetic** - Vegas vibes, gold accents, dramatic animations
3. **Web3 native** - Purple gradients, glassmorphism
4. **Clear CTAs** - Big buttons, obvious next steps
5. **Instant feedback** - Every action has visual response

### Typography & Style:
- **Funny, crypto-oriented** - Playful but with meme culture authenticity
- **Monospace fonts** - Use for tickers, code-like elements, technical displays
- **Modern & aesthetic** - Clean, contemporary typefaces for readability
- Consider mixing monospace for data/numbers with sans-serif for body text
- Embrace crypto/meme culture typography trends (bold headers, tight spacing)

### Animation Guidelines:
- Reel spin: 2-3 seconds with blur effect
- Lever pull: Physical "clunk" feedback
- Result reveal: Fade in with slight scale up
- Context hint: Subtle pulse when empty (shows it's optional)

## TypeScript Configuration

The repo uses **strict TypeScript** settings:
- `strict: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`
- Module resolution: `bundler` (for Bun/Vite)

## Testing

Frontend tests use:
- **Vitest** for test runner
- **Testing Library** (@testing-library/react + @testing-library/dom)
- **jsdom** for DOM environment

Run tests: `cd apps/ui && bun run test`

## Integration Points

### Pump.fun Launch
When user clicks "Launch on Pump.fun":
1. Show preparation modal with warnings
2. Pre-fill pump.fun URL with coin data
3. Open in new tab: `https://pump.fun/create?name=...&symbol=...&description=...&image=...&ref=memedime`

### Twitter Sharing
Pre-fill tweet format:
```
Just generated $[TICKER] on @memedime.fun! 🎰

[If context used: "Theme: [context]"]

"[First line of concept]"

Should I launch it? 👀

Try it: https://memedime.fun
```

## Edge Cases to Handle

- **No wallet detected**: Show wallet connection prompt (support multiple Solana wallet providers)
- **Insufficient balance**: Warning before spin with "Add Funds" button
- **Context too long**: Disable pull lever, show character counter in red
- **Inappropriate context**: Proceed with combo only, warn user
- **Payment rejected**: Allow retry with no charge
- **AI generation failed**: Auto-retry once, then show error + refund option
- **Slow network**: Extend loading with "Still working..." message, 30s timeout

## Key Files to Know

### Frontend:
- `apps/ui/src/routes/index.tsx` - Landing page / main slot interface
- `apps/ui/src/routes/__root.tsx` - Root layout
- `apps/ui/src/main.tsx` - App entry point
- `apps/ui/vite.config.ts` - Vite configuration with TanStack Router plugin

### Backend:
- `apps/api/src/index.ts` - Elysia server entry point (currently minimal)

### Documentation:
- `docs/REQUREMENTS.md` - **Complete MVP specification** (read this for full details on UI/UX, user flows, and business logic)

## Future Implementation Notes

The codebase is currently scaffolded. When implementing:

1. **API endpoints needed**:
   - `POST /spin` - Validate payment + generate coin idea
   - `GET /stats` - Return global stats (total spins, coins launched)

2. **Frontend components to build**:
   - SlotMachine (3 reels with spin animation)
   - PaymentModal (Solana wallet integration)
   - ResultCard (displays generated coin)
   - ContextInput (optional user hint, sticky, 100 char limit)
   - WalletConnect (support multiple Solana wallet providers)

3. **Wallet integration**:
   - Support standard Solana wallet adapters
   - Handle USDC transactions on Solana
   - Implement x402 micropayment protocol

4. **Emoji configuration**:
   - Store emoji lists in a configurable format (JSON/config file)
   - Make it easy to add/remove emojis without code changes
   - Each emoji should have: emoji character, name, and optional description

5. **State management**: Consider TanStack Query for API calls and caching

6. **Animation library**: Consider Framer Motion for slot machine animations

7. **Form validation**: Implement character limit + sanitization for context input

## Important Context from Requirements

- Payment is **$0.10 USD** (0.01 USDC on Solana)
- x402 protocol for micropayments (research implementation)
- Context input is **optional but powerful** - drives replayability
- AI should use Groq or similar fast inference
- Focus on **viral shareability** - Twitter integration is key
- The "magic moment" is when users realize context actually works
