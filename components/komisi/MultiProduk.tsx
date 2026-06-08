'use client'

import { FormEvent, useEffect, useState } from 'react'
import { formatRupiah, hitungKomisiTotal } from '@/lib/calculations'
import { useKomisiStore } from '@/store/useKomisiStore'

export function MultiProduk() {
  const { items, hydrate, tambah, hapus } = useKomisiStore()
  const [nama, setNama] = useState('')
  const [komisi, setKomisi] = useState(0)

  useEffect(() => hydrate(), [hydrate])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const namaProduk = nama.trim()
    if (!namaProduk) return

    tambah({ id: crypto.randomUUID(), nama: namaProduk, komisiPerBulan: Math.max(0, komisi) })
    setNama('')
    setKomisi(0)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <input required className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Nama produk" value={nama} onChange={(event) => setNama(event.target.value)} />
        <input type="number" min="0" step="1" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Komisi/bulan" value={komisi} onChange={(event) => setKomisi(Math.max(0, Number(event.target.value) || 0))} />
        <button className="rounded-xl bg-primary px-4 py-3 font-semibold text-white">Tambah</button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border p-3 dark:border-gray-700">
            <span>{item.nama}</span>
            <div className="flex items-center gap-3">
              <b>{formatRupiah(item.komisiPerBulan)}</b>
              <button onClick={() => hapus(item.id)} className="text-sm text-red-600">Hapus</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-lg font-bold">Total: {formatRupiah(hitungKomisiTotal(items))}/bulan</p>
    </div>
  )
}
