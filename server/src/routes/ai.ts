// Re-export from legacy api/ai.js logic but as TS module for server package
// This is the same logic as /api/ai.js but for Express server

import express from "express";

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string; envKey: string }> = {
  openai: { baseUrl: "https://api.openai.com/v1", envKey: "OPENAI_API_KEY" },
  groq: { baseUrl: "https://api.groq.com/openai/v1", envKey: "GROQ_API_KEY" },
  openrouter: { baseUrl: "https://openrouter.ai/api/v1", envKey: "OPENROUTER_API_KEY" },
  deepseek: { baseUrl: "https://api.deepseek.com/v1", envKey: "DEEPSEEK_API_KEY" },
  mistral: { baseUrl: "https://api.mistral.ai/v1", envKey: "MISTRAL_API_KEY" },
  anthropic: { baseUrl: "https://api.anthropic.com", envKey: "ANTHROPIC_API_KEY" },
  gemini: { baseUrl: "https://generativelanguage.googleapis.com/v1beta", envKey: "GEMINI_API_KEY" },
  custom: { baseUrl: "", envKey: "CUSTOM_AI_API_KEY" }
};

function getEnvKey(provider: string) {
  const def = PROVIDER_DEFAULTS[provider] || PROVIDER_DEFAULTS.custom;
  return process.env[def.envKey] || process.env.AI_API_KEY || "";
}

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "AI Proxy ready — POST with {provider, model, prompt}",
    providers: Object.keys(PROVIDER_DEFAULTS),
    envConfigured: Object.fromEntries(
      Object.entries(PROVIDER_DEFAULTS).map(([p, d]) => [p, !!process.env[d.envKey]])
    )
  });
});

router.post("/", async (req, res) => {
  try {
    const {
      provider = "openai",
      apiKey: clientKey = "",
      model = "",
      baseUrl: clientBaseUrl = "",
      system = "",
      prompt = "",
      messages = null,
      temperature = 0.7,
      max_tokens = 2000
    } = req.body || {};

    const def = PROVIDER_DEFAULTS[provider] || PROVIDER_DEFAULTS.custom;
    const apiKey = clientKey || getEnvKey(provider);
    const baseUrl = (clientBaseUrl || def.baseUrl || "").replace(/\/$/, "");

    if (!apiKey && provider !== "custom") {
      return res.status(400).json({
        error: `API Key untuk ${provider} tidak ditemukan. Kirim apiKey di body atau set env ${def.envKey}`
      });
    }

    if (!prompt && !messages) {
      return res.status(400).json({ error: "prompt atau messages wajib diisi" });
    }

    let chatMessages = messages;
    if (!chatMessages) {
      chatMessages = [];
      if (system) chatMessages.push({ role: "system", content: system });
      chatMessages.push({ role: "user", content: prompt });
    }

    if (["openai", "groq", "openrouter", "deepseek", "mistral", "custom"].includes(provider)) {
      const url = `${baseUrl}/chat/completions`;
      const payload = {
        model: model || (provider === "groq" ? "llama-3.1-8b-instant" : provider === "deepseek" ? "deepseek-chat" : provider === "mistral" ? "mistral-small-latest" : "gpt-4o-mini"),
        messages: chatMessages,
        temperature: Number(temperature),
        max_tokens: Number(max_tokens)
      };

      const extraHeaders: any = {};
      if (provider === "openrouter") {
        extraHeaders["HTTP-Referer"] = req.headers.referer || "https://paperclip.vercel.app";
        extraHeaders["X-Title"] = "Paperclip AI";
      }

      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          ...extraHeaders
        },
        body: JSON.stringify(payload)
      });

      const data: any = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data.error?.message || data.error || "OpenAI compatible error", raw: data });
      }

      const content = data.choices?.[0]?.message?.content || "";
      return res.json({
        ok: true,
        provider,
        model: data.model || payload.model,
        content,
        usage: data.usage,
        raw: data
      });
    }

    if (provider === "anthropic") {
      const url = `${baseUrl}/v1/messages`;
      const sys = chatMessages.find((m: any) => m.role === "system")?.content || system || "";
      const userMsgs = chatMessages.filter((m: any) => m.role !== "system").map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }));

      const payload = {
        model: model || "claude-3-5-sonnet-20241022",
        max_tokens: Number(max_tokens),
        temperature: Number(temperature),
        system: sys || undefined,
        messages: userMsgs
      };

      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(payload)
      });

      const data: any = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data.error?.message || data.error || "Anthropic error", raw: data });
      }

      const content = data.content?.map((c: any) => c.text).join("\n") || "";
      return res.json({
        ok: true,
        provider,
        model: data.model,
        content,
        usage: data.usage,
        raw: data
      });
    }

    if (provider === "gemini") {
      const modelName = model || "gemini-1.5-flash";
      const url = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;

      const sys = chatMessages.find((m: any) => m.role === "system")?.content || system || "";
      const contents = chatMessages.filter((m: any) => m.role !== "system").map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const payload = {
        system_instruction: sys ? { parts: [{ text: sys }] } : undefined,
        contents,
        generationConfig: {
          temperature: Number(temperature),
          maxOutputTokens: Number(max_tokens)
        }
      };

      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data: any = await r.json();
      if (!r.ok) {
        return res.status(r.status).json({ error: data.error?.message || data.error || "Gemini error", raw: data });
      }

      const content = data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") || "";
      return res.json({
        ok: true,
        provider,
        model: modelName,
        content,
        usage: data.usageMetadata,
        raw: data
      });
    }

    return res.status(400).json({ error: `Provider ${provider} tidak didukung` });

  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message || "Internal error" });
  }
});

export default router;
