'use client'

import { useState } from 'react'
import { formatRupiah } from '@/lib/calculations'
import { useAnalisisStore } from '@/store/useAnalisisStore'
import { useProdukPipelineStore } from '@/store/useProdukPipelineStore'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'

export function HasilAnalisis() {
  const produk = useAnalisisStore((state) => state.produk)
  const hasil = useAnalisisStore((state) => state.hasil)
  const simpanProduk = useProdukPipelineStore((state) => state.simpanProduk)
  const [saved, setSaved] = useState(false)

  if (!hasil || !produk) return <p className="text-sm text-gray-500">Isi form untuk melihat skor dan estimasi.</p>

  const variant = hasil.skor >= 80 ? 'green' : hasil.skor >= 60 ? 'amber' : 'red'
  const saveToPipeline = () => {
    simpanProduk({ ...produk, hasil, status: 'riset', catatan: '', updatedAt: new Date().toISOString() })
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Potensi/bulan" value={formatRupiah(hasil.potensiPerBulan)} color="green" />
        <StatCard label="Skor Produk" value={`${hasil.skor}/100`} color={variant} />
        <StatCard label="Komisi/produk" value={formatRupiah(hasil.komisiPerUnit)} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge label={hasil.skorLabel} variant={variant} />
        <button type="button" onClick={saveToPipeline} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          Simpan ke Pipeline Produk
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Tersimpan ke database lokal.</span>}
      </div>
      <p className="text-gray-700 dark:text-gray-300">{hasil.rekomendasi}</p>
    </div>
  )
}
