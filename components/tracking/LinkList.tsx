'use client'

import { useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'
import { formatRupiah, hitungConversionRate } from '@/lib/calculations'
import { useTrackingStore } from '@/store/useTrackingStore'

export function LinkList() {
  const { links, performa, hydrate, hapusLink } = useTrackingStore()

  useEffect(() => hydrate(), [hydrate])

  return (
    <div className="space-y-3">
      {links.length === 0 && <p className="text-sm text-gray-500">Belum ada link. Tambahkan link afiliasi dulu agar tracking per produk lebih rapi.</p>}
      {links.map((link) => {
        const rows = performa.filter((item) => item.linkId === link.id)
        const totalKlik = rows.reduce((total, item) => total + item.totalKlik, 0)
        const totalKonversi = rows.reduce((total, item) => total + item.konversi, 0)
        const totalKomisi = rows.reduce((total, item) => total + item.komisiDiperoleh, 0)
        const progress = Math.min(100, Math.round((totalKlik / Math.max(link.targetKlikHarian, 1)) * 100))
        const cr = hitungConversionRate(totalKlik, totalKonversi)

        return (
          <div key={link.id} className="rounded-xl border p-4 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <b>{link.nama}</b>
                <p className="truncate text-xs text-gray-500">{link.url}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge label={link.platform} variant={link.platform === 'Shopee' ? 'amber' : 'gray'} />
                <Badge label={progress >= 50 ? 'Aktif' : 'Perlu Perhatian'} variant={progress >= 50 ? 'green' : 'red'} />
                <button onClick={() => hapusLink(link.id)} className="text-sm text-red-600">Hapus</button>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 grid gap-2 text-xs text-gray-600 dark:text-gray-300 md:grid-cols-4">
              <span>Klik: <b>{totalKlik}</b> / target {link.targetKlikHarian}</span>
              <span>Konversi: <b>{totalKonversi}</b></span>
              <span>CR: <b>{cr}%</b></span>
              <span>Komisi: <b>{formatRupiah(totalKomisi)}</b></span>
            </div>
          </div>
        )
      })}
      <p className="text-sm font-semibold">Total link aktif: {links.length}</p>
    </div>
  )
}
