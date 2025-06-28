# CLAUDE.md
Always Response with Indonesian Language

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm install` - Install dependencies
- `npm test` - Run all tests with 5-second timeout
- `npm run lint` - Run ESLint to check code style
- `npm audit` - Check for security vulnerabilities

### Testing Individual Files
- `npx mocha test/lib.app.js` - Run tests for a specific module
- `npx mocha test/lib.app.js --grep "specific test name"` - Run a specific test

## Architecture

This is a Google Play Store scraping library that provides programmatic access to app data without authentication.

### Core Structure
- **Entry Point**: `index.js` - Exports all functions with optional memoization support
- **Core Functions**: Each `lib/*.js` file implements a specific scraping function (app details, search, reviews, etc.)
- **Utilities**: `lib/utils/` contains shared functionality:
  - `request.js` - HTTP client wrapper with cookie handling
  - `scriptData.js` - Extracts data from Google's script tags
  - `throttle.js` - Rate limiting to avoid blocks

### Key Design Patterns
1. **Promise-based API**: All functions return promises
2. **Options Objects**: Functions accept configuration objects for flexibility
3. **Memoization**: Optional caching layer with configurable TTL (default 5 minutes)
4. **TypeScript Support**: Full type definitions in `index.d.ts`

### Data Flow
1. User calls a function (e.g., `gplay.app({appId: 'com.example'})`)
2. Function builds Google Play URL with appropriate parameters
3. HTTP request made via `request.js` (with throttling if enabled)
4. HTML response parsed using Cheerio or script data extraction
5. Data mapped to consistent format using mapping helpers
6. Result returned (potentially cached if memoization enabled)

### Testing Approach
- Integration tests that hit real Google Play Store endpoints
- Tests organized to mirror lib structure (e.g., `test/lib.app.js` tests `lib/app.js`)
- Shared test utilities in `test/common.js`
- Use environment variable `DEBUG=gplay:*` for debugging

### Important Constants
- Collections (TOP_FREE, TOP_PAID, etc.) defined in `lib/constants.js`
- Categories (GAME, FAMILY, etc.) also in constants
- Sort options (NEWEST, RATING, etc.) for reviews