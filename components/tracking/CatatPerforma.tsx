'use client'

import { FormEvent, useEffect, useState } from 'react'
import { formatRupiah, hitungConversionRate } from '@/lib/calculations'
import { useTrackingStore } from '@/store/useTrackingStore'

export function CatatPerforma() {
  const { performa, hydrate, tambahPerforma, hapusPerforma } = useTrackingStore()
  const [showAll, setShowAll] = useState(false)
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    totalKlik: 0,
    konversi: 0,
    komisiDiperoleh: 0,
  })

  useEffect(() => hydrate(), [hydrate])

  const cr = hitungConversionRate(form.totalKlik, form.konversi)
  const visibleRows = showAll ? performa : performa.slice(0, 7)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    tambahPerforma({ id: crypto.randomUUID(), ...form, conversionRate: cr })
  }

  const handleDelete = (id: string, tanggal: string) => {
    if (window.confirm(`Hapus data ${tanggal}?`)) {
      hapusPerforma(id)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-5">
        <input type="date" className="rounded-xl border p-3 dark:bg-gray-800" value={form.tanggal} onChange={(event) => setForm({ ...form, tanggal: event.target.value })} />
        {[
          ['totalKlik', 'Total klik'],
          ['konversi', 'Konversi'],
          ['komisiDiperoleh', 'Komisi Rp'],
        ].map(([key, label]) => (
          <input key={key} type="number" className="rounded-xl border p-3 dark:bg-gray-800" placeholder={label} value={form[key as keyof typeof form]} onChange={(event) => setForm({ ...form, [key]: Number(event.target.value) })} />
        ))}
        <button className="rounded-xl bg-primary px-4 py-3 font-semibold text-white">Simpan</button>
      </form>

      <p className="text-sm">
        Conversion Rate: <b>{cr}%</b>
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-2">Tanggal</th>
              <th>Klik</th>
              <th>Konversi</th>
              <th>CR%</th>
              <th>Komisi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-b dark:border-gray-800">
                <td className="p-2">{row.tanggal}</td>
                <td>{row.totalKlik}</td>
                <td>{row.konversi}</td>
                <td>{row.conversionRate}%</td>
                <td>{formatRupiah(row.komisiDiperoleh)}</td>
                <td>
                  <button type="button" onClick={() => handleDelete(row.id, row.tanggal)} className="rounded-lg px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label={`Hapus data ${row.tanggal}`}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {performa.length > 7 && (
        <button type="button" onClick={() => setShowAll((current) => !current)} className="text-sm font-semibold text-primary hover:text-primary-dark">
          {showAll ? 'Tampilkan 7 data terakhir' : `Lihat semua ${performa.length} data`}
        </button>
      )}
    </div>
  )
}
