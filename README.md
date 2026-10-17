# ⚔️ NEXUS // SCRIM — Esports Scrim Matchmaking Platform

Platform web matchmaking dan turnamen scrim kompetitif berbasis **Next.js (App Router)**, **Server Actions**, **Prisma ORM**, **PostgreSQL (Neon)**, dan **NextAuth (Discord OAuth)**.

---

## 🎮 Fitur Utama & Roadmap Implementasi

### 🛡️ Fase 0 - 2: Database & Model Relasi (Prisma)
- **User**: Player dengan role `ADMIN`, `CAPTAIN`, `MEMBER`, in-game tag (IGN), dan relasi Discord.
- **Team**: Nama tim, tag 3-5 huruf (misal: `PRX`, `RRQ`), logo, game, kapten, dan kode undangan unik.
- **TeamMember**: Relasi many-to-many user ke tim dengan peran `CAPTAIN`, `PLAYER`, `SUBSTITUTE`. Validasi: satu pemain hanya boleh di satu tim aktif per game.
- **Scrim**: Jadwal waktu (WIB), game (Valorant, MLBB, PUBG Mobile, FF, Dota 2, CS2), format (BO1, BO3, BO5, Battle Royale), kuota slot, aturan match, dan server region.
- **ScrimRegistration**: Pendaftaran tim dengan status `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`.
- **MatchResult**: Skor tim, pemenang, catatan MVP, dan tautan bukti screenshot skor.

### 🔐 Fase 3: Autentikasi (NextAuth)
- **Discord OAuth**: Login resmi menggunakan akun Discord player.
- **Quick Demo Login**: Tersedia tombol login instan 1-klik untuk menguji peran `ADMIN`, `CAPTAIN`, dan `MEMBER` tanpa setup Discord bot terlebih dahulu.
- **Role Session & Middleware**: Proteksi rute otomatis (`/admin/*`, `/teams/create`, `/my-registrations`, `/profile`).

### 👥 Fase 4: Manajemen Tim & Roster
- Pembuatan tim baru (pembuat otomatis menjadi Kapten).
- Kode undangan instan untuk mengundang roster squad.
- Fitur kapten: transfer kapten, keluarkan (kick) anggota, dan edit profil tim.
- Fitur anggota: keluar (leave) tim mandiri.

### ⚔️ Fase 5 & 6: Jadwal & Pendaftaran Scrim
- Halaman daftar scrim dengan filter interaktif per game dan status.
- Penyesuaian zona waktu **Waktu Indonesia Barat (WIB)** yang presisi.
- Validasi pendaftaran kapten: verifikasi slot, kompatibilitas divisi game, dan status registrasi.
- Halaman **Pendaftaran Saya** untuk memantau status atau membatalkan slot.

### 👑 Fase 7: Admin Panel
- Dashboard metrik (Total scrim, scrim terbuka, pendaftaran pending, tim aktif).
- CRUD Scrim (Buat baru, edit, tutup, atau hapus).
- Review Pendaftaran: Tombol 1-klik Approve atau Reject.
- Input Hasil Pertandingan: Skor akhir tim A vs tim B, MVP, dan link bukti screenshot.

### 🤖 Fase 8: Notifikasi Webhook Discord
- Webhook terintegrasi ke channel Discord saat ada scrim baru dibuka atau pendaftaran tim disetujui.

### 🎨 Fase 9: UI/UX Gaming Dark Aesthetic
- Palet warna cyber gaming: Dark slate `#08090d`, Neon Cyan `#00f2fe`, Neon Violet `#9d4edd`.
- Komponen responsif mobile, badge game dinamis, dan feedback loading state.

---

## 🚀 Cara Menjalankan Project

### 1. Masuk ke Direktori Project
```bash
cd "C:\Users\Eldi Anugrah\.gemini\antigravity\scratch\nexus-scrim"
```

### 2. Konfigurasi Environment Variables (`.env`)
Salin atau edit file `.env`:
```env
# URL Database PostgreSQL dari Neon (https://neon.tech)
DATABASE_URL="postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="nexus_scrim_super_secret_jwt_key_1234567890"

# Discord OAuth (dari https://discord.com/developers/applications)
# Redirect URI: http://localhost:3000/api/auth/callback/discord
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""

# Opsional: Discord Webhook URL untuk notifikasi channel
DISCORD_WEBHOOK_URL=""
```

### 3. Setup Database (Prisma + Neon)
Setelah memasukkan URL Neon di `.env`, sinkronkan schema dan seed data awal:
```bash
# Push schema tabel ke PostgreSQL Neon
npm run prisma:push

# Generate client Prisma
npm run prisma:generate

# Jalankan data dummy (Tim, Scrim, User Admin & Kapten)
npm run db:seed
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Akun Demo Siap Pakai

Halaman login (`/login`) telah dilengkapi tombol 1-klik untuk mencoba semua role:

| Role | Akun Demo | Hak Akses |
| :--- | :--- | :--- |
| **ADMIN** | `admin@scrim.gg` | Akses penuh admin panel, buat/hapus scrim, review pendaftaran tim, input hasil match. |
| **CAPTAIN** | `captain.prx@scrim.gg` | Kapten Paper Rex Academy. Dapat mendaftarkan tim ke scrim Valorant, transfer kapten, undang roster. |
| **CAPTAIN** | `captain.rrq@scrim.gg` | Kapten RRQ Sena (divisi Mobile Legends). |
| **MEMBER** | `member@scrim.gg` | Roster member, dapat melihat jadwal dan status tim. |
