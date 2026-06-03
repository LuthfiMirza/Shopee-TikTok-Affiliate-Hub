'use client'

import { useMemo, useState } from 'react'
import { exportPerformaCSV } from '@/lib/exportCsv'
import type { CatatanPerforma } from '@/types'

interface ExportCSVProps {
  data: CatatanPerforma[]
}

function dateDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

export function ExportCSV({ data }: ExportCSVProps) {
  const [startDate, setStartDate] = useState(dateDaysAgo(30))
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [success, setSuccess] = useState(false)

  const filteredCount = useMemo(
    () => data.filter((item) => item.tanggal >= startDate && item.tanggal <= endDate).length,
    [data, endDate, startDate]
  )

  const showSuccess = () => {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const downloadFiltered = () => {
    exportPerformaCSV(data, { startDate, endDate })
    showSuccess()
  }

  const downloadAll = () => {
    exportPerformaCSV(data)
    showSuccess()
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data Performa</h2>
      {data.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">Belum ada data untuk dieksport</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dari tanggal
              <input type="date" className="mt-1 w-full rounded-xl border p-3 dark:bg-gray-800" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sampai tanggal
              <input type="date" className="mt-1 w-full rounded-xl border p-3 dark:bg-gray-800" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Preview: {filteredCount} data akan dieksport</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={filteredCount === 0} onClick={downloadFiltered} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              Download CSV
            </button>
            <button type="button" onClick={downloadAll} className="rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              Export Semua Data
            </button>
          </div>
          {success && <p className="text-sm font-medium text-green-600">✓ File berhasil didownload</p>}
        </div>
      )}
    </div>
  )
}
