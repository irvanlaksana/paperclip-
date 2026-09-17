import express from "express";

export const orgChartRouter = express.Router();

// Mirrors real Paperclip org chart: roles, reporting lines, permissions, budgets
const orgChart = {
  company: "Sumber Listrik Jaya Content Engine",
  director: {
    id: "director_1",
    role: "Content Director",
    type: "manager",
    goal: "Menerima misi company, membagi task ke agen, dan memastikan semua output mendukung goal penjualan",
    budget: "Rp 100.000",
    heartbeat: "08:00"
  },
  agents: [
    {
      id: "seo",
      icon: "🛒",
      role: "Marketplace SEO Writer",
      type: "agent",
      goal: "Membuat listing produk SEO-friendly untuk Shopee & Tokopedia",
      reportsTo: "director_1",
      budget: "Rp 25.000",
      skills: ["seo", "copywriting", "marketplace"]
    },
    {
      id: "sosmed",
      icon: "📱",
      role: "Social Media Copywriter",
      type: "agent",
      goal: "Membuat caption IG/TikTok dan broadcast WA yang mendorong klik ke marketplace",
      reportsTo: "director_1",
      budget: "Rp 25.000",
      skills: ["copywriting", "social-media", "hashtag"]
    },
    {
      id: "video",
      icon: "🎥",
      role: "Video Script & Storyboard Writer",
      type: "agent",
      goal: "Membuat skrip video pendek 15-45 detik format storyboard",
      reportsTo: "director_1",
      budget: "Rp 25.000",
      skills: ["video-script", "storyboard"]
    },
    {
      id: "qa",
      icon: "🔍",
      role: "QA & Brand Voice Reviewer",
      type: "agent",
      goal: "Mengecek output agar konsisten tone, bebas klaim berlebihan, dan akurat teknis",
      reportsTo: "director_1",
      budget: "Rp 25.000",
      skills: ["qa", "brand-voice", "compliance"]
    }
  ]
};

orgChartRouter.get("/", (_req, res) => {
  res.json({ ok: true, orgChart });
});

orgChartRouter.get("/:agentId", (req, res) => {
  const agent = orgChart.agents.find(a => a.id === req.params.agentId);
  if (!agent) return res.status(404).json({ error: "Agent not found" });
  res.json({ ok: true, agent });
});
