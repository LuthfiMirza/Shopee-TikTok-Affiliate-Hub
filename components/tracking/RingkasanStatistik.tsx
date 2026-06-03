'use client'

import { StatCard } from '@/components/ui/StatCard'
import { formatRupiah } from '@/lib/calculations'
import { hitungRingkasan } from '@/lib/exportCsv'
import type { CatatanPerforma } from '@/types'

interface RingkasanStatistikProps {
  data: CatatanPerforma[]
}

export function RingkasanStatistik({ data }: RingkasanStatistikProps) {
  const ringkasan = hitungRingkasan(data)
  const kosong = data.length === 0

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Klik" value={kosong ? '-' : ringkasan.totalKlik.toLocaleString('id-ID')} color="green" />
        <StatCard label="Total Konversi" value={kosong ? '-' : ringkasan.totalKonversi.toLocaleString('id-ID')} color="amber" />
        <StatCard label="Total Komisi" value={kosong ? '-' : formatRupiah(ringkasan.totalKomisi)} color="default" />
        <StatCard label="Rata-rata CR" value={kosong ? '-' : `${ringkasan.rataRataCR}%`} color="default" />
      </div>
      <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        Hari terbaik: <span className="font-semibold">{ringkasan.hariTerbaik}</span>
      </p>
    </div>
  )
}
