# 📎 Paperclip AI — Content Creator Edition

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

## Cara menjalankan
Tanpa install apa pun — cukup buka file `index.html` di browser,
atau jalankan server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Struktur
- `index.html` — onboarding company, org chart, form bahan, hasil 4 agen
- `styles.css` — tampilan
- `app.js` — mesin pipeline konten (100% client-side, tanpa backend)
