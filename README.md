# English Mate

English Mate helps English learners check their writing. You enter one English sentence, and Claude tells you how natural it sounds and suggests two other ways to say it: one formal and one casual.

## What it does

- Rates your sentence as natural, slightly awkward, or awkward.
- Suggests a formal and a casual version of it.
- Explains the rating in a short note, in English, French, or Korean.
- Asks you to try again when the input is empty, too long, not English, or more than one sentence.

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
| `app/components/` | UI components: the form, the result card, the sidebar, the language switcher |
| `app/api/chat/route.ts` | The only place that calls Claude |
| `app/lib/prompt.ts` | The prompt for Claude (server only) |
| `app/lib/types.ts` | Shared types, level labels, and messages |
| `docs/specs/` | Specs for each feature |

## Stack

Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, and the Anthropic SDK.

## Specs

Each feature starts as a spec in `docs/specs/`:

- [000: MVP](docs/specs/000-mvp.md)
- [001: Prompt response](docs/specs/001-prompt-response.md)
- [002: UI](docs/specs/002-ui.md)

Planned: saving results (003), choosing Claude's response language (004), and dark mode (005).

## License

[MIT](LICENSE)
