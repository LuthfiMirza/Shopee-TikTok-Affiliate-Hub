# Shopee & TikTok Affiliate Hub

## Deskripsi
Web app personal tool untuk afiliator Shopee dan TikTok Shop Indonesia. Membantu analisis produk, hitung komisi, generate konten dengan AI, dan tracking link afiliasi.

## Fitur Utama
- Analisis produk potensial (skor, estimasi penghasilan)
- Kalkulator komisi (per unit, per bulan, per tahun, multi-produk)
- Generator konten AI berbasis Google Gemini
- Template hashtag per kategori
- Tracking link & performa harian (klik, konversi, CR)
- Export data performa ke CSV

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Google Gemini REST API
- localStorage (data persistence)

## Cara Menjalankan
1. Clone repo ini
2. Jalankan `npm install`
3. Copy `.env.local.example` → `.env.local`
4. Isi `GOOGLE_GEMINI_API_KEY` dengan API key dari Google AI Studio
5. Jalankan `npm run dev`
6. Buka http://localhost:3000

## Script
- `npm run dev` — menjalankan development server
- `npm run build` — build production dan type-check
- `npm run start` — menjalankan hasil build
- `npm run lint` — menjalankan ESLint konfigurasi Next.js

## Struktur Folder
```text
app/                 App Router pages dan API route
components/layout/   Header dan tab navigasi
components/analisis/ Fitur analisis produk
components/komisi/   Kalkulator dan multi-produk
components/konten/   Generator konten dan hashtag
components/tracking/ Link afiliasi dan performa
components/ui/       Komponen reusable
lib/                 Helper AI, kalkulasi, prompt, storage
store/               Zustand stores
types/               TypeScript interfaces
```

## Environment Variables
- `GOOGLE_GEMINI_API_KEY` — API key Google Gemini (wajib untuk fitur AI)
- `NEXT_PUBLIC_AI_PROVIDER` — provider AI yang aktif, default `gemini`
- `NEXT_PUBLIC_DEMO_MODE` — disiapkan untuk mode demo tanpa API key

## Batasan Saat Ini
- Semua data tersimpan di localStorage browser, jadi belum sinkron antar perangkat
- Belum ada login/auth dan database server
- Rate limit AI masih berbasis memory server sederhana, cukup untuk lokal/personal tetapi belum ideal untuk production multi-user

## Roadmap Production
- Tambahkan database untuk link, performa, dan profil user
- Tambahkan auth/login untuk multi-user
- Pindahkan rate limit ke storage persistent seperti Redis atau database
- Tambahkan backup/import data dan automated test
