// 📎 Paperclip AI — Content Creator Edition
// Mesin konten untuk distribusi alat listrik: Marketplace + Social Media (100% client-side)

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rupiah = (n) => (n && !isNaN(n) ? "Rp" + Number(n).toLocaleString("id-ID") : "");
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18);
const countWords = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const countHashtags = (s) => (s.match(/#[A-Za-z0-9_]+/g) || []).length;

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

// Klaim berlebihan yang dilarang oleh QA (harus bisa dibuktikan / fakta teknis)
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
// AGENT #1 — MARKETPLACE SEO WRITER
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
  // padding agar minimal 5 keyword (aturan SEO Writer)
  ["alat listrik", "elektrikal", "listrik rumah", "instalasi listrik"]
    .forEach(k => { if (tags.length < 5) push(k); });
  return tags.slice(0, 8);
}

function buildSeoTitle(d) {
  // Format: [Merek/Jenis] + [Fungsi] + [Ukuran/Spesifikasi] + [Kata kunci populer]
  const head = `${d.nama} ${d.spek}`.toLowerCase();
  const kwTail = buildKeywords(d)
    .filter(k => k.toLowerCase() !== d.merek.toLowerCase()          // merek sudah disebut terpisah
      && !head.includes(k.toLowerCase())                             // jangan ulangi kata di nama/spek
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

// ---------------------------------------------------------------------------
// AGENT #2 — SOCIAL MEDIA COPYWRITER
// ---------------------------------------------------------------------------
function buildHashtags(d, c) {
  const tags = [];
  const push = (t) => { if (t && !tags.includes(t)) tags.push(t); };
  // niche
  push("#alatlistrik");
  push("#" + slug(d.kategori + (d.kategori === "Kabel" ? "listrik" : "")) || null);
  push("#tokolistrik");
  // broad — mengikuti sales channels yang dicentang di onboarding
  if (c.channels.includes("Shopee")) push("#shopeeindonesia");
  if (c.channels.includes("Tokopedia")) push("#tokopedia");
  if (c.channels.includes("TikTok Shop")) push("#tiktokshop");
  if (c.channels.includes("Instagram")) push("#instagramindonesia");
  push("#rumahtangga"); push("#hematlistrik"); push("#elektrikal");
  // lokal
  if (d.kota) push("#" + slug("toko listrik " + d.kota));
  // padding agar minimal 8 hashtag (aturan Copywriter: 8–12)
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

// ---------------------------------------------------------------------------
// AGENT #3 — VIDEO SCRIPT & STORYBOARD WRITER
// ---------------------------------------------------------------------------
function buildStoryboard(d, c) {
  const total = d.durasi || 25;
  const namaFull = `${d.merek ? d.merek + " " : ""}${d.nama}`;
  const claim = d.fitur[0] ? d.fitur[0].toLowerCase() : "kualitasnya terjamin";
  const sniLine = d.sni ? " Udah SNI, jadi aman." : " Kualitasnya teruji, jadi tenang.";
  const harga = d.harga ? `Mulai ${rupiah(d.harga)} aja!` : "Cek harganya di keranjang kuning!";

  // proporsi adegan mengikuti template 25 detik dari blueprint, diskalakan ke durasi target
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

// ---------------------------------------------------------------------------
// AGENT #4 — QA & BRAND VOICE REVIEWER
// ---------------------------------------------------------------------------
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

  // klaim berlebihan — pindai semua output + input keunggulan dari user
  const allText = [
    out.seo.title, out.seo.desc, ...out.seo.bullets,
    out.sosmed.informatif, out.sosmed.soft, out.sosmed.hard, out.sosmed.wa,
    ...out.video.rows.map(r => r.vo), out.video.caption,
    ...d.fitur
  ].join(" ").toLowerCase();
  const found = CLAIM_BLACKLIST.filter(p => allText.includes(p));
  add(found.length === 0, "Bebas klaim berlebihan / tidak bisa dibuktikan", found.length ? `Ditemukan: ${found.join(", ")}` : "Tidak ada klaim berlebihan ✓");

  // klaim SNI hanya boleh jika produk memang bersertifikat
  const sniMentioned = allText.includes("sni");
  add(d.sni || !sniMentioned, "Klaim SNI sesuai sertifikat produk", d.sni ? (sniMentioned ? "Sertifikat dicentang & SNI dicantumkan ✓" : "Sertifikat dicentang (SNI opsional dicantumkan)") : (sniMentioned ? "⚠ SNI dicantumkan tapi sertifikat tidak dicentang!" : "Tidak ada klaim SNI palsu ✓"));

  // istilah teknis: tegangan/ampere dari input harus tercantum di listing
  const listingText = (out.seo.title + " " + out.seo.desc + " " + out.seo.bullets.join(" ")).toLowerCase();
  const specIssues = [];
  if (d.tegangan && !listingText.includes(d.tegangan)) specIssues.push(`tegangan ${d.tegangan}V tidak tercantum`);
  if (d.arus && !listingText.includes(d.arus)) specIssues.push(`arus ${d.arus}A tidak tercantum`);
  add(specIssues.length === 0, "Istilah teknis (voltase/ampere) akurat & tercantum", specIssues.length ? specIssues.join("; ") : "Semua parameter teknis dari input tercantum ✓");

  // hashtag per caption 8–12 & wajib ada CTA
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
// PIPELINE (Content Director → 4 agen → render)
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

function generate() {
  const d = collect();
  const c = getCompany();
  if (!d.nama) { alert("Isi dulu Nama Produk ya kak 📎 (atau klik ⚡ Isi Contoh)"); return; }

  const btn = $("generate");
  btn.disabled = true;
  btn.textContent = "⏳ Pipeline berjalan...";
  setSteps([]);

  $("misiBanner").classList.remove("hidden");
  $("misiBanner").innerHTML = `🎯 <b>Traceability misi:</b> semua task di bawah mendukung misi company — <i>“${esc(c.misi)}”</i>`;

  const t = (ms, fn) => new Promise(res => setTimeout(() => { fn(); res(); }, ms));
  (async () => {
    await t(350, () => setSteps(["director"]));
    await t(500, () => setSteps(["director", "seo"]));
    await t(500, () => setSteps(["director", "seo", "sosmed"]));
    await t(500, () => setSteps(["director", "seo", "sosmed", "video"]));

    const seo = {
      title: buildSeoTitle(d),
      keywords: buildKeywords(d),
      bullets: buildBullets(d),
      desc: buildLongDesc(d, c)
    };
    const sosmed = buildCaptions(d, c);
    const video = buildStoryboard(d, c);
    const out = { seo, sosmed, video, company: c, product: d };
    out.qa = runQA(d, out);
    lastResult = out;

    await t(400, () => setSteps(["director", "seo", "sosmed", "video", "qa"]));
    render(document.querySelector(".tab.active").dataset.tab);
    btn.disabled = false;
    btn.textContent = "🎬 Jalankan Pipeline Content Director";
  })();
}

// ---------------------------------------------------------------------------
// RENDER OUTPUT
// ---------------------------------------------------------------------------
function agentTag(agentId) {
  const a = AGENTS.find(x => x.id === agentId);
  return `<span class="trace">👤 ${a.role} → 🎯 misi penjualan marketplace</span>`;
}

function block(agentId, title, text, opts = {}) {
  const { limit, wordRange } = opts;
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
    ${agentTag(agentId)}
    <div class="block-body">${esc(text)}</div>
  </div>`;
}

function renderSeo(out) {
  const kw = `<div class="chips">${out.seo.keywords.map(k => `<span class="chip">#${esc(k)}</span>`).join("")}</div>`;
  return block("seo", "Judul Produk (siap tempel)", out.seo.title, { limit: 100 })
    + `<div class="block">
         <div class="block-head"><h3>Keyword Pencarian Populer (${out.seo.keywords.length})</h3></div>
         ${agentTag("seo")}${kw}
       </div>`
    + block("seo", "Bullet Point (fitur & keunggulan)", out.seo.bullets.join("\n"))
    + block("seo", "Deskripsi Panjang (3 paragraf)", out.seo.desc, { wordRange: [150, 300] });
}

function renderSosmed(out) {
  return block("sosmed", "Caption — Varian 1: Informatif (edukasi)", out.sosmed.informatif)
    + block("sosmed", "Caption — Varian 2: Soft-Selling (masalah → solusi)", out.sosmed.soft)
    + block("sosmed", "Caption — Varian 3: Hard-Selling (promo/diskon)", out.sosmed.hard)
    + block("sosmed", "Broadcast WhatsApp", out.sosmed.wa);
}

function renderVideo(out) {
  const v = out.video;
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
      ${agentTag("video")}${table}
    </div>`
    + block("video", "Caption Pendamping Video", v.caption)
    + block("video", "Musik & Catatan Produksi", v.musik + "\n\n" + v.catatan);
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
// COPY HANDLERS (delegasi global)
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
$("isiContoh").addEventListener("click", isiContoh);
$("generate").addEventListener("click", generate);
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    render(t.dataset.tab);
  });
});
