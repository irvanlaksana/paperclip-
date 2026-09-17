# Contributing to Paperclip — Content Creator Edition

This project mirrors the structure of [paperclipai/paperclip](https://github.com/paperclipai/paperclip) but specialized for electrical distribution content.

## Monorepo Structure (pnpm workspaces)

- `server/` — @paperclipai/server (Express control plane)
- `ui/` — @paperclipai/ui (React + Vite dashboard)
- `packages/shared` — Shared types
- `packages/db` — Mock DB layer
- `cli/` — CLI
- `api/` — Vercel serverless proxy (legacy, still works)
- `index.html`, `app.js`, `styles.css` — Legacy static UI (no build needed)

## Development

```bash
pnpm install
pnpm --filter @paperclipai/ui dev       # UI only
pnpm --filter @paperclipai/server dev   # Server only
pnpm run dev:both                        # Both
```

## Adding a new AI Provider

1. Add to `AI_PROVIDERS` in `app.js` and `ui/src/lib/ai.ts` and `server/src/routes/ai.ts`
2. Add env var to `.env.example` and `api/ai.js`
3. Update `AI_PROVIDERS` in `packages/shared/src/index.ts`

## Vercel Deploy

Framework Preset: Other
Build Command: `pnpm --filter @paperclipai/ui build`
Output: `ui/dist`

## License

MIT
