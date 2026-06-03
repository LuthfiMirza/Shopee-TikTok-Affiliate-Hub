# Shopee & TikTok Affiliate Hub

## Deskripsi
Web app personal tool untuk afiliator Shopee dan TikTok Shop Indonesia. Membantu analisis produk, hitung komisi, generate konten dengan AI, dan tracking link afiliasi.

## Fitur Utama
- Analisis produk potensial (skor, estimasi penghasilan)
- Kalkulator komisi (per unit, per bulan, per tahun, multi-produk)
- Generator konten AI (review, unboxing, hook TikTok, caption)
- Template hashtag per kategori
- Tracking link & performa harian (klik, konversi, CR)

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Claude API (Anthropic)
- localStorage (data persistence)

## Cara Menjalankan
1. Clone repo ini
2. `npm install`
3. Copy `.env.local.example` → `.env.local`
4. Isi `ANTHROPIC_API_KEY` dengan API key dari console.anthropic.com
5. `npm run dev`
6. Buka http://localhost:3000

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
- `ANTHROPIC_API_KEY` — API key Anthropic (wajib untuk fitur AI)
- `NEXT_PUBLIC_DEMO_MODE` — set `true` untuk mode demo tanpa API key

## Catatan
- Semua data tersimpan di localStorage browser (tidak ada server/database)
- AI feature membutuhkan koneksi internet dan API key valid
