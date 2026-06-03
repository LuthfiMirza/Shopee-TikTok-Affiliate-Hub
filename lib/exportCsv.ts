import Papa from 'papaparse'
import type { CatatanPerforma, StatRingkasan } from '@/types'

/**
 * Export data performa ke file CSV dan trigger download browser
 */
export function exportPerformaCSV(
  data: CatatanPerforma[],
  options: {
    startDate?: string
    endDate?: string
    filename?: string
  } = {}
): void {
  let filtered = [...data]

  if (options.startDate) {
    filtered = filtered.filter((item) => item.tanggal >= options.startDate!)
  }

  if (options.endDate) {
    filtered = filtered.filter((item) => item.tanggal <= options.endDate!)
  }

  filtered.sort((a, b) => a.tanggal.localeCompare(b.tanggal))

  const rows = filtered.map((item) => ({
    Tanggal: item.tanggal,
    'Total Klik': item.totalKlik,
    'Konversi (Penjualan)': item.konversi,
    'Conversion Rate (%)': item.conversionRate,
    'Komisi Diperoleh (Rp)': item.komisiDiperoleh,
  }))

  if (rows.length > 0) {
    const totalKlik = filtered.reduce((sum, item) => sum + item.totalKlik, 0)
    const totalKonversi = filtered.reduce((sum, item) => sum + item.konversi, 0)
    const totalKomisi = filtered.reduce((sum, item) => sum + item.komisiDiperoleh, 0)
    const rataRataCR = totalKlik > 0 ? ((totalKonversi / totalKlik) * 100).toFixed(1) : '0'

    rows.push({} as (typeof rows)[number])
    rows.push({
      Tanggal: 'TOTAL',
      'Total Klik': totalKlik,
      'Konversi (Penjualan)': totalKonversi,
      'Conversion Rate (%)': parseFloat(rataRataCR),
      'Komisi Diperoleh (Rp)': totalKomisi,
    })
  }

  const csv = Papa.unparse(rows)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = options.filename || `performa-afiliasi-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Hitung statistik ringkasan dari data performa
 */
export function hitungRingkasan(data: CatatanPerforma[]): StatRingkasan {
  if (data.length === 0) {
    return {
      totalKlik: 0,
      totalKonversi: 0,
      totalKomisi: 0,
      rataRataCR: 0,
      hariTerbaik: '-',
      hariBuruk: '-',
    }
  }

  const totalKlik = data.reduce((sum, item) => sum + item.totalKlik, 0)
  const totalKonversi = data.reduce((sum, item) => sum + item.konversi, 0)
  const totalKomisi = data.reduce((sum, item) => sum + item.komisiDiperoleh, 0)
  const rataRataCR = totalKlik > 0 ? parseFloat(((totalKonversi / totalKlik) * 100).toFixed(1)) : 0
  const sorted = [...data].sort((a, b) => b.komisiDiperoleh - a.komisiDiperoleh)
  const hariTerbaik = sorted[0]?.tanggal || '-'
  const hariBuruk = sorted[sorted.length - 1]?.tanggal || '-'

  return { totalKlik, totalKonversi, totalKomisi, rataRataCR, hariTerbaik, hariBuruk }
}
