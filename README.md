# Portofolio — Rifky Deby Prayoga

Situs portofolio pribadi. **Vite + React**, animasi **GSAP**, backend **Supabase** (form kontak & buku tamu).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil di dist/
```

## Mengganti konten

Semua teks, proyek, tech stack, sertifikat, dan sosmed ada di **`src/data/profile.js`**.
Cari tanda `TODO` di file itu.

| Yang diganti | Caranya |
|---|---|
| Foto profil | taruh di `public/images/profile.jpg`, isi `photo: '/images/profile.jpg'` |
| Screenshot proyek | `public/images/projects/nama.png`, isi `image` di proyek terkait |
| Sertifikat / penghargaan | gambar di `public/images/certificates/`, tambahkan ke array `certificates` / `awards` |
| Musik | lagu pembuka di `public/audio/intro.mp3`; playlist YouTube Music di `music.playlistId` |
| CV | isi `cvUrl`, tombol "Download CV" muncul otomatis |

## Supabase (form kontak & buku tamu)

1. Buat proyek di https://supabase.com (atau pakai yang sudah ada).
2. Buka **SQL Editor**, jalankan isi `supabase/migrations/0001_init.sql`, lalu `0002_comment_moderation.sql`.
3. Salin `.env.example` ke `.env`, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   (Project Settings → API).
4. Pesan kontak yang masuk bisa dibaca di **Table Editor → contact_messages**
   (tidak dikirim ke email — hanya tersimpan di tabel ini).
5. **Moderasi buku tamu:** komentar baru tidak langsung tampil. Buka **Table Editor → comments**,
   centang kolom `approved` untuk menampilkan, hapus centang untuk menyembunyikan lagi.
   Ingin komentar langsung tampil tanpa persetujuan? Jalankan:
   `alter table comments alter column approved set default true;` lalu ubah `approved = false`
   menjadi `approved in (true, false)` di policy `comments_public_insert`, dan hapus `approved: false` di `Contact.jsx`.

Tanpa `.env`, situs tetap jalan; form hanya menampilkan pesan "Supabase belum dikonfigurasi".

## Deploy ke Vercel

1. Push ke GitHub, lalu import repo di https://vercel.com.
2. Tambahkan dua environment variable di atas di Settings → Environment Variables.
3. `vercel.json` sudah mengatur agar URL `/project/...` tidak 404.
