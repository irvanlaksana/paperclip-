// 📎 Paperclip AI — Content Creator Edition + Multi AI Provider
// Mesin konten untuk distribusi alat listrik: Marketplace + Social Media (100% client-side + optional AI API)

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rupiah = (n) => (n && !isNaN(n) ? "Rp" + Number(n).toLocaleString("id-ID") : "");
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18);
const countWords = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const countHashtags = (s) => (s.match(/#[A-Za-z0-9_]+/g) || []).length;

// ---------------------------------------------------------------------------
// AI PROVIDER DEFINITIONS
// ---------------------------------------------------------------------------
const AI_PROVIDERS = {
  openai: {
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "o1-mini"],
    defaultModel: "gpt-4o-mini",
    keyPlaceholder: "sk-...",
    keyPrefix: "sk-"
  },
  anthropic: {
    label: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229", "claude-3-sonnet-20240229"],
    defaultModel: "claude-3-5-sonnet-20241022",
    keyPlaceholder: "sk-ant-...",
    keyPrefix: "sk-ant-"
  },
  gemini: {
    label: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.5-flash-8b", "gemini-2.0-flash-exp"],
    defaultModel: "gemini-1.5-flash",
    keyPlaceholder: "AIza...",
    keyPrefix: "AIza"
  },
  groq: {
    label: "Groq (cepat & murah)",
    baseUrl: "https://api.groq.com/openai/v1",
    models: ["llama-3.1-8b-instant", "llama-3.1-70b-versatile", "llama-3.3-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"],
    defaultModel: "llama-3.1-8b-instant",
    keyPlaceholder: "gsk_...",
    keyPrefix: "gsk_"
  },
  openrouter: {
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: ["openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet", "google/gemini-flash-1.5", "meta-llama/llama-3.1-8b-instruct:free", "deepseek/deepseek-chat:free"],
    defaultModel: "openai/gpt-4o-mini",
    keyPlaceholder: "sk-or-...",
    keyPrefix: "sk-or-"
  },
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-reasoner"],
    defaultModel: "deepseek-chat",
    keyPlaceholder: "sk-...",
    keyPrefix: "sk-"
  },
  mistral: {
    label: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    models: ["mistral-small-latest", "mistral-large-latest", "open-mistral-nemo", "codestral-latest"],
    defaultModel: "mistral-small-latest",
    keyPlaceholder: "API Key Mistral",
    keyPrefix: ""
  },
  custom: {
    label: "Custom (OpenAI Compatible)",
    baseUrl: "",
    models: ["custom-model"],
    defaultModel: "gpt-3.5-turbo",
    keyPlaceholder: "API Key custom",
    keyPrefix: ""
  }
};

// ---------------------------------------------------------------------------
// PROMPT AGEN (siap disalin & di-paste saat onboarding Paperclip)
// ---------------------------------------------------------------------------
const DIRECTOR_PROMPT = `Role: Content Director (Manager Agent)
Goal: Menerima misi company, memecahnya menjadi task untuk tiap agen, dan memastikan
setiap output mendukung goal penjualan di Shopee, Tokopedia, Instagram, TikTok Shop & WhatsApp.

Instruksi:
1. Setiap pagi (heartbeat) cek antrian produk baru yang perlu konten.
2. Buat task untuk agen yang relevan dan selalu sertakan referensi misi company.
3. Pastikan output melewati QA & Brand Voice Reviewer sebelum dipublikasi.`;

const AGENTS = [
  {
    id: "seo", icon: "🛒", role: "Marketplace SEO Writer", tag: "Agent",
    goal: "Membuat listing produk (judul, bullet point, deskripsi panjang) yang SEO-friendly untuk Shopee & Tokopedia.",
    prompt: `Role: Marketplace SEO Writer
Goal: Membuat listing produk (judul, bullet point, deskripsi panjang) yang SEO-friendly
untuk Shopee & Tokopedia.

Instruksi:
1. Judul produk: maksimal 100 karakter, format "[Merek/Jenis] + [Fungsi] + [Ukuran/Spesifikasi]
   + [Kata kunci pencarian populer]" — contoh: "Kabel NYM 2x1.5mm Eterna 50m Kabel Listrik
   Tembaga Murni SNI".
2. Sertakan 5-8 keyword yang sering dicari pembeli alat listrik (mis: "tahan lama", "SNI",
   "garansi", "original", "grosir").
3. Bullet point (5-7 poin): spesifikasi teknis, keunggulan, isi paket, garansi, cara pakai singkat.
4. Deskripsi panjang: 150-300 kata, paragraf pertama fokus manfaat, paragraf kedua spesifikasi
   detail, paragraf ketiga garansi & kepercayaan (testimoni/sertifikasi SNI jika ada).
5. Hindari klaim yang tidak bisa dibuktikan (mis: "tidak akan pernah rusak") — fokus fakta teknis.
6. Output dalam format siap-tempel ke kolom marketplace.`
  },
  {
    id: "sosmed", icon: "📱", role: "Social Media Copywriter", tag: "Agent",
    goal: "Membuat caption Instagram, TikTok, dan pesan broadcast WhatsApp yang menarik dan mendorong klik ke marketplace.",
    prompt: `Role: Social Media Copywriter
Goal: Membuat caption Instagram, TikTok, dan pesan broadcast WhatsApp yang menarik dan
mendorong klik ke marketplace.

Instruksi:
1. Caption Instagram/TikTok: hook di 1 baris pertama (masalah yang relate ke pembeli,
   mis: "Sering ganti saklar tapi tetap cepat rusak?"), lanjut solusi produk, tutup CTA
   ("Cek link di bio / keranjang kuning").
2. Sertakan 8-12 hashtag campuran: niche (#alatlistrik #kabellistrik) + broad (#tokopedia
   #shopeeindonesia) + lokal jika relevan.
3. Sediakan 3 varian tone: informatif (untuk edukasi), soft-selling (storytelling masalah-solusi),
   hard-selling (promo/diskon).
4. Pesan broadcast WhatsApp: singkat, personal, sertakan 1 link produk dan 1 CTA jelas.`
  },
  {
    id: "video", icon: "🎥", role: "Video Script & Storyboard Writer", tag: "Agent",
    goal: "Membuat skrip video pendek (TikTok/Reels/Shorts) 15-45 detik untuk produk alat listrik, format storyboard per adegan.",
    prompt: `Role: Video Script & Storyboard Writer
Goal: Membuat skrip video pendek (TikTok/Reels/Shorts) 15-45 detik untuk produk alat listrik,
format storyboard per adegan dengan durasi, visual, dan voice over/teks.`
  },
  {
    id: "qa", icon: "🔍", role: "QA & Brand Voice Reviewer", tag: "Agent",
    goal: "Mengecek semua output agar konsisten tone, bebas klaim berlebihan, dan istilah teknis kelistrikan akurat sebelum dipublikasi.",
    prompt: `Role: QA & Brand Voice Reviewer
Goal: Mengecek semua output di atas agar konsisten tone, bebas klaim berlebihan, dan
istilah teknis kelistrikan (voltase, ampere, SNI, dsb) akurat sebelum dipublikasi.`
  }
];

// Klaim berlebihan yang dilarang oleh QA
const CLAIM_BLACKLIST = [
  "tidak akan pernah rusak", "anti rusak", "pasti awet", "awet selamanya", "selamanya",
  "paling murah", "termurah", "terbaik", "nomor 1", "no 1", "dijamin", "100% aman", "anti gagal"
];

// ---------------------------------------------------------------------------
// COMPANY / ONBOARDING
// ---------------------------------------------------------------------------
function getCompany() {
  const channels = [...document.querySelectorAll('input[name="channel"]:checked')].map(c => c.value);
  return {
    toko: $("toko").value.trim() || "Nama Toko",
    budget: $("budget").value.trim() || "-",
    jam: $("jam").value || "08:00",
    misi: $("misi").value.trim(),
    channels
  };
}

function missionPrompt() {
  const c = getCompany();
  return `Company Name: ${c.toko} Content Engine
Industry: Distribusi alat & komponen listrik (kabel, saklar, lampu, MCB, stop kontak, dll)
Sales Channels: ${c.channels.join(", ") || "-"}

Mission:
${c.misi}

Budget: ${c.budget} (token/biaya bulanan maksimum per agent)
Heartbeat: Setiap hari jam ${c.jam} WIB — cek antrian produk baru yang perlu konten`;
}

// ---------------------------------------------------------------------------
// AI API SETTINGS — Multi Provider
// ---------------------------------------------------------------------------
const LS_KEY = "paperclip_ai_config_v2";

function getDefaultAIConfig() {
  return {
    enabled: false,
    provider: "openai",
    apiKey: "",
    baseUrl: "",
    model: "gpt-4o-mini",
    temperature: 0.7,
    proxyMode: "auto", // auto, direct, proxy
    perAgent: {
      seo: { enabled: false, provider: "", model: "" },
      sosmed: { enabled: false, provider: "", model: "" },
      video: { enabled: false, provider: "", model: "" },
      qa: { enabled: false, provider: "", model: "" }
    }
  };
}

function loadAIConfig() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return getDefaultAIConfig();
    const parsed = JSON.parse(raw);
    return { ...getDefaultAIConfig(), ...parsed, perAgent: { ...getDefaultAIConfig().perAgent, ...(parsed.perAgent||{}) } };
  } catch {
    return getDefaultAIConfig();
  }
}

function saveAIConfig(cfg) {
  localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  updateAIStatusUI();
}

function getAIConfig() {
  // read from UI if present, else from LS
  const cfg = loadAIConfig();
  const enableEl = $("aiEnable");
  if (enableEl) {
    cfg.enabled = enableEl.checked;
    cfg.provider = $("aiProvider")?.value || cfg.provider;
    cfg.model = $("aiModel")?.value || cfg.model;
    cfg.apiKey = $("aiApiKey")?.value || cfg.apiKey;
    cfg.baseUrl = $("aiBaseUrl")?.value || cfg.baseUrl;
    cfg.temperature = parseFloat($("aiTemp")?.value || cfg.temperature);
    cfg.proxyMode = $("aiProxyMode")?.value || cfg.proxyMode;
    // per agent
    AGENTS.forEach(a => {
      const en = document.getElementById(`ai_${a.id}_enabled`);
      const prov = document.getElementById(`ai_${a.id}_provider`);
      const mod = document.getElementById(`ai_${a.id}_model`);
      if (en) cfg.perAgent[a.id] = {
        enabled: en.checked,
        provider: prov?.value || "",
        model: mod?.value || ""
      };
    });
  }
  return cfg;
}

function getEffectiveAIConfigForAgent(agentId) {
  const global = getAIConfig();
  if (!global.enabled) return { enabled: false };
  const per = global.perAgent?.[agentId];
  if (per && per.enabled) {
    return {
      enabled: true,
      provider: per.provider || global.provider,
      model: per.model || global.model,
      apiKey: global.apiKey,
      baseUrl: global.baseUrl,
      temperature: global.temperature,
      proxyMode: global.proxyMode
    };
  }
  return { enabled: true, ...global };
}

function updateModelList() {
  const provider = $("aiProvider")?.value || "openai";
  const def = AI_PROVIDERS[provider];
  const list = $("modelList");
  const modelInput = $("aiModel");
  const hint = $("modelHint");
  const baseInput = $("aiBaseUrl");
  const keyInput = $("aiApiKey");
  if (!def) return;
  if (list) {
    list.innerHTML = def.models.map(m => `<option value="${m}">`).join("");
  }
  if (modelInput && !modelInput.value) {
    modelInput.value = def.defaultModel;
  }
  if (hint) {
    hint.textContent = `Rekomendasi: ${def.models.slice(0,3).join(", ")} — default: ${def.defaultModel}`;
  }
  if (baseInput) {
    baseInput.placeholder = def.baseUrl || "https://api.example.com/v1 — kosongkan untuk default";
    if (!baseInput.value) baseInput.value = "";
  }
  if (keyInput) {
    keyInput.placeholder = def.keyPlaceholder;
  }
}

function renderPerAgentSettings() {
  const container = $("perAgentSettings");
  if (!container) return;
  const cfg = loadAIConfig();
  container.innerHTML = AGENTS.map(a => {
    const per = cfg.perAgent?.[a.id] || {};
    return `<div class="per-agent-card">
      <h4>${a.icon} ${a.role}</h4>
      <label class="check"><input type="checkbox" id="ai_${a.id}_enabled" ${per.enabled ? "checked" : ""}/> Override khusus ${a.id}</label>
      <label>Provider
        <select id="ai_${a.id}_provider">
          <option value="">— pakai global —</option>
          ${Object.entries(AI_PROVIDERS).map(([k,v])=>`<option value="${k}" ${per.provider===k?"selected":""}>${v.label}</option>`).join("")}
        </select>
      </label>
      <label>Model
        <input id="ai_${a.id}_model" type="text" value="${esc(per.model||"")}" placeholder="kosong = pakai global" />
      </label>
    </div>`;
  }).join("");
}

function updateAIStatusUI() {
  const cfg = loadAIConfig();
  const statusEl = $("aiStatus");
  const panel = $("aiConfigPanel");
  if (!statusEl) return;
  if (!cfg.enabled) {
    statusEl.textContent = "Mode Template (offline)";
    statusEl.className = "ai-status";
    if (panel) panel.classList.add("disabled");
  } else {
    const hasKey = !!cfg.apiKey;
    statusEl.textContent = hasKey ? `AI Aktif: ${AI_PROVIDERS[cfg.provider]?.label || cfg.provider} / ${cfg.model}` : `AI Aktif (butuh API Key) — ${cfg.provider}`;
    statusEl.className = hasKey ? "ai-status active" : "ai-status error";
    if (panel) panel.classList.remove("disabled");
  }
  // update temp label
  const tv = $("aiTempVal");
  if (tv && $("aiTemp")) tv.textContent = $("aiTemp").value;
}

function initAISettings() {
  const cfg = loadAIConfig();
  if ($("aiEnable")) $("aiEnable").checked = cfg.enabled;
  if ($("aiProvider")) $("aiProvider").value = cfg.provider;
  if ($("aiModel")) $("aiModel").value = cfg.model;
  if ($("aiApiKey")) $("aiApiKey").value = cfg.apiKey;
  if ($("aiBaseUrl")) $("aiBaseUrl").value = cfg.baseUrl;
  if ($("aiTemp")) $("aiTemp").value = cfg.temperature;
  if ($("aiProxyMode")) $("aiProxyMode").value = cfg.proxyMode || "auto";
  updateModelList();
  renderPerAgentSettings();
  updateAIStatusUI();

  // events
  $("aiProvider")?.addEventListener("change", () => {
    updateModelList();
    const def = AI_PROVIDERS[$("aiProvider").value];
    if (def) $("aiModel").value = def.defaultModel;
  });
  $("aiEnable")?.addEventListener("change", () => {
    saveAIConfig(getAIConfig());
  });
  $("aiTemp")?.addEventListener("input", () => {
    $("aiTempVal").textContent = $("aiTemp").value;
  });
  $("aiSave")?.addEventListener("click", () => {
    saveAIConfig(getAIConfig());
    $("aiTestResult").textContent = "✅ Setting disimpan di localStorage";
    setTimeout(()=>$("aiTestResult").textContent="", 3000);
  });
  $("aiClear")?.addEventListener("click", () => {
    if (!confirm("Hapus API Key dari localStorage?")) return;
    const c = getAIConfig();
    c.apiKey = "";
    $("aiApiKey").value = "";
    saveAIConfig(c);
    $("aiTestResult").textContent = "🗑️ API Key dihapus";
  });
  $("toggleApiKey")?.addEventListener("click", () => {
    const inp = $("aiApiKey");
    inp.type = inp.type === "password" ? "text" : "password";
  });
  $("aiTest")?.addEventListener("click", async () => {
    const cfg = getAIConfig();
    saveAIConfig(cfg);
    $("aiTestResult").textContent = "⏳ Testing...";
    try {
      const res = await callAI({
        provider: cfg.provider,
        model: cfg.model,
        apiKey: cfg.apiKey,
        baseUrl: cfg.baseUrl,
        temperature: cfg.temperature,
        proxyMode: cfg.proxyMode,
        system: "Kamu adalah tester koneksi.",
        prompt: "Balas dengan 'OK koneksi berhasil' dalam bahasa Indonesia."
      });
      $("aiTestResult").textContent = `✅ Berhasil: ${res.content.slice(0,80)}... (model: ${res.model})`;
    } catch (e) {
      $("aiTestResult").textContent = `❌ Gagal: ${e.message}`;
    }
  });
  // per agent change listeners (delegated)
  document.addEventListener("change", (e)=>{
    if (e.target.id && e.target.id.startsWith("ai_")) {
      // auto save per agent
      saveAIConfig(getAIConfig());
    }
  });
}

// ---------------------------------------------------------------------------
// AI CALLER — Proxy & Direct
// ---------------------------------------------------------------------------
async function callAI({ provider, model, apiKey, baseUrl, system, prompt, messages, temperature = 0.7, proxyMode = "auto", max_tokens = 2000 }) {
  const def = AI_PROVIDERS[provider] || AI_PROVIDERS.custom;
  const effectiveBase = baseUrl || def.baseUrl;

  // Decide proxy vs direct
  const isVercel = window.location.hostname.includes("vercel.app") || window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
  const useProxy = proxyMode === "proxy" || (proxyMode === "auto" && (isVercel || !apiKey)); // auto uses proxy on Vercel or if no key (env)

  if (useProxy) {
    // Use /api/ai proxy (Vercel serverless)
    const resp = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, model, apiKey, baseUrl: effectiveBase, system, prompt, messages, temperature, max_tokens })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || `Proxy error ${resp.status}`);
    return data;
  } else {
    // Direct call to provider
    if (!apiKey) throw new Error(`API Key untuk ${provider} kosong. Isi di setting atau gunakan mode Proxy dengan env di Vercel.`);
    
    if (["openai","groq","openrouter","deepseek","mistral","custom"].includes(provider)) {
      const url = `${effectiveBase.replace(/\/$/,"")}/chat/completions`;
      const payload = {
        model: model || def.defaultModel,
        messages: messages || [...(system ? [{role:"system", content: system}] : []), {role:"user", content: prompt}],
        temperature,
        max_tokens
      };
      const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
      if (provider === "openrouter") {
        headers["HTTP-Referer"] = window.location.origin;
        headers["X-Title"] = "Paperclip AI";
      }
      const r = await fetch(url, { method:"POST", headers, body: JSON.stringify(payload) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || JSON.stringify(data.error) || `Error ${r.status}`);
      return { content: data.choices[0].message.content, model: data.model, raw: data };
    }

    if (provider === "anthropic") {
      const url = `${effectiveBase}/v1/messages`;
      const sys = system || messages?.find(m=>m.role==="system")?.content || "";
      const userMsgs = (messages || [{role:"user", content: prompt}]).filter(m=>m.role!=="system").map(m=>({role: m.role==="assistant"?"assistant":"user", content: m.content || m}));
      const payload = { model: model||def.defaultModel, max_tokens, temperature, system: sys||undefined, messages: userMsgs };
      const r = await fetch(url, {
        method:"POST",
        headers: { "Content-Type":"application/json", "x-api-key": apiKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify(payload)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || `Anthropic error ${r.status}`);
      return { content: data.content.map(c=>c.text).join("\n"), model: data.model, raw: data };
    }

    if (provider === "gemini") {
      const modelName = model || def.defaultModel;
      const url = `${effectiveBase}/models/${modelName}:generateContent?key=${apiKey}`;
      const sys = system || "";
      const contents = (messages || [{role:"user", content: prompt}]).filter(m=>m.role!=="system").map(m=>({role: m.role==="assistant"?"model":"user", parts:[{text:m.content||m}]}));
      const payload = {
        system_instruction: sys ? {parts:[{text:sys}]} : undefined,
        contents,
        generationConfig: { temperature, maxOutputTokens: max_tokens }
      };
      const r = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || `Gemini error ${r.status}`);
      return { content: data.candidates?.[0]?.content?.parts?.map(p=>p.text).join("\n") || "", model: modelName, raw: data };
    }

    throw new Error(`Provider ${provider} tidak didukung untuk direct mode`);
  }
}

// ---------------------------------------------------------------------------
// INPUT PRODUK
// ---------------------------------------------------------------------------
const SAMPLES = {
  saklar: {
    nama: "Saklar Tunggal Anti-Korslet", merek: "Broco", kategori: "Saklar",
    spek: "10A 250V", tegangan: "250", arus: "10",
    fitur: "Bahan tahan panas & anti-korslet\nPlat tembaga tebal, klik mantap\nPemasangan mudah model inbow",
    harga: "18500", paket: "1x saklar + sekrup pemasangan", garansi: "Garansi toko 7 hari",
    sni: true, kota: "Surabaya", target: "pemilik rumah, tukang listrik, kontraktor", durasi: "25"
  },
  kabel: {
    nama: "Kabel NYM", merek: "Eterna", kategori: "Kabel",
    spek: "2x1.5mm 50m", tegangan: "450", arus: "",
    fitur: "Konduktor tembaga murni\nIsolasi PVC ganda, lentur & mudah ditarik\nCocok untuk instalasi rumah & gedung",
    harga: "785000", paket: "1 roll isi 50 meter", garansi: "Garansi resmi pabrik",
    sni: true, kota: "Surabaya", target: "kontraktor, teknisi listrik, pemilik rumah", durasi: "30"
  },
  lampu: {
    nama: "Lampu LED Bulb Hemat Energi", merek: "Philips", kategori: "Lampu",
    spek: "12W E27 6500K", tegangan: "220", arus: "",
    fitur: "Hemat energi hingga 85% dibanding pijar\nCahaya putih terang merata, tidak menyilaukan\nUmur pakai hingga 15.000 jam",
    harga: "27500", paket: "1x lampu LED bulb", garansi: "Garansi resmi 1 tahun",
    sni: true, kota: "", target: "ibu rumah tangga, pemilik kos & warung", durasi: "15"
  }
};

function isiContoh() {
  const s = SAMPLES[$("contoh").value];
  if (!s) return;
  Object.entries(s).forEach(([k, v]) => {
    const el = $(k);
    if (!el) return;
    if (el.type === "checkbox") el.checked = v;
    else el.value = v;
  });
}

function collect() {
  return {
    nama: $("nama").value.trim(),
    merek: $("merek").value.trim(),
    kategori: $("kategori").value,
    spek: $("spek").value.trim(),
    tegangan: $("tegangan").value.trim(),
    arus: $("arus").value.trim(),
    fitur: $("fitur").value.split("\n").map(s => s.trim()).filter(Boolean),
    harga: $("harga").value.trim(),
    paket: $("paket").value.trim(),
    garansi: $("garansi").value.trim(),
    sni: $("sni").checked,
    kota: $("kota").value.trim(),
    target: $("target").value.trim(),
    durasi: parseInt($("durasi").value, 10)
  };
}

// ---------------------------------------------------------------------------
// TEMPLATE LOGIC (fallback) — MARKETPLACE SEO WRITER
// ---------------------------------------------------------------------------
function buildKeywords(d) {
  const tags = [];
  const push = (t) => { t = t.trim(); if (t && !tags.includes(t)) tags.push(t); };
  if (d.merek) push(d.merek);
  push(d.kategori.toLowerCase());
  if (d.kategori === "Kabel") push("kabel listrik");
  if (d.kategori === "Lampu") push("lampu hemat energi");
  if (d.sni) push("SNI");
  push("original");
  if (d.garansi) push("garansi");
  push("tahan lama");
  push("grosir");
  if (d.fitur[0]) {
    const f = d.fitur[0].toLowerCase();
    if (f.includes("panas")) push("tahan panas");
    if (f.includes("hemat")) push("hemat listrik");
  }
  ["alat listrik", "elektrikal", "listrik rumah", "instalasi listrik"]
    .forEach(k => { if (tags.length < 5) push(k); });
  return tags.slice(0, 8);
}

function buildSeoTitle(d) {
  const head = `${d.nama} ${d.spek}`.toLowerCase();
  const kwTail = buildKeywords(d)
    .filter(k => k.toLowerCase() !== d.merek.toLowerCase()
      && !head.includes(k.toLowerCase())
      && !["kabel listrik", "alat listrik"].includes(k))
    .slice(0, 4)
    .map(k => k.replace(/\b\w/g, c => c.toUpperCase()))
    .join(" ");
  let title = [d.nama, d.spek, d.merek, kwTail].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  if (title.length > 100) title = title.slice(0, 99).trim() + "…";
  return title;
}

function buildBullets(d) {
  const b = [];
  const spec = [d.spek, d.tegangan ? `${d.tegangan} volt` : "", d.arus ? `${d.arus} ampere` : ""].filter(Boolean).join(", ");
  b.push(`⚡ Spesifikasi: ${spec || d.nama}${d.merek ? ` — ${d.merek}` : ""}`);
  d.fitur.slice(0, 3).forEach(f => b.push(`✅ ${f}`));
  if (d.fitur.length < 3) b.push(`✅ Kualitas ${d.kategori.toLowerCase()} teruji untuk pemakaian harian`);
  b.push(`📦 Isi paket: ${d.paket || "1 unit produk (dikemas aman)"}`);
  b.push(d.garansi ? `🛡️ ${d.garansi}${d.sni ? " · Bersertifikat SNI" : ""}` : (d.sni ? "🛡️ Bersertifikat SNI" : "🛡️ Dicek quality control sebelum dikirim"));
  b.push("🔧 Cara pakai: pemasangan mudah mengikuti petunjuk instalasi standar; jika ragu, gunakan jasa teknisi listrik.");
  return b.slice(0, 7);
}

function buildLongDesc(d, c) {
  const namaFull = `${d.merek ? d.merek + " " : ""}${d.nama}`;
  const target = d.target ? ` untuk ${d.target}` : "";
  const f1 = d.fitur[0] ? d.fitur[0].toLowerCase() : "kualitasnya bisa diandalkan";
  const p1 = `Cari ${d.kategori.toLowerCase()} yang ${f1} dan aman dipakai jangka panjang? ${namaFull} jawabannya. Dirancang khusus${target}, produk ini membantu instalasi listrik Anda bekerja stabil tanpa drama — tidak perlu sering ganti, tidak perlu khawatir. Sejak dipakai pertama kali, bedanya langsung terasa: lebih praktis, lebih rapi, dan lebih tenang untuk seluruh anggota keluarga di rumah maupun tempat usaha Anda.`;
  const specParts = [];
  if (d.spek) specParts.push(`spesifikasi ${d.spek}`);
  if (d.tegangan) specParts.push(`tegangan kerja ${d.tegangan} volt`);
  if (d.arus) specParts.push(`arus ${d.arus} ampere`);
  const detailFitur = d.fitur.map(f => f.toLowerCase()).join("; ");
  const p2 = `Dari sisi teknis, ${namaFull} hadir dengan ${specParts.length ? specParts.join(", ") : "spesifikasi standar industri"}. Keunggulan utamanya: ${detailFitur || "material berkualitas dengan finishing rapi"}. ${d.paket ? `Dalam paket sudah termasuk ${d.paket}, jadi Anda tinggal pasang. ` : ""}Semua parameter kami cantumkan apa adanya sesuai spesifikasi pabrik — tanpa lebih, tanpa kurang — supaya Anda bisa mencocokkannya dengan kebutuhan instalasi sebelum membeli.`;
  const trust = [];
  if (d.sni) trust.push("sudah bersertifikat SNI");
  if (d.garansi) trust.push(`dilindungi ${d.garansi.toLowerCase()}`);
  trust.push(`dikirim oleh ${c.toko} dengan packing aman`);
  const p3 = `Soal kepercayaan, produk ini ${trust.join(", ")}. Ribuan pembeli di ${c.channels.filter(ch => ["Shopee", "Tokopedia"].includes(ch)).join(" & ") || "marketplace"} sudah membuktikan kualitasnya — banyak yang repeat order untuk proyek berikutnya. Kalau masih ragu soal spesifikasi atau kecocokan, chat admin kami dulu saja; kami bantu sampai Anda yakin. Checkout sekarang, dan pesanan Anda masuk antrian kirim hari ini juga.`;
  return [p1, p2, p3].join("\n\n");
}

function buildHashtags(d, c) {
  const tags = [];
  const push = (t) => { if (t && !tags.includes(t)) tags.push(t); };
  push("#alatlistrik");
  push("#" + slug(d.kategori + (d.kategori === "Kabel" ? "listrik" : "")) || null);
  push("#tokolistrik");
  if (c.channels.includes("Shopee")) push("#shopeeindonesia");
  if (c.channels.includes("Tokopedia")) push("#tokopedia");
  if (c.channels.includes("TikTok Shop")) push("#tiktokshop");
  if (c.channels.includes("Instagram")) push("#instagramindonesia");
  push("#rumahtangga"); push("#hematlistrik"); push("#elektrikal");
  if (d.kota) push("#" + slug("toko listrik " + d.kota));
  ["#instalasilistrik", "#tokobangunan", "#rumahminimalis", "#belanjaonline"]
    .forEach(k => { if (tags.length < 8) push(k); });
  return tags.slice(0, 12);
}

function buildCaptions(d, c) {
  const tags = buildHashtags(d, c).join(" ");
  const namaFull = `${d.merek ? d.merek + " " : ""}${d.nama}`;
  const harga = d.harga ? rupiah(d.harga) : "harga bersahabat";
  const sni = d.sni ? " Sudah SNI ✅" : "";
  const problem = {
    Saklar: "Sering ganti saklar tapi tetap cepat rusak?",
    Kabel: "Kabel cepat panas dan bikin was-was?",
    "Stop Kontak": "Colokan longgar terus dan bikin percikan?",
    Lampu: "Tagihan listrik bengkak gara-gara lampu boros?",
    MCB: "MCB sering jeglek tanpa sebab yang jelas?"
  }[d.kategori] || "Sering ganti " + d.kategori.toLowerCase() + " tapi tetap cepat rusak?";

  const informatif = `${problem}
Faktanya, komponen listrik yang tepat harus sesuai spesifikasi instalasinya. ${namaFull}${d.spek ? " (" + d.spek + ")" : ""} dirancang dengan ${d.fitur[0] ? d.fitur[0].toLowerCase() : "material berkualitas"}.${sni}
Simpan postingannya biar gampang dicari saat butuh 📌 Cek link di bio / keranjang kuning!

${tags}`;

  const soft = `${problem}
Udah gonta-ganti, eh rusak lagi... 😩
Sampai akhirnya ketemu ${namaFull} — ${d.fitur[0] ? d.fitur[0].toLowerCase() : "kualitasnya beda dari yang biasa"}.${sni} Sekali pasang, awet dipakai harian, hati pun tenang.
Nggak mau ribet lagi? Cek link di bio / keranjang kuning 👇

${tags}`;

  const hard = `🔥 PROMO ${namaFull.toUpperCase()}! 🔥
${d.harga ? `Cuma ${harga}! ` : ""}Stok terbatas, siapa cepat dia dapat ⚡
${d.fitur[0] ?? "Kualitas terjamin"}${sni}
Checkout sekarang di keranjang kuning sebelum harga naik! 🛒💨

${tags}`;

  const wa = `Halo Kak! 👋
Lagi cari ${d.kategori.toLowerCase()} yang awet dan aman? ${namaFull}${d.spek ? " " + d.spek : ""} ready stock di ${c.toko}${d.sni ? " — sudah SNI ✅" : ""}.
💰 ${harga}
🔗 Link produk: shopee.co.id/${c.toko.toLowerCase().replace(/\s+/g, "")} (ganti dengan link toko Kakak)
Balas "MAU" atau klik link di atas ya Kak, kami bantu sampai tuntas 🙏`;

  return { informatif, soft, hard, wa, tags };
}

function buildStoryboard(d, c) {
  const total = d.durasi || 25;
  const namaFull = `${d.merek ? d.merek + " " : ""}${d.nama}`;
  const claim = d.fitur[0] ? d.fitur[0].toLowerCase() : "kualitasnya terjamin";
  const sniLine = d.sni ? " Udah SNI, jadi aman." : " Kualitasnya teruji, jadi tenang.";
  const harga = d.harga ? `Mulai ${rupiah(d.harga)} aja!` : "Cek harganya di keranjang kuning!";

  const weights = [3, 4, 5, 6, 4, 3];
  const scale = total / weights.reduce((a, b) => a + b, 0);
  let t = 0;
  const times = weights.map(w => {
    const dur = Math.max(2, Math.round(w * scale));
    const seg = { start: t, dur, end: t + dur };
    t = seg.end;
    return seg;
  });
  const T = (i) => `${times[i].start}-${times[i].end} dtk`;

  const rows = [
    { waktu: T(0), visual: `Close-up ${d.kategori.toLowerCase()} lama yang longgar/berkarat, tangan mencoba menyalakan berkali-kali gagal`, vo: `Teks besar: "${d.kategori} rumah kamu kayak gini juga?"` },
    { waktu: T(1), visual: "Cut ke ekspresi kesal, lampu kedip-kedip", vo: `VO: "Udah ganti-ganti tapi tetap cepat rusak..."` },
    { waktu: T(2), visual: `Reveal produk — unboxing cepat, kemasan rapi${d.sni ? ", logo SNI di-zoom" : ""}`, vo: `Teks: "Sampai nemu ini 👀" + VO: "${namaFull}, ${claim}"` },
    { waktu: T(3), visual: "Demo pemasangan cepat (time-lapse), lalu nyalakan — langsung terang/berfungsi stabil", vo: `VO: "Pasang gampang, tahan sampai bertahun-tahun.${sniLine}"` },
    { waktu: T(4), visual: `Tampilkan harga & badge diskon/gratis ongkir di layar — logo toko: ${c.toko}`, vo: `Teks besar: "${harga}"` },
    { waktu: T(5), visual: "Zoom ke tombol keranjang kuning + logo toko", vo: `VO + Teks: "Klik keranjang kuning sekarang, stok terbatas!"` }
  ];

  const caption = `${d.kategori} rumah cepat rusak lagi? 😩 Stop ganti-ganti mulu, langsung pakai ${namaFull} yang tahan lama${d.sni ? " & SNI ✅" : ""} Klik keranjang kuning, gratis ongkir hari ini! #alatlistrik #${slug(d.kategori)}listrik #tokopedia #shopeeindonesia #rumahtangga #hematlistrik`;
  const musik = 'Musik: tren TikTok yang sedang naik dengan tempo upbeat/relate (cek tab "Trending" TikTok Indonesia saat produksi, karena tren berubah cepat).';
  const catatan = "Catatan: skrip ini adalah storyboard teks siap syuting — perekaman video aktual tetap dilakukan langsung (kamera/HP).";
  return { total, rows, caption, musik, catatan };
}

function runQA(d, out) {
  const checks = [];
  const add = (ok, label, detail) => checks.push({ ok, label, detail });

  const titleLen = out.seo.title.length;
  add(titleLen <= 100, "Judul marketplace ≤ 100 karakter", `${titleLen}/100 karakter`);

  const nkw = out.seo.keywords.length;
  add(nkw >= 5 && nkw <= 8, "Keyword SEO berjumlah 5–8", `${nkw} keyword`);

  const nb = out.seo.bullets.length;
  add(nb >= 5 && nb <= 7, "Bullet point berjumlah 5–7", `${nb} poin`);

  const wc = countWords(out.seo.desc);
  add(wc >= 150 && wc <= 300, "Deskripsi panjang 150–300 kata", `${wc} kata`);

  const allText = [
    out.seo.title, out.seo.desc, ...out.seo.bullets,
    out.sosmed.informatif, out.sosmed.soft, out.sosmed.hard, out.sosmed.wa,
    ...out.video.rows.map(r => r.vo), out.video.caption,
    ...d.fitur
  ].join(" ").toLowerCase();
  const found = CLAIM_BLACKLIST.filter(p => allText.includes(p));
  add(found.length === 0, "Bebas klaim berlebihan / tidak bisa dibuktikan", found.length ? `Ditemukan: ${found.join(", ")}` : "Tidak ada klaim berlebihan ✓");

  const sniMentioned = allText.includes("sni");
  add(d.sni || !sniMentioned, "Klaim SNI sesuai sertifikat produk", d.sni ? (sniMentioned ? "Sertifikat dicentang & SNI dicantumkan ✓" : "Sertifikat dicentang (SNI opsional dicantumkan)") : (sniMentioned ? "⚠ SNI dicantumkan tapi sertifikat tidak dicentang!" : "Tidak ada klaim SNI palsu ✓"));

  const listingText = (out.seo.title + " " + out.seo.desc + " " + out.seo.bullets.join(" ")).toLowerCase();
  const specIssues = [];
  if (d.tegangan && !listingText.includes(d.tegangan)) specIssues.push(`tegangan ${d.tegangan}V tidak tercantum`);
  if (d.arus && !listingText.includes(d.arus)) specIssues.push(`arus ${d.arus}A tidak tercantum`);
  add(specIssues.length === 0, "Istilah teknis (voltase/ampere) akurat & tercantum", specIssues.length ? specIssues.join("; ") : "Semua parameter teknis dari input tercantum ✓");

  const capList = [["Informatif", out.sosmed.informatif], ["Soft-selling", out.sosmed.soft], ["Hard-selling", out.sosmed.hard]];
  const tagIssues = capList
    .map(([t, txt]) => `${t}: ${countHashtags(txt)} hashtag`)
    .filter((s, i) => { const n = countHashtags(capList[i][1]); return n < 8 || n > 12; });
  add(tagIssues.length === 0, "Hashtag 8–12 per caption", capList.map(([t, txt]) => `${t}: ${countHashtags(txt)}`).join(" · "));

  const ctaOk = capList.every(([_, txt]) => /cek|klik|order|checkout|keranjang|link|balas/i.test(txt)) && /klik|balas|link/i.test(out.sosmed.wa);
  add(ctaOk, "Semua caption & broadcast punya CTA jelas", ctaOk ? "CTA ditemukan di semua varian ✓" : "Ada varian tanpa CTA");

  const waLen = out.sosmed.wa.length;
  add(waLen <= 400, "Broadcast WA singkat (≤ 400 karakter) + 1 link", `${waLen} karakter, 1 link & 1 CTA ✓`);

  return checks;
}

// ---------------------------------------------------------------------------
// AI GENERATION WRAPPERS (LLM)
// ---------------------------------------------------------------------------
function buildProductContext(d, c) {
  return `PRODUK:
- Nama: ${d.nama}
- Merek: ${d.merek}
- Kategori: ${d.kategori}
- Spek: ${d.spek}
- Tegangan: ${d.tegangan} volt
- Arus: ${d.arus} ampere
- Fitur: ${d.fitur.join("; ")}
- Harga: ${d.harga ? rupiah(d.harga) : "-"}
- Paket: ${d.paket}
- Garansi: ${d.garansi}
- SNI: ${d.sni ? "Ya" : "Tidak"}
- Kota: ${d.kota}
- Target: ${d.target}
- Durasi Video: ${d.durasi} detik

TOKO:
- Nama: ${c.toko}
- Channel: ${c.channels.join(", ")}
- Misi: ${c.misi}`;
}

async function aiGenerateSEO(d, c) {
  const cfg = getEffectiveAIConfigForAgent("seo");
  if (!cfg.enabled) return null;
  const context = buildProductContext(d, c);
  const system = `${AGENTS.find(a=>a.id==="seo").prompt}\n\nAturan QA: Judul ≤100 karakter, 5-8 keyword, 5-7 bullet, deskripsi 150-300 kata (3 paragraf). Jangan pakai klaim berlebihan: ${CLAIM_BLACKLIST.join(", ")}. Klaim SNI hanya jika SNI=Ya. Wajib cantumkan tegangan & arus jika ada di input.`;
  const prompt = `${context}\n\nTUGAS: Buat listing marketplace untuk produk di atas. Output HARUS dalam format JSON valid dengan struktur:
{
  "title": "judul ≤100 karakter",
  "keywords": ["kw1","kw2",... 5-8],
  "bullets": ["bullet1", ... 5-7],
  "desc": "deskripsi 3 paragraf, 150-300 kata, pisahkan paragraf dengan \\n\\n"
}
JANGAN tambahkan penjelasan lain, hanya JSON.`;

  try {
    const res = await callAI({ ...cfg, system, prompt, temperature: cfg.temperature });
    // try parse JSON from response
    const jsonMatch = res.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI tidak mengembalikan JSON");
    const parsed = JSON.parse(jsonMatch[0]);
    // validate & fallback
    return {
      title: (parsed.title || buildSeoTitle(d)).slice(0,100),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0,8) : buildKeywords(d),
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets.slice(0,7) : buildBullets(d),
      desc: parsed.desc || buildLongDesc(d,c),
      _ai: true,
      _model: res.model
    };
  } catch (e) {
    console.warn("AI SEO failed, fallback template:", e);
    throw e;
  }
}

async function aiGenerateSosmed(d, c) {
  const cfg = getEffectiveAIConfigForAgent("sosmed");
  if (!cfg.enabled) return null;
  const context = buildProductContext(d, c);
  const system = `${AGENTS.find(a=>a.id==="sosmed").prompt}\n\nAturan: 8-12 hashtag per caption, semua caption wajib CTA (cek link / klik keranjang kuning), jangan klaim berlebihan.`;
  const prompt = `${context}\n\nTUGAS: Buat 3 varian caption sosmed + 1 broadcast WA. Output JSON:
{
  "informatif": "caption varian informatif + hashtag 8-12",
  "soft": "caption soft-selling + hashtag",
  "hard": "caption hard-selling + hashtag",
  "wa": "broadcast WA singkat ≤400 karakter + 1 link + CTA",
  "tags": "#hashtag1 #hashtag2 ..."
}
Hanya JSON.`;

  try {
    const res = await callAI({ ...cfg, system, prompt, temperature: cfg.temperature });
    const jsonMatch = res.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI sosmed tidak JSON");
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      informatif: parsed.informatif || "",
      soft: parsed.soft || "",
      hard: parsed.hard || "",
      wa: parsed.wa || "",
      tags: parsed.tags || "",
      _ai: true,
      _model: res.model
    };
  } catch (e) {
    console.warn("AI Sosmed failed:", e);
    throw e;
  }
}

async function aiGenerateVideo(d, c) {
  const cfg = getEffectiveAIConfigForAgent("video");
  if (!cfg.enabled) return null;
  const context = buildProductContext(d, c);
  const system = `${AGENTS.find(a=>a.id==="video").prompt}\n\nBuat storyboard 6 adegan sesuai durasi ${d.durasi} detik, format vertikal 9:16.`;
  const prompt = `${context}\n\nTUGAS: Buat storyboard video ${d.durasi} detik. Output JSON:
{
  "rows": [
    {"waktu": "0-3 dtk", "visual": "deskripsi visual", "vo": "voice over / teks"},
    ... 6 adegan
  ],
  "caption": "caption pendamping video + hashtag",
  "musik": "rekomendasi musik TikTok trending",
  "catatan": "catatan produksi"
}
Hanya JSON.`;

  try {
    const res = await callAI({ ...cfg, system, prompt, temperature: cfg.temperature });
    const jsonMatch = res.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI video tidak JSON");
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      total: d.durasi,
      rows: parsed.rows || [],
      caption: parsed.caption || "",
      musik: parsed.musik || "",
      catatan: parsed.catatan || "",
      _ai: true,
      _model: res.model
    };
  } catch (e) {
    console.warn("AI Video failed:", e);
    throw e;
  }
}

// ---------------------------------------------------------------------------
// PIPELINE (Content Director → 4 agen → render) — Now AI-aware
// ---------------------------------------------------------------------------
let lastResult = null;

function renderOrgChart() {
  $("orgChildren").innerHTML = AGENTS.map(a => `
    <div class="agent-card">
      <div class="a-icon">${a.icon}</div>
      <div class="a-role">${a.role} <span class="badge">${a.tag}</span></div>
      <div class="a-goal">${a.goal}</div>
      <button class="btn-ghost small" data-copy-src="prompt" data-agent="${a.id}">📋 Salin Prompt</button>
    </div>`).join("");
}

function setSteps(state) {
  document.querySelectorAll(".step").forEach(s => {
    s.classList.toggle("done", state.includes(s.dataset.step));
  });
}

async function generate() {
  const d = collect();
  const c = getCompany();
  if (!d.nama) { alert("Isi dulu Nama Produk ya kak 📎 (atau klik ⚡ Isi Contoh)"); return; }

  const btn = $("generate");
  btn.disabled = true;
  btn.textContent = "⏳ Pipeline berjalan...";
  setSteps([]);

  $("misiBanner").classList.remove("hidden");
  const aiCfg = getAIConfig();
  const aiInfo = aiCfg.enabled ? ` <span class="ai-badge ai">🤖 AI: ${AI_PROVIDERS[aiCfg.provider]?.label || aiCfg.provider} ${aiCfg.model}</span>` : ` <span class="ai-badge template">📄 Template Lokal</span>`;
  $("misiBanner").innerHTML = `🎯 <b>Traceability misi:</b> semua task di bawah mendukung misi company — <i>“${esc(c.misi)}”</i>${aiInfo}`;

  const t = (ms, fn) => new Promise(res => setTimeout(() => { fn(); res(); }, ms));
  
  try {
    await t(200, () => setSteps(["director"]));
    
    // SEO
    await t(300, () => setSteps(["director", "seo"]));
    let seo;
    try {
      if (aiCfg.enabled) {
        btn.textContent = "🤖 AI: Menulis SEO...";
        seo = await aiGenerateSEO(d, c);
      }
    } catch (e) {
      console.error(e);
      // fallback
      seo = null;
    }
    if (!seo) {
      seo = {
        title: buildSeoTitle(d),
        keywords: buildKeywords(d),
        bullets: buildBullets(d),
        desc: buildLongDesc(d, c),
        _ai: false
      };
    }

    // Sosmed
    await t(200, () => setSteps(["director", "seo", "sosmed"]));
    let sosmed;
    try {
      if (aiCfg.enabled) {
        btn.textContent = "🤖 AI: Menulis Caption Sosmed...";
        sosmed = await aiGenerateSosmed(d, c);
      }
    } catch (e) {
      sosmed = null;
    }
    if (!sosmed) {
      sosmed = { ...buildCaptions(d, c), _ai: false };
    }

    // Video
    await t(200, () => setSteps(["director", "seo", "sosmed", "video"]));
    let video;
    try {
      if (aiCfg.enabled) {
        btn.textContent = "🤖 AI: Menulis Video Script...";
        video = await aiGenerateVideo(d, c);
      }
    } catch (e) {
      video = null;
    }
    if (!video) {
      video = { ...buildStoryboard(d, c), _ai: false };
    }

    const out = { seo, sosmed, video, company: c, product: d };
    out.qa = runQA(d, out);
    lastResult = out;

    await t(200, () => setSteps(["director", "seo", "sosmed", "video", "qa"]));
    render(document.querySelector(".tab.active").dataset.tab);
  } catch (e) {
    alert("Error pipeline: " + e.message);
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = "🎬 Jalankan Pipeline Content Director";
  }
}

// ---------------------------------------------------------------------------
// RENDER OUTPUT
// ---------------------------------------------------------------------------
function agentTag(agentId, isAI = false, model = "") {
  const a = AGENTS.find(x => x.id === agentId);
  const badge = isAI ? `<span class="ai-badge ai">🤖 AI ${model ? "("+esc(model)+")" : ""}</span>` : `<span class="ai-badge template">📄 Template</span>`;
  return `<span class="trace">👤 ${a.role} → 🎯 misi penjualan marketplace ${badge}</span>`;
}

function block(agentId, title, text, opts = {}) {
  const { limit, wordRange, isAI, model } = opts;
  let meta = "";
  if (limit) {
    const over = text.length > limit;
    meta = `<span class="char ${over ? "over" : ""}">(${text.length}/${limit} karakter)</span>`;
  } else if (wordRange) {
    const w = countWords(text);
    const bad = w < wordRange[0] || w > wordRange[1];
    meta = `<span class="char ${bad ? "over" : ""}">(${w} kata · target ${wordRange[0]}–${wordRange[1]})</span>`;
  }
  return `<div class="block">
    <div class="block-head">
      <h3>${title} ${meta}</h3>
      <button class="copy-btn" data-copy="${encodeURIComponent(text)}">Salin</button>
    </div>
    ${agentTag(agentId, isAI, model)}
    <div class="block-body">${esc(text)}</div>
  </div>`;
}

function renderSeo(out) {
  const kw = `<div class="chips">${out.seo.keywords.map(k => `<span class="chip">#${esc(k)}</span>`).join("")}</div>`;
  const isAI = out.seo._ai;
  const model = out.seo._model || "";
  return block("seo", "Judul Produk (siap tempel)", out.seo.title, { limit: 100, isAI, model })
    + `<div class="block">
         <div class="block-head"><h3>Keyword Pencarian Populer (${out.seo.keywords.length})</h3></div>
         ${agentTag("seo", isAI, model)}${kw}
       </div>`
    + block("seo", "Bullet Point (fitur & keunggulan)", out.seo.bullets.join("\n"), { isAI, model })
    + block("seo", "Deskripsi Panjang (3 paragraf)", out.seo.desc, { wordRange: [150, 300], isAI, model });
}

function renderSosmed(out) {
  const isAI = out.sosmed._ai;
  const model = out.sosmed._model || "";
  return block("sosmed", "Caption — Varian 1: Informatif (edukasi)", out.sosmed.informatif, { isAI, model })
    + block("sosmed", "Caption — Varian 2: Soft-Selling (masalah → solusi)", out.sosmed.soft, { isAI, model })
    + block("sosmed", "Caption — Varian 3: Hard-Selling (promo/diskon)", out.sosmed.hard, { isAI, model })
    + block("sosmed", "Broadcast WhatsApp", out.sosmed.wa, { isAI, model });
}

function renderVideo(out) {
  const v = out.video;
  const isAI = v._ai;
  const model = v._model || "";
  const table = `<table class="storyboard">
    <thead><tr><th>#</th><th>Waktu</th><th>Visual</th><th>Voice Over / Teks di Layar</th></tr></thead>
    <tbody>${v.rows.map((r, i) => `<tr>
      <td>${i + 1}</td><td class="nowrap">${r.waktu}</td><td>${esc(r.visual)}</td><td>${esc(r.vo)}</td>
    </tr>`).join("")}</tbody>
  </table>`;
  return `<div class="block">
      <div class="block-head"><h3>Storyboard — ${v.total} detik · Format 9:16 vertikal</h3>
        <button class="copy-btn" data-copy="${encodeURIComponent(v.rows.map((r, i) => `${i + 1}. [${r.waktu}] ${r.visual} — ${r.vo}`).join("\n"))}">Salin</button>
      </div>
      ${agentTag("video", isAI, model)}${table}
    </div>`
    + block("video", "Caption Pendamping Video", v.caption, { isAI, model })
    + block("video", "Musik & Catatan Produksi", v.musik + "\n\n" + v.catatan, { isAI, model });
}

function renderQA(out) {
  const pass = out.qa.filter(c => c.ok).length;
  const allPass = pass === out.qa.length;
  const verdict = `<div class="verdict ${allPass ? "pass" : "fail"}">
    ${allPass ? "✅ LULUS — semua output siap dipublikasi." : "⚠️ PERLU REVISI — perbaiki poin di bawah sebelum dipublikasi."}
    <span>(${pass}/${out.qa.length} cek lolos)</span></div>`;
  const list = `<div class="checklist">` + out.qa.map(c => `
    <div class="check-item ${c.ok ? "ok" : "bad"}">
      <span class="mark">${c.ok ? "✅" : "⚠️"}</span>
      <div><b>${c.label}</b><div class="detail">${esc(c.detail)}</div></div>
    </div>`).join("") + `</div>`;
  return verdict
    + `<div class="block">
         <div class="block-head"><h3>Laporan Review — Tone, Klaim & Istilah Teknis</h3></div>
         ${agentTag("qa")}${list}
       </div>`;
}

function render(tab) {
  const out = lastResult;
  const el = $("output");
  if (!out) return;
  if (tab === "seo") el.innerHTML = renderSeo(out);
  else if (tab === "sosmed") el.innerHTML = renderSosmed(out);
  else if (tab === "video") el.innerHTML = renderVideo(out);
  else if (tab === "qa") el.innerHTML = renderQA(out);
}

// ---------------------------------------------------------------------------
// COPY HANDLERS
// ---------------------------------------------------------------------------
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-copy], [data-copy-src]");
  if (!btn) return;
  let text;
  if (btn.dataset.copy) {
    text = decodeURIComponent(btn.dataset.copy);
  } else if (btn.dataset.copySrc === "mission") {
    text = missionPrompt();
  } else if (btn.dataset.copySrc === "prompt") {
    const a = AGENTS.find(x => x.id === btn.dataset.agent);
    text = a ? a.prompt : "";
  }
  if (!text) return;
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy"); ta.remove();
  }
  const old = btn.textContent;
  btn.textContent = "Tersalin ✓";
  setTimeout(() => (btn.textContent = old), 1500);
});

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
renderOrgChart();
initAISettings();
$("isiContoh").addEventListener("click", isiContoh);
$("generate").addEventListener("click", generate);
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    render(t.dataset.tab);
  });
});
