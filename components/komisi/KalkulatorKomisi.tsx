'use client'

import { useMemo, useState } from 'react'
import { formatRupiah, hitungKomisiPerUnit } from '@/lib/calculations'
import { StatCard } from '@/components/ui/StatCard'

const clampNumber = (value: number, min: number, max?: number) => Math.max(min, max === undefined ? value : Math.min(max, value))

type NumberField = 'harga' | 'persen' | 'konten' | 'konversi'

export function KalkulatorKomisi() {
  const [form, setForm] = useState({ platform: 'Shopee', harga: 100000, persen: 5, konten: 30, konversi: 2 })

  const updateNumber = (key: NumberField, value: string) => {
    const numberValue = Number(value)
    const safeValue = Number.isFinite(numberValue) ? numberValue : 0
    const safeFormValue = key === 'persen'
      ? clampNumber(safeValue, 0, 100)
      : clampNumber(safeValue, 0)

    setForm({ ...form, [key]: safeFormValue })
  }

  const hasil = useMemo(() => {
    const unit = hitungKomisiPerUnit(form.harga, form.persen)
    const bulan = unit * form.konten * form.konversi
    return { unit, bulan, tahun: bulan * 12 }
  }, [form])
  const tip = hasil.bulan >= 5000000 ? 'Bagus! Fokus scale konten terbaik dan ulangi format pemenang.' : hasil.bulan >= 1000000 ? 'Potensi oke. Naikkan volume konten dan optimasi CTA.' : 'Mulai dari produk komisi lebih tinggi atau target konversi realistis.'

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-5">
        <select className="rounded-xl border p-3 dark:bg-gray-800" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })}>
          <option>Shopee</option>
          <option>TikTok Shop</option>
          <option>Keduanya</option>
        </select>
        <input type="number" min="0" step="1" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Harga" value={form.harga} onChange={(event) => updateNumber('harga', event.target.value)} />
        <input type="number" min="0" max="100" step="0.1" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="% Komisi" value={form.persen} onChange={(event) => updateNumber('persen', event.target.value)} />
        <input type="number" min="0" step="1" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Konten/bulan" value={form.konten} onChange={(event) => updateNumber('konten', event.target.value)} />
        <input type="number" min="0" step="1" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Konversi/konten" value={form.konversi} onChange={(event) => updateNumber('konversi', event.target.value)} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Komisi/unit" value={formatRupiah(hasil.unit)} />
        <StatCard label="Estimasi/bulan" value={formatRupiah(hasil.bulan)} color="green" />
        <StatCard label="Estimasi/tahun" value={formatRupiah(hasil.tahun)} color="amber" />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">Tip: {tip}</p>
    </div>
  )
}
