'use client'

import { useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { formatRupiah } from '@/lib/calculations'
import { useProdukPipelineStore } from '@/store/useProdukPipelineStore'
import type { PipelineStatus } from '@/types'

const statuses: { key: PipelineStatus; label: string; help: string }[] = [
  { key: 'riset', label: 'Riset', help: 'Produk baru ditemukan' },
  { key: 'testing', label: 'Testing', help: 'Sedang dicoba konten' },
  { key: 'winning', label: 'Winning', help: 'Klik/konversi bagus' },
  { key: 'scale', label: 'Scale', help: 'Perbanyak konten' },
  { key: 'stop', label: 'Stop', help: 'Kurang perform' },
]

const statusVariant: Record<PipelineStatus, 'green' | 'amber' | 'red' | 'blue' | 'gray'> = {
  riset: 'gray',
  testing: 'amber',
  winning: 'green',
  scale: 'blue',
  stop: 'red',
}

export function ProductPipeline() {
  const { produk, hydrate, updateStatus, updateCatatan, hapusProduk } = useProdukPipelineStore()

  useEffect(() => hydrate(), [hydrate])

  const summary = useMemo(() => ({
    total: produk.length,
    winning: produk.filter((item) => item.status === 'winning' || item.status === 'scale').length,
    potensi: produk.reduce((total, item) => total + item.hasil.potensiPerBulan, 0),
  }), [produk])

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Produk" value={summary.total.toLocaleString('id-ID')} />
        <StatCard label="Winning/Scale" value={summary.winning.toLocaleString('id-ID')} color="green" />
        <StatCard label="Estimasi Potensi" value={formatRupiah(summary.potensi)} color="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {statuses.map((status) => {
          const items = produk.filter((item) => item.status === status.key)
          return (
            <section key={status.key} className="rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{status.label}</h3>
                  <p className="text-xs text-gray-500">{status.help}</p>
                </div>
                <Badge label={String(items.length)} variant={statusVariant[status.key]} />
              </div>
              <div className="space-y-3">
                {items.length === 0 && <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800">Belum ada produk.</p>}
                {items.map((item) => (
                  <article key={item.id} className="space-y-3 rounded-xl border p-3 text-sm dark:border-gray-700">
                    <div>
                      <h4 className="font-semibold">{item.nama}</h4>
                      <p className="text-xs text-gray-500">{item.kategori} · {item.platform} · Skor {item.hasil.skor}/100</p>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      <p>Komisi/unit: <b>{formatRupiah(item.hasil.komisiPerUnit)}</b></p>
                      <p>Potensi/bulan: <b>{formatRupiah(item.hasil.potensiPerBulan)}</b></p>
                    </div>
                    <select className="w-full rounded-lg border p-2 text-xs dark:bg-gray-800" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as PipelineStatus)}>
                      {statuses.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
                    </select>
                    <textarea className="w-full rounded-lg border p-2 text-xs dark:bg-gray-800" placeholder="Catatan testing, angle konten, alasan scale/stop" value={item.catatan || ''} onChange={(event) => updateCatatan(item.id, event.target.value)} />
                    <button type="button" onClick={() => hapusProduk(item.id)} className="text-xs font-semibold text-red-600">Hapus</button>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
