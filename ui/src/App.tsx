import { useEffect, useState } from "react";

// This React App mirrors the real Paperclip UI structure:
// - Server + UI monorepo (pnpm workspaces)
// - Org Chart, Task Manager, Heartbeats, Budgets
// - But Content Creator Edition for electrical distribution

// For now, we embed the legacy static logic via iframe fallback,
// but also provide React dashboard that talks to /api/* (real Paperclip pattern)

export default function App() {
  const [company, setCompany] = useState({
    toko: "Sumber Listrik Jaya",
    budget: "Rp 100.000",
    misi: "Menghasilkan konten penjualan yang konsisten, akurat secara teknis, dan dioptimalkan untuk konversi",
    channels: ["Shopee", "Tokopedia", "Instagram", "TikTok Shop", "WhatsApp Business"]
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [apiStatus, setApiStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health").then(r=>r.json()).then(setApiStatus).catch(()=>setApiStatus({ ok: false }));
  }, []);

  return (
    <div className="paperclip-app">
      {/* Header — like real Paperclip banner */}
      <header className="hero">
        <div className="hero-inner">
          <div className="logo">📎 Paperclip <span className="edition">Content Creator Edition</span></div>
          <h1>Paperclip is the app people use to manage AI agents for work.</h1>
          <p>Content Engine untuk Distribusi Alat Listrik ⚡ — Orchestration for teams of AI agents.<br/>
          <b>If OpenClaw is an employee, Paperclip is the company.</b></p>
          <div style={{ marginTop: "1rem", display: "flex", gap: ".5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <span className="badge">Agentic Task Manager</span>
            <span className="badge">Org Chart for Agents</span>
            <span className="badge">Agent Training</span>
            <span className="badge">Agentic OS</span>
          </div>
        </div>
      </header>

      <main className="wrap">
        {/* Nav like real Paperclip */}
        <nav className="tabs" style={{ marginBottom: "1rem" }}>
          <button className={`tab ${activeTab==="dashboard"?"active":""}`} onClick={()=>setActiveTab("dashboard")}>📊 Dashboard</button>
          <button className={`tab ${activeTab==="org"?"active":""}`} onClick={()=>setActiveTab("org")}>🏢 Org Chart</button>
          <button className={`tab ${activeTab==="tasks"?"active":""}`} onClick={()=>setActiveTab("tasks")}>🎫 Tasks</button>
          <button className={`tab ${activeTab==="content"?"active":""}`} onClick={()=>setActiveTab("content")}>🎬 Content Engine</button>
          <button className={`tab ${activeTab==="settings"?"active":""}`} onClick={()=>setActiveTab("settings")}>⚙️ Settings</button>
        </nav>

        {activeTab === "dashboard" && (
          <section className="card">
            <h2>📊 Dashboard — Four Pillars</h2>
            <p className="hint">Real Paperclip is built around four pillars. Content Creator Edition implements them for electrical distribution.</p>
            <div className="org-children" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="agent-card">
                <div className="a-icon">🎫</div>
                <div className="a-role">Agentic Task Manager</div>
                <div className="a-goal">Declare intent. Agents work. You verify. Tasks, approvals & review gates.</div>
                <div className="muted small">Status: {apiStatus?.ok ? "✅ API OK" : "⏳ Checking..."}</div>
              </div>
              <div className="agent-card">
                <div className="a-icon">🏢</div>
                <div className="a-role">Org Chart for Agents</div>
                <div className="a-goal">Roles, permissions & boundaries. Mixed human + agent org chart.</div>
                <div className="muted small">Agents: 4 (SEO, Sosmed, Video, QA)</div>
              </div>
              <div className="agent-card">
                <div className="a-icon">🎓</div>
                <div className="a-role">Agent Employee Training</div>
                <div className="a-goal">Skills, evals & active learning loops. Performance reviews for agents.</div>
                <div className="muted small">Skills: seo, copywriting, video-script, qa</div>
              </div>
              <div className="agent-card">
                <div className="a-icon">⚙️</div>
                <div className="a-role">Agentic OS</div>
                <div className="a-goal">Runtime, sandboxing, cost controls, budgets, heartbeats.</div>
                <div className="muted small">Budget: {company.budget} / Heartbeat: 08:00 WIB</div>
              </div>
            </div>

            <div style={{ marginTop: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: ".9rem" }}>Company: {company.toko} Content Engine</h3>
              <p className="hint">Misi: {company.misi}</p>
              <p className="muted small">Channels: {company.channels.join(", ")} | API: {apiStatus ? JSON.stringify(apiStatus.env || {}) : "loading..."}</p>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <a href="/" className="btn-ghost" style={{ display: "inline-block", width: "auto", textDecoration: "none" }}>← Buka Legacy Static UI (index.html)</a>
              <span className="muted small" style={{ marginLeft: ".5rem" }}>Legacy UI tetap ada di root untuk backward compat</span>
            </div>
          </section>
        )}

        {activeTab === "org" && (
          <section className="card">
            <h2>🏢 Org Chart — Roles & Reporting Lines</h2>
            <p className="hint">Seperti Paperclip asli: hierarchies, roles, reporting lines, budgets.</p>
            <div className="org">
              <div className="director-card">
                <div className="d-icon">🎬</div>
                <div>
                  <div className="d-role">Content Director <span className="badge badge-manager">Manager Agent</span></div>
                  <div className="d-goal">Menerima misi company, membagi task ke agen, memastikan output mendukung goal penjualan.</div>
                </div>
              </div>
              <div className="org-branch"></div>
              <div className="org-children">
                {[
                  { icon: "🛒", role: "Marketplace SEO Writer", goal: "Listing SEO-friendly untuk Shopee & Tokopedia" },
                  { icon: "📱", role: "Social Media Copywriter", goal: "Caption IG/TikTok & broadcast WA" },
                  { icon: "🎥", role: "Video Script Writer", goal: "Skrip video pendek 15-45 detik storyboard" },
                  { icon: "🔍", role: "QA & Brand Voice Reviewer", goal: "Cek tone, klaim, akurasi teknis" }
                ].map(a=>(
                  <div className="agent-card" key={a.role}>
                    <div className="a-icon">{a.icon}</div>
                    <div className="a-role">{a.role} <span className="badge">Agent</span></div>
                    <div className="a-goal">{a.goal}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "tasks" && (
          <section className="card">
            <h2>🎫 Task System — Ticket-based</h2>
            <p className="hint">Setiap task punya goal ancestry, seperti Paperclip asli. Atomic checkout, no double-work.</p>
            <div className="checklist">
              <div className="check-item ok"><span className="mark">✅</span><div><b>Build listing SEO untuk Saklar Tunggal</b><div className="detail">Agent: SEO Writer · Goal: Menaikkan penjualan marketplace · Status: done</div></div></div>
              <div className="check-item"><span className="mark">⏳</span><div><b>Buat caption sosmed untuk Kabel NYM</b><div className="detail">Agent: Sosmed · Goal: Drive traffic ke Shopee · Status: open</div></div></div>
              <div className="check-item"><span className="mark">⏳</span><div><b>Storyboard video Lampu LED</b><div className="detail">Agent: Video · Goal: Konversi TikTok Shop · Status: open</div></div></div>
            </div>
            <p className="muted small" style={{ marginTop: ".8rem" }}>Di Paperclip asli, tasks disimpan di DB dengan company-scoped isolation. Di Content Creator Edition, ini di-mock di server/src/routes/tasks.ts</p>
          </section>
        )}

        {activeTab === "content" && (
          <section className="card">
            <h2>🎬 Content Engine — Legacy UI Embedded</h2>
            <p className="hint">Content Creator Edition yang asli (static HTML) di-embed di sini, tapi juga tersedia di root <code>/legacy.html</code> (public) dan <code>/index.html</code> legacy root untuk Vercel static deploy.</p>
            <div style={{ border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden", height: "800px" }}>
              <iframe src="/legacy.html" style={{ width: "100%", height: "100%", border: "none" }} title="Legacy Content Creator"></iframe>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="card">
            <h2>⚙️ Settings — Multi AI Provider + Vercel Deploy</h2>
            <p className="hint">Seperti Paperclip asli yang support multi-provider (OpenClaw, Claude, Codex, Cursor, Bash, HTTP).</p>
            
            <div className="grid2">
              <label>Company Name<input value={company.toko} onChange={e=>setCompany({...company, toko: e.target.value})} /></label>
              <label>Budget<input value={company.budget} onChange={e=>setCompany({...company, budget: e.target.value})} /></label>
            </div>

            <h3 style={{ marginTop: "1rem", fontSize: ".9rem" }}>🤖 AI Providers (8)</h3>
            <div className="chips">
              {["OpenAI", "Claude", "Gemini", "Groq", "OpenRouter", "DeepSeek", "Mistral", "Custom"].map(p=>(
                <span key={p} className="chip">{p}</span>
              ))}
            </div>

            <h3 style={{ marginTop: "1rem", fontSize: ".9rem" }}>🚀 Vercel Deploy</h3>
            <p className="hint">Framework Preset: <b>Other</b> (static) — Build Command: <code>pnpm --filter @paperclipai/ui build</code> — Output: <code>ui/dist</code> — API: <code>/api/*</code> serverless</p>
            <div className="code-block">
{`// vercel.json (root)
{
  "framework": null,
  "buildCommand": "pnpm --filter @paperclipai/ui build",
  "outputDirectory": "ui/dist",
  "installCommand": "pnpm install"
}

// pnpm-workspace.yaml
packages:
  - ui
  - server
  - cli
  - packages/*`}
            </div>

            <h3 style={{ marginTop: "1rem", fontSize: ".9rem" }}>📦 Monorepo Structure (mirip paperclipai/paperclip)</h3>
            <div className="code-block">
{`paperclip-/
├── package.json (root, pnpm workspaces)
├── pnpm-workspace.yaml
├── vercel.json (Other + build ui)
├── Dockerfile (Node 24 + pnpm)
├── server/ (@paperclipai/server - Express control plane)
│   ├── src/index.ts (API + static serve)
│   └── src/routes/{ai,health,company,tasks,org}.ts
├── ui/ (@paperclipai/ui - React + Vite)
│   ├── src/App.tsx (Dashboard + Org Chart + Tasks)
│   └── src/lib/ai.ts (multi-provider)
├── packages/shared (shared types)
├── cli/ (@paperclipai/cli)
├── api/ (legacy Vercel serverless proxy, tetap ada)
├── index.html + app.js + styles.css (legacy static, tetap jalan)
└── doc/assets/ (banner)`}
            </div>
          </section>
        )}
      </main>

      <footer>
        <p>📎 Paperclip — The open-source app everyone uses to manage agents at work · Content Creator Edition · Framework: Other · Build: pnpm --filter @paperclipai/ui build</p>
      </footer>
    </div>
  );
}
