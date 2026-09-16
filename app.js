// 📎 Paperclip — mesin produksi konten marketplace (100% client-side)
const LIMITS = { shopee: 255, tokopedia: 70, tiktok: 255, lazada: 255 };

const TONE_OPEN = {
  santai: "Halo kak! Kenalin nih",
  premium: "Persembahan eksklusif untuk Anda:",
  promo: "🔥 PROMO SPESIAL! Jangan sampai kehabisan:"
};

const TONE_CLOSE = {
  santai: "Yuk langsung checkout sebelum kehabisan, kak! 🙏",
  premium: "Stok terbatas. Amankan milik Anda sekarang.",
  promo: "⚡ ORDER SEKARANG sebelum harga naik! Klik Beli / + Keranjang!"
};

let lastResult = null;

function rupiah(n) {
  if (!n || isNaN(n)) return "";
  return "Rp" + Number(n).toLocaleString("id-ID");
}

function hashtags(nama, kategori) {
  const words = (nama + " " + kategori).toLowerCase()
    .replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  const uniq = [...new Set(words)].slice(0, 6);
  const tags = uniq.map(w => "#" + w.replace(/^./, c => c.toUpperCase()));
  return [...tags, "#RacunBelanja", "#ViralDiMarketplace"].join(" ");
}

function buildTitle(mp, d) {
  const base = `${d.nama} ${d.bahan ? "- " + d.bahan : ""}`.trim();
  const extras = {
    shopee: `COD Gratis Ongkir ${d.kategori}`,
    tokopedia: d.kategori,
    tiktok: `Viral COD Gratis Ongkir ${d.kategori}`,
    lazada: `Original ${d.kategori} COD`
  };
  let title = `${base} ${extras[mp] || ""}`.replace(/\s+/g, " ").trim();
  const lim = LIMITS[mp];
  if (title.length > lim) title = title.slice(0, lim - 1).trim() + "…";
  return title;
}

function buildDesc(mp, d) {
  const lines = [];
  lines.push(`${TONE_OPEN[d.tone]} ${d.nama}!`);
  lines.push("");
  if (d.harga) lines.push(`💰 Harga spesial: ${rupiah(d.harga)}`);
  if (d.bahan) lines.push(`🧵 Bahan: ${d.bahan}`);
  if (d.kategori) lines.push(`🏷️ Kategori: ${d.kategori}`);
  if (d.target) lines.push(`🎯 Cocok untuk: ${d.target}`);
  lines.push("");
  if (d.fitur.length) {
    lines.push("✨ KEUNGGULAN:");
    d.fitur.forEach(f => lines.push(`✅ ${f}`));
    lines.push("");
  }
  const mpNote = {
    shopee: "📦 Bisa COD + Gratis Ongkir. Packing aman & rapi.",
    tokopedia: "📦 Pengiriman cepat ke seluruh Indonesia. Packing double safety.",
    tiktok: "🎬 Sudah banyak yang checkout dari video! Buruan sebelum viral makin parah.",
    lazada: "📦 100% Original. Garansi pengembalian mudah via Lazada."
  };
  lines.push(mpNote[mp] || "");
  lines.push("");
  lines.push(TONE_CLOSE[d.tone]);
  return lines.join("\n");
}

function buildSosmed(d) {
  const lines = [];
  lines.push(`📎 ${d.nama}`);
  lines.push("");
  lines.push(d.fitur.length ? d.fitur.map(f => "✔ " + f).join("\n") : "Kualitas terjamin, harga bersahabat!");
  lines.push("");
  if (d.harga) lines.push(`Cuma ${rupiah(d.harga)} aja! 💸`);
  lines.push("Link order ada di bio / chat admin ya kak 👇");
  lines.push("");
  lines.push(hashtags(d.nama, d.kategori));
  return lines.join("\n");
}

function collect() {
  return {
    nama: document.getElementById("nama").value.trim(),
    kategori: document.getElementById("kategori").value,
    bahan: document.getElementById("bahan").value.trim(),
    fitur: document.getElementById("fitur").value.split("\n").map(s => s.trim()).filter(Boolean),
    harga: document.getElementById("harga").value.trim(),
    tone: document.getElementById("tone").value,
    target: document.getElementById("target").value.trim()
  };
}

function generate() {
  const d = collect();
  if (!d.nama) { alert("Isi dulu Nama Produk ya kak 📎"); return; }
  lastResult = {
    shopee: { title: buildTitle("shopee", d), desc: buildDesc("shopee", d) },
    tokopedia: { title: buildTitle("tokopedia", d), desc: buildDesc("tokopedia", d) },
    tiktok: { title: buildTitle("tiktok", d), desc: buildDesc("tiktok", d) },
    lazada: { title: buildTitle("lazada", d), desc: buildDesc("lazada", d) },
    sosmed: { caption: buildSosmed(d) }
  };
  const active = document.querySelector(".tab.active").dataset.tab;
  render(active);
}

function block(title, text, limit) {
  const over = limit && text.length > limit;
  return `<div class="block">
    <div class="block-head">
      <h3>${title} ${limit ? `<span class="char ${over ? "over" : ""}">(${text.length}/${limit} karakter)</span>` : ""}</h3>
      <button class="copy-btn" data-copy="${encodeURIComponent(text)}">Salin</button>
    </div>
    <div class="block-body">${text.replace(/</g, "&lt;")}</div>
  </div>`;
}

function render(mp) {
  const out = document.getElementById("output");
  if (!lastResult) return;
  if (mp === "sosmed") {
    out.innerHTML = block("Caption Instagram / Facebook / WA", lastResult.sosmed.caption);
  } else {
    const r = lastResult[mp];
    out.innerHTML =
      block("Judul Produk", r.title, LIMITS[mp]) +
      block("Deskripsi Produk", r.desc);
  }
  out.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = decodeURIComponent(btn.dataset.copy);
      try { await navigator.clipboard.writeText(text); }
      catch {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand("copy"); ta.remove();
      }
      btn.textContent = "Tersalin ✓";
      setTimeout(() => (btn.textContent = "Salin"), 1500);
    });
  });
}

document.getElementById("generate").addEventListener("click", generate);
document.querySelectorAll(".tab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    render(t.dataset.tab);
  });
});
