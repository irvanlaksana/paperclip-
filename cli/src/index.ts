#!/usr/bin/env node
// @paperclipai/cli — Mirrors real Paperclip CLI

console.log(`
📎 Paperclip CLI — Content Creator Edition

Usage:
  paperclip dev          Start dev server (ui + server)
  paperclip build        Build all packages
  paperclip start        Start production server
  paperclip --help       Show help

Monorepo (like real paperclipai/paperclip):
  pnpm --filter @paperclipai/ui dev       → UI only (Vite)
  pnpm --filter @paperclipai/server dev   → Server only (Express)
  pnpm dev                                → UI (default)
  pnpm run dev:both                       → Both via scripts/dev-both.mjs

Vercel Deploy:
  Framework Preset: Other
  Build Command: pnpm --filter @paperclipai/ui build
  Output Directory: ui/dist
  Install Command: pnpm install

API:
  /api/ai      → Multi AI provider proxy (8 providers)
  /api/health  → Health check
  /api/company → Company CRUD
  /api/tasks   → Task system
  /api/org    → Org chart

Docs: https://github.com/paperclipai/paperclip
`);

const cmd = process.argv[2];
if (cmd === "dev") {
  console.log("Starting dev... run: pnpm --filter @paperclipai/ui dev");
} else if (cmd === "build") {
  console.log("Building... run: pnpm -r build");
}
