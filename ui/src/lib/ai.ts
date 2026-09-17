// Shared AI provider definitions — same as root app.js
export const AI_PROVIDERS = {
  openai: { label: "OpenAI", baseUrl: "https://api.openai.com/v1", models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"], defaultModel: "gpt-4o-mini" },
  anthropic: { label: "Anthropic Claude", baseUrl: "https://api.anthropic.com", models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"], defaultModel: "claude-3-5-sonnet-20241022" },
  gemini: { label: "Google Gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", models: ["gemini-1.5-flash", "gemini-1.5-pro"], defaultModel: "gemini-1.5-flash" },
  groq: { label: "Groq", baseUrl: "https://api.groq.com/openai/v1", models: ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"], defaultModel: "llama-3.1-8b-instant" },
  openrouter: { label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", models: ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet"], defaultModel: "openai/gpt-4o-mini" },
  deepseek: { label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", models: ["deepseek-chat"], defaultModel: "deepseek-chat" },
  mistral: { label: "Mistral", baseUrl: "https://api.mistral.ai/v1", models: ["mistral-small-latest"], defaultModel: "mistral-small-latest" },
  custom: { label: "Custom", baseUrl: "", models: ["custom-model"], defaultModel: "gpt-3.5-turbo" }
} as const;

export type Provider = keyof typeof AI_PROVIDERS;

export async function callAI({ provider, model, apiKey, baseUrl, system, prompt, temperature = 0.7 }: any) {
  const isVercel = typeof window !== "undefined" && window.location.hostname.includes("vercel.app");
  const useProxy = isVercel || !apiKey;
  
  if (useProxy) {
    const r = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, model, apiKey, baseUrl, system, prompt, temperature })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data;
  } else {
    // direct
    const def = AI_PROVIDERS[provider as Provider];
    const url = `${(baseUrl || def.baseUrl).replace(/\/$/, "")}/chat/completions`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model || def.defaultModel,
        messages: [...(system ? [{ role: "system", content: system }] : []), { role: "user", content: prompt }],
        temperature
      })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error?.message || "AI error");
    return { content: data.choices[0].message.content, model: data.model };
  }
}
