import type { HasilAnalisis, ItemKomisi } from '@/types'

/** Menghitung komisi per unit dari harga dan persentase komisi. */
export function hitungKomisiPerUnit(harga: number, persenKomisi: number): number { return Math.round((harga || 0) * ((persenKomisi || 0) / 100)) }
/** Menghitung potensi komisi bulanan. */
export function hitungPotensiPerBulan(komisiPerUnit: number, terjual: number): number { return Math.round((komisiPerUnit || 0) * (terjual || 0)) }
/** Menghitung skor produk berdasarkan harga, komisi, penjualan, dan rating. */
export function hitungSkorProduk(harga: number, komisi: number, terjual: number, rating: number): Pick<HasilAnalisis, 'skor' | 'skorLabel' | 'rekomendasi'> {
  const marginScore = Math.min(35, ((komisi / Math.max(harga, 1)) * 100 / 15) * 35)
  const salesScore = Math.min(30, (terjual / 1000) * 30)
  const ratingScore = Math.min(25, (rating / 5) * 25)
  const priceScore = harga >= 20000 && harga <= 500000 ? 10 : 6
  const skor = Math.round(Math.max(0, Math.min(100, marginScore + salesScore + ratingScore + priceScore)))
  const skorLabel = skor >= 80 ? 'Sangat Bagus' : skor >= 60 ? 'Bagus' : 'Cukup'
  const rekomendasi = skor >= 80 ? 'Produk sangat potensial untuk diprioritaskan sebagai konten utama.' : skor >= 60 ? 'Produk layak dicoba, optimalkan hook dan angle konten.' : 'Potensi masih sedang; bandingkan dengan produk sejenis yang komisinya lebih tinggi.'
  return { skor, skorLabel, rekomendasi }
}
/** Menjumlahkan semua estimasi komisi bulanan. */
export function hitungKomisiTotal(items: ItemKomisi[]): number { return Math.round(items.reduce((total, item) => total + (item.komisiPerBulan || 0), 0)) }
/** Menghitung conversion rate dalam persen dengan 1 desimal. */
export function hitungConversionRate(klik: number, konversi: number): number { return klik > 0 ? Math.round((konversi / klik) * 1000) / 10 : 0 }
export const formatRupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)
