'use client'

import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CatatanPerforma } from '@/types'

interface GrafikPerformaProps {
  data: CatatanPerforma[]
}

type ChartMode = 'aktivitas' | 'komisi'

const formatRupiahTooltip = (value: number) => `Rp ${Number(value).toLocaleString('id-ID')}`

export function GrafikPerforma({ data }: GrafikPerformaProps) {
  const [mode, setMode] = useState<ChartMode>('aktivitas')
  const chartData = useMemo(
    () =>
      data
        .slice(-30)
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
        .map((item) => ({
          ...item,
          tgl: item.tanggal.slice(5).replace('-', '/'),
        })),
    [data]
  )

  if (data.length < 2) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Grafik Performa</h2>
        <p className="mt-3 text-sm text-gray-500">Tambah minimal 2 data performa untuk melihat grafik</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Grafik Performa</h2>
          <p className="text-sm text-gray-500">30 data terakhir, diurutkan berdasarkan tanggal.</p>
        </div>
        <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setMode('aktivitas')}
            className={`rounded-lg px-3 py-2 text-xs font-semibold ${mode === 'aktivitas' ? 'bg-white text-primary shadow-sm dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}`}
          >
            Klik & Konversi
          </button>
          <button
            type="button"
            onClick={() => setMode('komisi')}
            className={`rounded-lg px-3 py-2 text-xs font-semibold ${mode === 'komisi' ? 'bg-white text-primary shadow-sm dark:bg-gray-700' : 'text-gray-600 dark:text-gray-300'}`}
          >
            Komisi (Rp)
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        {mode === 'aktivitas' ? (
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="tgl" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalKlik" name="Klik" stroke="#1D9E75" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="konversi" name="Konversi" stroke="#F59E0B" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="tgl" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
            <Tooltip formatter={(value) => formatRupiahTooltip(Number(value))} />
            <Legend />
            <Bar dataKey="komisiDiperoleh" name="Komisi" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
