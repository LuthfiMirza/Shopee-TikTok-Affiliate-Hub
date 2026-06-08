'use client'

import { FormEvent, useState } from 'react'
import { useTrackingStore } from '@/store/useTrackingStore'
import type { LinkAfiliasi } from '@/types'

export function AddLink() {
  const tambahLink = useTrackingStore((state) => state.tambahLink)
  const [form, setForm] = useState({
    nama: '',
    platform: 'Shopee' as LinkAfiliasi['platform'],
    url: '',
    targetKlikHarian: 100,
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const nama = form.nama.trim()
    const url = form.url.trim()
    if (!nama || !url) return

    tambahLink({
      ...form,
      nama,
      url,
      targetKlikHarian: Math.max(1, form.targetKlikHarian),
      id: crypto.randomUUID(),
      totalKlik: 0,
      createdAt: new Date().toISOString(),
    })
    setForm({ ...form, nama: '', url: '', targetKlikHarian: 100 })
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
      <input required className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Nama produk" value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} />
      <select className="rounded-xl border p-3 dark:bg-gray-800" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value as LinkAfiliasi['platform'] })}>
        <option>Shopee</option>
        <option>TikTok Shop</option>
      </select>
      <input required type="url" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="URL afiliasi" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} />
      <input type="number" min="1" step="1" className="rounded-xl border p-3 dark:bg-gray-800" aria-label="Target klik harian" value={form.targetKlikHarian} onChange={(event) => setForm({ ...form, targetKlikHarian: Math.max(1, Number(event.target.value) || 1) })} />
      <button className="rounded-xl bg-primary px-4 py-3 font-semibold text-white md:col-span-4">Simpan Link</button>
    </form>
  )
}
