#!/usr/bin/env node
// Mirrors real Paperclip scripts/dev-both.mjs — runs server + ui concurrently

import { spawn } from "child_process";

console.log("📎 Paperclip — Starting both server and UI...\n");

const server = spawn("pnpm", ["--filter", "@paperclipai/server", "dev"], { stdio: "inherit", shell: true });
const ui = spawn("pnpm", ["--filter", "@paperclipai/ui", "dev"], { stdio: "inherit", shell: true });

process.on("SIGINT", () => {
  server.kill();
  ui.kill();
  process.exit();
});
