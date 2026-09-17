<p align="center">
  <img src="doc/assets/banner.jpg" alt="Paperclip is the app people use to manage AI agents for work." width="720" />
</p>

<p align="center">
  <a href="#quickstart"><strong>Quickstart</strong></a> ·
  <a href="https://github.com/paperclipai/paperclip"><strong>Docs Original</strong></a> ·
  <a href="https://github.com/irvanlaksana/paperclip-"><strong>GitHub</strong></a> ·
  <a href="#-deploy-ke-vercel"><strong>Vercel Deploy</strong></a> ·
  <a href="#-setting-ai-api"><strong>AI API</strong></a>
</p>

<p align="center">
  <a href="https://github.com/irvanlaksana/paperclip-/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a>
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/irvanlaksana/paperclip-"><img src="https://img.shields.io/badge/deploy-vercel-black" alt="Deploy with Vercel" /></a>
  <img src="https://img.shields.io/badge/framework-Other%20%2B%20Vite-blue" alt="Framework" />
  <img src="https://img.shields.io/badge/AI-8%20Providers-green" alt="AI Providers" />
</p>

<br/>

# Paperclip is the app people use to manage AI agents for work.
### Content Creator Edition — Distribusi Alat Listrik ⚡

Open-source orchestration for teams of AI agents.

**If OpenClaw is an _employee_, Paperclip is the _company_.**

Paperclip is a Node.js server and React UI that orchestrates a team of AI agents to run a business. Bring your own agents, assign goals, and track work and costs from one dashboard.

**Content Creator Edition** mengkhususkan Paperclip untuk **bisnis distribusi alat listrik** — Marketplace + Social Media. Memproduksi listing marketplace, caption sosmed, dan skrip video pendek yang konsisten, SEO-friendly, dan akurat secara teknis untuk Shopee, Tokopedia, Instagram, TikTok Shop & WhatsApp.

It looks like a task manager. Under the hood: org charts, budgets, governance, goal alignment, and agent coordination.

**Manage business goals, not pull requests.**

| | Step | Example |
| --- | --- | --- |
| **01** | Define the goal | _"Menaikkan penjualan alat listrik lewat konten yang konsisten, SEO-friendly, dan akurat secara teknis."_ |
| **02** | Hire the team | Content Director, SEO Writer, Sosmed Copywriter, Video Script Writer, QA Reviewer — any bot, any provider. |
| **03** | Approve and run | Review strategy. Set budgets. Hit go. Monitor from the dashboard. |

<br/>

<div align="center">
<table>
  <tr>
    <td align="center"><strong>Works<br/>with</strong></td>
    <td align="center">🤖<br/><sub>OpenAI</sub></td>
    <td align="center">🧠<br/><sub>Claude</sub></td>
    <td align="center">💎<br/><sub>Gemini</sub></td>
    <td align="center">⚡<br/><sub>Groq</sub></td>
    <td align="center">🔀<br/><sub>OpenRouter</sub></td>
    <td align="center">🔍<br/><sub>DeepSeek</sub></td>
    <td align="center">🌬️<br/><sub>Mistral</sub></td>
    <td align="center">🔧<br/><sub>Custom</sub></td>
  </tr>
</table>

<em>If it can receive a heartbeat, it's hired.</em>

</div>

<br/>

## Quickstart

### Monorepo (mirip repo asli paperclipai/paperclip)

```bash
# Clone
git clone https://github.com/irvanlaksana/paperclip-.git
cd paperclip-

# Install (pnpm workspaces — seperti repo asli)
pnpm install

# Dev — UI only (Vite, seperti real Paperclip ui package)
pnpm --filter @paperclipai/ui dev
# → http://localhost:5173

# Dev — Server only (Express control plane)
pnpm --filter @paperclipai/server dev
# → http://localhost:3000

# Dev — Both (server + ui)
pnpm run dev:both

# Legacy static (tetap ada, tanpa build)
python3 -m http.server 8000
# atau
npx serve . -l 3000 -s
```

### Vercel Deploy (Otomatis)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irvanlaksana/paperclip-&project-name=paperclip-content-creator&repository-name=paperclip-content-creator)

- Framework Preset: **Other**
- Build Command: `pnpm --filter @paperclipai/ui build`
- Output Directory: `ui/dist`
- Install Command: `pnpm install`

Setiap `git push` ke `main` auto-deploy.

---

## The four pillars

Four things have to work for an organization of AI agents to actually produce: the tasks, the org, the training, and the infrastructure. Paperclip is built around exactly those four pillars.

| Pillar | Built for | What it covers | Di Content Creator Edition |
| --- | --- | --- | --- |
| **Agentic Task Manager** — Declare intent. Agents work. You verify. | Everyone, daily | Tasks, approvals & review gates · auditable routines | Pipeline: SEO → Sosmed → Video → QA, dengan traceability misi company |
| **Org Chart for Agents** — Roles, permissions & boundaries | Managers | Mixed human + agent org chart · governance | Content Director (manager) + 4 agen spesialis |
| **Agent Employee Training** — Design, train & evaluate | Enablers | Skill Studio & shared org-wide skills · evals | Skill: SEO marketplace, copywriting, video script, QA brand voice |
| **Agentic OS** — The infrastructure that makes the work run | IT & platform | Cross-provider runtime: any model, any agent · cost controls | 8 AI providers + proxy `/api/ai` + budget per agent + heartbeat 08:00 WIB |

---

## Organisasi (Org Chart)

```
COMPANY: [Nama Toko] Content Engine
└── 🎬 Content Director (Manager Agent)
    ├── 🛒 Marketplace SEO Writer
    │     → Judul produk (≤100 karakter), 5–8 keyword, 5–7 bullet, deskripsi 150–300 kata
    ├── 📱 Social Media Copywriter
    │     → Caption IG/TikTok (3 varian tone), 8–12 hashtag, broadcast WhatsApp
    ├── 🎥 Video Script & Storyboard Writer
    │     → Skrip TikTok/Reels 15–45 detik per produk, storyboard per adegan
    └── 🔍 QA & Brand Voice Reviewer
          → Cek tone, klaim berlebihan, dan akurasi istilah kelistrikan (voltase, ampere, SNI)
```

Setiap task yang dibuat agen **bisa ditelusuri ke misi company** — jadi saat Social Media Copywriter membuat caption, ia "tahu" itu untuk mendukung goal penjualan marketplace, bukan sekadar posting acak.

---

## Cara kerja

1. **Onboarding** — isi nama toko, sales channels, misi company, budget & heartbeat (08:00 WIB). Salin *Prompt Company Mission* untuk onboarding di Paperclip.
2. **Org Chart** — salin prompt tiap agen (siap tempel).
3. **🤖 Setting AI API** — pilih provider (OpenAI, Claude, Gemini, Groq, OpenRouter, DeepSeek, Mistral, Custom), masukkan API key, test koneksi.
4. **Bahan produk** — isi spesifikasi produk listrik (atau klik ⚡ Isi Contoh: saklar / kabel NYM / lampu LED).
5. **Jalankan pipeline** — Content Director menugaskan 4 agen secara berurutan:
   - **Marketplace SEO**: judul format `[Merek/Jenis] + [Fungsi] + [Ukuran/Spesifikasi] + [Kata kunci]`, keyword, bullet point, deskripsi 3 paragraf — siap tempel ke kolom marketplace.
   - **Sosmed**: 3 varian caption (informatif / soft-selling / hard-selling) + broadcast WA.
   - **Video**: storyboard teks siap syuting (waktu, visual, voice over/teks) + caption + catatan musik.
   - **QA Review**: laporan otomatis (batas karakter, jumlah keyword/bullet/kata/hashtag, larangan klaim berlebihan, klaim SNI harus sesuai sertifikat, parameter teknis tercantum).
6. Klik **Salin**, tempel ke toko / sosmed kamu. Beres. ⚡

---

## 🤖 Setting AI API — Multi Provider

Sekarang support **8 provider AI** dengan UI setting lengkap + proxy Vercel anti-CORS!

### Provider yang didukung:
| Provider | Model Rekomendasi | Gratis? | Kecepatan |
|---|---|---|---|
| **OpenAI** | `gpt-4o-mini`, `gpt-4o` | ❌ | ⭐⭐⭐ |
| **Anthropic Claude** | `claude-3-5-sonnet`, `claude-3-5-haiku` | ❌ | ⭐⭐⭐⭐ |
| **Google Gemini** | `gemini-1.5-flash` (free tier) | ✅ | ⭐⭐⭐⭐ |
| **Groq** | `llama-3.1-8b-instant` (super cepat) | ✅ | ⭐⭐⭐⭐⭐ |
| **OpenRouter** | `openai/gpt-4o-mini`, `meta-llama/...:free` | ✅ | ⭐⭐⭐ |
| **DeepSeek** | `deepseek-chat` (murah) | ✅ | ⭐⭐⭐ |
| **Mistral** | `mistral-small-latest` | ✅ | ⭐⭐⭐ |
| **Custom** | OpenAI Compatible apa pun | — | — |

### Cara pakai:

**1. Mode Template (default, offline, gratis):**
- Tidak perlu API key
- Pakai logic template lokal yang sudah SEO-optimized

**2. Mode AI API (aktifkan di UI):**
- Buka section **🤖 Setting AI API**
- Toggle **Aktifkan AI API**
- Pilih provider (misal Groq untuk gratis & cepat)
- Masukkan API Key (disimpan di localStorage, tidak ke repo)
- Pilih model
- Klik **🧪 Test Koneksi** → **💾 Simpan**
- Jalankan pipeline — semua agen akan pakai LLM!

**3. Per-Agent Override (Advanced):**
- Buka **⚙️ Setting Per-Agent**
- Bisa set provider/model beda per agen
- Contoh: SEO pakai `gpt-4o`, Sosmed pakai `claude-3-5-sonnet`, Video pakai `gemini-1.5-flash`

**4. Proxy Vercel (Production, anti-CORS):**
- File `api/ai.js` + `server/src/routes/ai.ts` otomatis jadi serverless / Express proxy
- Mode Proxy `Auto` akan pakai `/api/ai` saat di Vercel
- Set API Key di Vercel Dashboard → Settings → Environment Variables:
```
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...
```
- Jika env ada, client tidak perlu input key lagi (lebih aman)

**Flow (mirip real Paperclip heartbeat):**
```
User Input → Content Director (manager) → Heartbeat 08:00 WIB
  → [SEO Writer (AI/Template)] → [Sosmed (AI/Template)] → [Video (AI/Template)] → QA (governance) → Output
```

---

## Aturan QA (dijalankan otomatis)

- Judul ≤ 100 karakter · 5–8 keyword · 5–7 bullet · deskripsi 150–300 kata
- 8–12 hashtag per caption · semua caption wajib punya CTA
- Bebas klaim tak bisa dibuktikan ("tidak akan pernah rusak", "paling murah", dll)
- Klaim **SNI** hanya boleh jika produk memang dicentang bersertifikat
- Tegangan (volt) & arus (ampere) dari input harus tercantum di listing

---

## 🚀 Deploy ke Vercel (Otomatis)

Proyek ini sudah dikonfigurasi **zero-config** untuk Vercel, mirip struktur monorepo asli:

- `pnpm-workspace.yaml` — workspaces: `ui`, `server`, `cli`, `packages/*`
- `vercel.json` — `framework: null`, `buildCommand: pnpm --filter @paperclipai/ui build`, `outputDirectory: ui/dist`
- `package.json` root — scripts: `dev`, `dev:server`, `dev:ui`, `dev:both`, `build`, seperti repo asli
- `server/` — Express control plane (mirip real Paperclip server) + API proxy multi-AI
- `ui/` — React + Vite dashboard (mirip real Paperclip ui) + embedded legacy static
- `api/` — legacy Vercel serverless proxy (tetap ada untuk backward compat)
- 100% bisa jalan tanpa build (legacy `index.html`) atau dengan build (React UI)

### 3 Cara Deploy Otomatis:

**1. One-Click Deploy (paling cepat):**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irvanlaksana/paperclip-&project-name=paperclip-content-creator&repository-name=paperclip-content-creator)

**2. Import dari GitHub Dashboard:**
- Buka https://vercel.com/new
- Import repo `irvanlaksana/paperclip-`
- Framework Preset akan terdeteksi `Other` otomatis karena `vercel.json`
- Build Command: `pnpm --filter @paperclipai/ui build` (sudah set di vercel.json)
- Output Directory: `ui/dist`
- Klik **Deploy** — selesai, langsung live!

**3. Via CLI:**
```bash
npm i -g vercel
vercel --prod
# atau
npx vercel --prod
```

Setelah deploy, setiap `git push` ke branch `main` akan otomatis trigger deploy baru (Vercel Git Integration).

### Cek Deployment Lokal (mirip Vercel):

```bash
# Monorepo style (real Paperclip style)
pnpm install
pnpm --filter @paperclipai/ui build
pnpm --filter @paperclipai/ui preview

# atau legacy static
npx serve . -l 3000 -s
# atau
python3 -m http.server 8000
```

---

## Struktur — Mirip Repo Asli paperclipai/paperclip

```
paperclip-/
├── package.json (root, pnpm workspaces, scripts: dev, dev:server, dev:ui, build — mirip asli)
├── pnpm-workspace.yaml (workspaces: ui, server, cli, packages/*)
├── tsconfig.base.json + tsconfig.json (references)
├── vercel.json (Other + build ui/dist)
├── Dockerfile (Node 20 + pnpm, multi-stage)
├── .env.example (env untuk 8 provider)
├── scripts/
│   ├── dev-both.mjs (jalankan server + ui bersamaan, mirip asli)
│   └── link-workspace.mjs
├── doc/assets/ (banner, logos)
│
├── server/ (@paperclipai/server — Control Plane, mirip asli)
│   ├── package.json
│   ├── src/
│   │   ├── index.ts (Express server + static serve + API)
│   │   └── routes/
│   │       ├── ai.ts (multi-AI proxy, 8 providers)
│   │       ├── health.ts
│   │       ├── company.ts (company CRUD, mission prompt)
│   │       ├── tasks.ts (ticket-based task system)
│   │       └── org.ts (org chart, roles, budgets)
│
├── ui/ (@paperclipai/ui — React Dashboard, mirip asli)
│   ├── package.json (Vite + React 19)
│   ├── vite.config.ts (proxy /api → localhost:3000)
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx (Dashboard + Org Chart + Tasks + Content Engine iframe)
│       ├── styles.css (copied dari legacy)
│       └── lib/ai.ts (AI providers)
│
├── packages/
│   ├── shared/ (@paperclipai/shared — shared types, mirip asli)
│   └── db/ (@paperclipai/db — mock DB layer)
│
├── cli/ (@paperclipai/cli — CLI, mirip asli)
│   └── src/index.ts
│
├── api/ (legacy Vercel serverless, tetap ada untuk backward compat)
│   ├── ai.js (proxy 8 providers)
│   └── health.js
│
└── Legacy static (tetap jalan, tanpa build — untuk Vercel Other fallback)
    ├── index.html (onboarding + org chart + AI settings + product form)
    ├── app.js (pipeline template + AI API multi-provider)
    └── styles.css
```

### Perbandingan dengan Repo Asli

| Aspek | paperclipai/paperclip (asli) | paperclip- Content Creator Edition (ini) |
|---|---|---|
| **Package Manager** | pnpm workspaces | ✅ pnpm workspaces (sama) |
| **Server** | Node.js + Express + Rust runner | ✅ Node.js + Express (simplified control plane) |
| **UI** | React + Vite + Storybook | ✅ React + Vite (App.tsx dashboard) |
| **Packages** | shared, db, adapters, plugins, etc. | ✅ shared, db (mock), adapters concept via AI providers |
| **CLI** | `paperclip` CLI | ✅ `@paperclipai/cli` mock |
| **Dockerfile** | Multi-stage Node 24 + Rust | ✅ Multi-stage Node 20 + pnpm (simplified) |
| **Four Pillars** | Task Manager, Org Chart, Training, OS | ✅ Diimplementasi untuk content creator |
| **Agents** | Any agent (Claude, Codex, Cursor, etc.) | ✅ 8 AI providers (OpenAI, Claude, Gemini, Groq, etc.) + template |
| **Heartbeat** | DB-backed wakeup queue | ✅ Heartbeat 08:00 WIB mock |
| **Budget** | Token & cost tracking per agent | ✅ Budget per agent Rp 25.000 |
| **Deploy** | Self-hosted / Docker | ✅ Vercel (Other + ui/dist) + Docker + static fallback |

---

## What's Under the Hood (mirip asli)

```
┌──────────────────────────────────────────────────────────────┐
│                       PAPERCLIP SERVER                       │
│                  (Content Creator Edition)                   │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │Identity & │  │  Work &   │  │ Heartbeat │  │Governance │  │
│  │  Access   │  │   Tasks   │  │ Execution │  │& Approvals│  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Org Chart │  │Workspaces │  │  Plugins  │  │  Budget   │  │
│  │ & Agents  │  │ & Runtime │  │ (AI Prov) │  │ & Costs   │  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
└──────────────────────────────────────────────────────────────┘
         ▲              ▲              ▲              ▲
   ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐  ┌─────┴─────┐
   │  OpenAI   │  │  Claude   │  │   Groq    │  │  Gemini   │
   │   GPT-4o  │  │  Sonnet   │  │  Llama 3  │  │   Flash   │
   └───────────┘  └───────────┘  └───────────┘  └───────────┘
```

---

## License

MIT — sama seperti repo asli [paperclipai/paperclip](https://github.com/paperclipai/paperclip/blob/master/LICENSE)

---

## Credits

- Original Paperclip by [paperclipai](https://github.com/paperclipai/paperclip) — 80.9k stars, 14.9k forks
- Content Creator Edition for electrical distribution — Marketplace + Social Media
- Structure mimics real repo: pnpm workspaces, server + ui + packages + cli + Dockerfile
- Deploy ready for Vercel (Other) + Docker
