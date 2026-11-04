# English Mate

English Mate helps English learners check their writing. The user enters one sentence, and the app rates how natural it sounds and suggests two alternatives: one formal and one casual.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Anthropic SDK

## Commands

- `pnpm run dev`: start the local dev server (for humans, not for checking work)
- `pnpm run lint`: ESLint
- `pnpm run build`: production build + TypeScript check

## Project structure

- `app/lib/types.ts`: All the reusable types go here. Secrets or server-only code don't go here.
- `app/lib/prompt.ts`: Prompt for Claude goes here. Server-only. Never import from client components.
- `app/api/chat/route.ts`: No prompt goes here. The only place that calls Claude.
- `app/page.tsx`: Main page goes here. No server-only code or secret goes here. Never import the Anthropic SDK; call Claude only through `fetch("/api/chat")`.

## Boundaries

### Always

- Run `pnpm run lint` and `pnpm run build` before saying a task is done.
- Show me a plan before editing.
- Use pnpm, not npm or yarn.

### Ask first

- Changing `MODEL` in `app/api/chat/route.ts`.
- Running `pnpm add`.

### Never

- Import server-only files into client components.
- Commit or push without my approval.
- Add the `NEXT_PUBLIC_` prefix to the API key or expose it to the client.
