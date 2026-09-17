# 📎 Paperclip AI — Content Creator Edition

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irvanlaksana/paperclip-&project-name=paperclip-content-creator&repository-name=paperclip-content-creator)

**Otomatis deploy di Vercel — zero config, 100% static.**

**Content engine untuk bisnis distribusi alat listrik** — Marketplace + Social Media.
Memproduksi listing marketplace, caption sosmed, dan skrip video pendek yang konsisten,
SEO-friendly, dan akurat secara teknis untuk Shopee, Tokopedia, Instagram, TikTok Shop & WhatsApp.

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

Setiap task yang dibuat agen **bisa ditelusuri ke misi company** — jadi saat Social Media
Copywriter membuat caption, ia "tahu" itu untuk mendukung goal penjualan marketplace,
bukan sekadar posting acak.

## Cara kerja
1. **Onboarding** — isi nama toko, sales channels, misi company, budget & heartbeat (08:00 WIB).
   Salin *Prompt Company Mission* untuk onboarding di Paperclip.
2. **Org Chart** — salin prompt tiap agen (siap tempel).
3. **Bahan produk** — isi spesifikasi produk listrik (atau klik ⚡ Isi Contoh: saklar / kabel NYM / lampu LED).
4. **Jalankan pipeline** — Content Director menugaskan 4 agen secara berurutan:
   - **Marketplace SEO**: judul format `[Merek/Jenis] + [Fungsi] + [Ukuran/Spesifikasi] + [Kata kunci]`,
     keyword, bullet point, deskripsi 3 paragraf — siap tempel ke kolom marketplace.
   - **Sosmed**: 3 varian caption (informatif / soft-selling / hard-selling) + broadcast WA.
   - **Video**: storyboard teks siap syuting (waktu, visual, voice over/teks) + caption + catatan musik.
   - **QA Review**: laporan otomatis (batas karakter, jumlah keyword/bullet/kata/hashtag,
     larangan klaim berlebihan, klaim SNI harus sesuai sertifikat, parameter teknis tercantum).
5. Klik **Salin**, tempel ke toko / sosmed kamu. Beres. ⚡

## Aturan QA (dijalankan otomatis)
- Judul ≤ 100 karakter · 5–8 keyword · 5–7 bullet · deskripsi 150–300 kata
- 8–12 hashtag per caption · semua caption wajib punya CTA
- Bebas klaim tak bisa dibuktikan ("tidak akan pernah rusak", "paling murah", dll)
- Klaim **SNI** hanya boleh jika produk memang dicentang bersertifikat
- Tegangan (volt) & arus (ampere) dari input harus tercantum di listing

## 🤖 Setting AI API — Multi Provider (BARU)

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
- File `api/ai.js` otomatis jadi serverless function di Vercel
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

**Flow:**
```
User Input → Content Director → [SEO Writer (AI/Template)] → [Sosmed (AI/Template)] → [Video (AI/Template)] → QA → Output
```

## 🚀 Deploy ke Vercel (Otomatis)

Proyek ini sudah dikonfigurasi **zero-config** untuk Vercel:

- `vercel.json` — set `framework: null` (static), `cleanUrls`, rewrite SPA-safe, dan security headers
- `package.json` — ada script `dev`/`start` pakai `serve` + engine Node >=18
- 100% client-side, tanpa build step, tanpa env variable

### 3 Cara Deploy Otomatis:

**1. One-Click Deploy (paling cepat):**
Klik tombol di atas: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/irvanlaksana/paperclip-&project-name=paperclip-content-creator&repository-name=paperclip-content-creator)

**2. Import dari GitHub Dashboard:**
- Buka https://vercel.com/new
- Import repo `irvanlaksana/paperclip-`
- Framework Preset akan terdeteksi `Other` (static) otomatis karena `vercel.json`
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
npx serve . -l 3000 -s
# atau
npm run dev
```

## Cara menjalankan (lokal tanpa Vercel)
Tanpa install apa pun — cukup buka file `index.html` di browser,
atau jalankan server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Struktur
- `index.html` — onboarding company, org chart, **setting AI multi-provider**, form bahan, hasil 4 agen
- `styles.css` — tampilan + style untuk AI settings
- `app.js` — mesin pipeline konten (template + AI API multi-provider)
- `api/ai.js` — Vercel serverless proxy untuk 8 provider AI (anti-CORS, pakai env)
- `api/health.js` — cek status env API keys
- `vercel.json` — konfigurasi deploy Vercel (static + serverless, cleanUrls, headers)
- `package.json` — metadata + script dev/start untuk Vercel
- `.vercelignore` — file yang diabaikan saat deploy
- `.env.example` — contoh env vars untuk Vercel
