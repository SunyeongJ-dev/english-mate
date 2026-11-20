# English Mate

English Mate helps English learners check their writing. You enter one English sentence, and Claude tells you how natural it sounds and suggests two other ways to say it: one formal and one casual.

## What it does

- Rates your sentence as natural, slightly awkward, or awkward.
- Suggests a formal and a casual version of it.
- Explains the rating in a short note.
- Asks you to try again when the input is empty, too long, not English, or more than one sentence.
- Shows the whole app in English, French, or Korean. The suggested sentences are always in English.
- Saves your checked sentences in your browser, so you can open their results again or delete them. Nothing is saved on a server.
- Works on phone and desktop. On a phone, the history opens from the menu button.

## Getting started

You need Node.js, [pnpm](https://pnpm.io), and an [Anthropic API key](https://console.anthropic.com).

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env.local` in the project root with your API key:

   ```bash
   ANTHROPIC_API_KEY=your-key-here
   ```

   The key stays on the server. Never add the `NEXT_PUBLIC_` prefix to it.

3. Start the dev server and open http://localhost:3000:

   ```bash
   pnpm run dev
   ```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Starts the local dev server |
| `pnpm run lint` | Runs ESLint |
| `pnpm run build` | Builds for production and checks types |
| `pnpm run start` | Serves the production build |

## How it works

The page sends your sentence to `/api/chat`. The route checks the input, asks Claude to review it, and checks that Claude's answer has the expected shape before sending it back to the page. Only the route talks to Claude, so the API key never reaches the browser.

| Path | What's in it |
| --- | --- |
| `app/page.tsx` | The main page |
| `app/components/` | UI components: the form, the result card, the sidebar, the mobile drawer, the history list, the language switcher |
| `app/api/chat/route.ts` | The only place that calls Claude |
| `app/lib/prompt.ts` | The prompt for Claude (server only) |
| `app/lib/types.ts` | Shared types |
| `app/lib/texts.ts` | Every text on screen and every error message, in English, French, and Korean |
| `app/lib/history.ts` | Saving and loading the history in `localStorage` |
| `app/lib/language.ts` | Saving and loading the selected language in `localStorage` |
| `docs/specs/` | Specs for each feature |

## Stack

Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, and the Anthropic SDK.

## Specs

Each feature starts as a spec in `docs/specs/`:

- [000: MVP](docs/specs/000-mvp.md)
- [001: Prompt response](docs/specs/001-prompt-response.md)
- [002: UI](docs/specs/002-ui.md)
- [003: History](docs/specs/003-history.md)
- [004: History drawer on mobile](docs/specs/004-history-drawer.md)
- [005: Check states in the history list](docs/specs/005-sidebar-check-states.md)
- [006: Language](docs/specs/006-language.md)
- [007: Logo button and deleting history](docs/specs/007-logo-and-delete.md)

## License

[MIT](LICENSE)
