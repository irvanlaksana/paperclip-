import express from "express";

export const companyRouter = express.Router();

// Mock company storage — in real Paperclip this is DB-backed with multi-org isolation
let company = {
  id: "company_default",
  name: "Sumber Listrik Jaya Content Engine",
  industry: "Distribusi alat & komponen listrik",
  mission: "Menghasilkan konten penjualan yang konsisten, akurat secara teknis, dan dioptimalkan untuk konversi",
  salesChannels: ["Shopee", "Tokopedia", "Instagram", "TikTok Shop", "WhatsApp Business"],
  budget: "Rp 100.000",
  heartbeat: "08:00",
  createdAt: new Date().toISOString()
};

companyRouter.get("/", (_req, res) => {
  res.json({ ok: true, company });
});

companyRouter.post("/", (req, res) => {
  company = { ...company, ...req.body, id: company.id };
  res.json({ ok: true, company });
});

companyRouter.get("/mission-prompt", (_req, res) => {
  const prompt = `Company Name: ${company.name} Content Engine
Industry: ${company.industry}
Sales Channels: ${company.salesChannels.join(", ")}

Mission:
${company.mission}

Budget: ${company.budget}
Heartbeat: Setiap hari jam ${company.heartbeat} WIB — cek antrian produk baru yang perlu konten`;
  res.json({ ok: true, prompt });
});
