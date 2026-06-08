export type PipelineStatus = 'riset' | 'testing' | 'winning' | 'scale' | 'stop'
export type CalendarStatus = 'planned' | 'draft' | 'posted' | 'reviewed'

export interface Produk { id: string; nama: string; kategori: string; harga: number; persenKomisi: number; terjualPerBulan: number; rating: number; platform: 'shopee' | 'tiktok' | 'keduanya'; createdAt: string }
export interface HasilAnalisis { komisiPerUnit: number; potensiPerBulan: number; skor: number; skorLabel: 'Sangat Bagus' | 'Bagus' | 'Cukup'; rekomendasi: string }
export interface ProdukPipeline extends Produk { status: PipelineStatus; hasil: HasilAnalisis; catatan?: string; updatedAt: string }
export interface ItemKomisi { id: string; nama: string; komisiPerBulan: number }
export interface LinkAfiliasi { id: string; nama: string; platform: 'Shopee' | 'TikTok Shop'; url: string; targetKlikHarian: number; totalKlik: number; createdAt: string }
export interface CatatanPerforma { id: string; tanggal: string; linkId?: string; totalKlik: number; konversi: number; komisiDiperoleh: number; conversionRate: number }
export interface GeneratorConfig { produk: string; jenisKonten: JenisKonten; targetAudiens: string; poinUtama: string }
export type JenisKonten = 'review' | 'unboxing' | 'tutorial' | 'perbandingan' | 'hook' | 'caption'
export type Kategori = 'Kecantikan' | 'Fashion' | 'Makanan' | 'Elektronik' | 'Rumah Tangga' | 'Kesehatan'

export interface ContentCalendarItem {
  id: string
  tanggal: string
  produk: string
  platform: 'TikTok' | 'Instagram' | 'Shopee Video' | 'WhatsApp'
  jenisKonten: JenisKonten
  status: CalendarStatus
  targetKlik: number
  catatan: string
  createdAt: string
}

export interface DataGrafik {
  tanggal: string
  klik: number
  konversi: number
  komisi: number
}

export interface StatRingkasan {
  totalKlik: number
  totalKonversi: number
  totalKomisi: number
  rataRataCR: number
  hariTerbaik: string
  hariBuruk: string
}

export interface ExportOptions {
  startDate: string
  endDate: string
  includeKlik: boolean
  includeKonversi: boolean
  includeKomisi: boolean
}
