import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: "paperclip-server",
    version: "1.0.0-content-creator",
    pillars: {
      taskManager: "ok",
      orgChart: "ok",
      training: "ok",
      agenticOS: "ok"
    },
    env: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      mistral: !!process.env.MISTRAL_API_KEY,
      custom: !!process.env.CUSTOM_AI_API_KEY
    }
  });
});

export default router;
