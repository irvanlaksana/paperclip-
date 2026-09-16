# 📎 Paperclip

**Paperclip memproduksi konten jualan dari bahan mentah kamu** — siap dipajang di berbagai marketplace.

## Cara kerja
1. Kamu masukkan **bahan**: nama produk, material, keunggulan, harga, target pembeli.
2. Paperclip meracik otomatis:
   - **Judul produk** sesuai batas karakter tiap marketplace (Shopee 255, Tokopedia 70, TikTok Shop 255, Lazada 255)
   - **Deskripsi produk** dengan tone santai / premium / promo
   - **Caption sosmed + hashtag** untuk Instagram, Facebook, WhatsApp
3. Klik **Salin**, tempel ke tokomu. Beres. 📦

## Cara menjalankan
Tanpa install apa pun — cukup buka file `index.html` di browser,
atau jalankan server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Struktur
- `index.html` — halaman utama (form bahan + hasil konten)
- `styles.css` — tampilan
- `app.js` — mesin generator konten (100% client-side, tanpa backend)
