// @paperclipai/shared — Shared types for Paperclip (mirrors real repo)

export type AgentRole = "ceo" | "cto" | "engineer" | "designer" | "marketer" | "seo_writer" | "copywriter" | "video_writer" | "qa_reviewer";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  icon: string;
  goal: string;
  reportsTo?: string;
  budget?: string;
  skills: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  mission: string;
  salesChannels: string[];
  budget: string;
  heartbeat: string;
}

export interface Task {
  id: string;
  title: string;
  goal: string;
  status: "open" | "in_progress" | "done" | "blocked";
  agentId: string;
  companyId: string;
  parentGoal?: string;
  createdAt: string;
}

export interface Product {
  nama: string;
  merek: string;
  kategori: string;
  spek: string;
  tegangan: string;
  arus: string;
  fitur: string[];
  harga: string;
  paket: string;
  garansi: string;
  sni: boolean;
  kota: string;
  target: string;
  durasi: number;
}

export const AI_PROVIDERS = ["openai", "anthropic", "gemini", "groq", "openrouter", "deepseek", "mistral", "custom"] as const;
export type AIProvider = typeof AI_PROVIDERS[number];

export interface AIConfig {
  enabled: boolean;
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  proxyMode: "auto" | "direct" | "proxy";
}
