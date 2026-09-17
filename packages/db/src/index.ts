// @paperclipai/db — Mock DB layer (in real Paperclip this is Postgres + Drizzle)
// For Content Creator Edition, we use in-memory + localStorage

export const db = {
  companies: new Map(),
  agents: new Map(),
  tasks: new Map(),
  // In real Paperclip: atomic checkout, budget enforcement, heartbeat queue, etc.
  version: "1.0.0-content-creator"
};

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
