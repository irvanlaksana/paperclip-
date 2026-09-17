// 📎 Paperclip Server — Control Plane (Content Creator Edition)
// Mimics real paperclip server structure: identity, tasks, heartbeats, org chart, etc.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import aiRouter from "./routes/ai.js";
import healthRouter from "./routes/health.js";
import { companyRouter } from "./routes/company.js";
import { tasksRouter } from "./routes/tasks.js";
import { orgChartRouter } from "./routes/org.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes — Mirrors real Paperclip server structure
app.use("/api/ai", aiRouter);
app.use("/api/health", healthRouter);
app.use("/api/company", companyRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/org", orgChartRouter);

// Health check root
app.get("/api", (_req, res) => {
  res.json({
    ok: true,
    name: "paperclip-server",
    version: "1.0.0-content-creator",
    description: "Paperclip is the app people use to manage AI agents for work — Content Creator Edition",
    pillars: ["Agentic Task Manager", "Org Chart for Agents", "Agent Employee Training", "Agentic OS"],
    endpoints: ["/api/ai", "/api/health", "/api/company", "/api/tasks", "/api/org"],
    timestamp: new Date().toISOString()
  });
});

// Serve UI in production (if built)
const uiDistPath = path.join(__dirname, "../../ui/dist");
app.use(express.static(uiDistPath));

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  // If api route not matched and not static file, serve UI or legacy static
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  const legacyPath = path.join(__dirname, "../../index.html");
  res.sendFile(path.join(uiDistPath, "index.html"), (err) => {
    if (err) {
      res.sendFile(legacyPath, (err2) => {
        if (err2) res.status(404).send("UI not built — run pnpm --filter @paperclipai/ui build");
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`
📎 Paperclip Server running!
   Local: http://localhost:${PORT}
   API: http://localhost:${PORT}/api
   Health: http://localhost:${PORT}/api/health
   UI: http://localhost:${PORT}/

Pillars:
  • Agentic Task Manager — Declare intent. Agents work. You verify.
  • Org Chart for Agents — Roles, permissions & boundaries
  • Agent Employee Training — Skills, evals & active learning
  • Agentic OS — Runtime, sandboxing, cost controls
  `);
});

export default app;
