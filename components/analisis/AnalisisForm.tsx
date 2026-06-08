'use client'

import { FormEvent, useState } from 'react'
import { hitungKomisiPerUnit, hitungPotensiPerBulan, hitungSkorProduk } from '@/lib/calculations'
import { useAnalisisStore } from '@/store/useAnalisisStore'
import type { Produk } from '@/types'

const kategori = ['Kecantikan', 'Fashion', 'Makanan', 'Elektronik', 'Rumah Tangga', 'Kesehatan']
const clampNumber = (value: number, min: number, max?: number) => Math.max(min, max === undefined ? value : Math.min(max, value))

export function AnalisisForm() {
  const setAnalisis = useAnalisisStore((state) => state.setAnalisis)
  const [form, setForm] = useState({
    nama: '',
    kategori: 'Kecantikan',
    harga: 0,
    persenKomisi: 5,
    terjualPerBulan: 100,
    rating: 4.5,
    platform: 'shopee' as Produk['platform'],
  })

  const updateNumber = (key: 'harga' | 'persenKomisi' | 'terjualPerBulan' | 'rating', value: string) => {
    const numberValue = Number(value)
    const safeValue = Number.isFinite(numberValue) ? numberValue : 0
    const safeFormValue = key === 'persenKomisi'
      ? clampNumber(safeValue, 0, 100)
      : key === 'rating'
        ? clampNumber(safeValue, 0, 5)
        : clampNumber(safeValue, 0)

    setForm({ ...form, [key]: safeFormValue })
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()

    const produk: Produk = {
      ...form,
      nama: form.nama.trim(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const komisiPerUnit = hitungKomisiPerUnit(produk.harga, produk.persenKomisi)
    const potensiPerBulan = hitungPotensiPerBulan(komisiPerUnit, produk.terjualPerBulan)
    const skor = hitungSkorProduk(produk.harga, komisiPerUnit, produk.terjualPerBulan, produk.rating)

    setAnalisis(produk, { komisiPerUnit, potensiPerBulan, ...skor })
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <input required placeholder="Nama produk" className="rounded-xl border p-3 dark:bg-gray-800" value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} />
      <select className="rounded-xl border p-3 dark:bg-gray-800" value={form.kategori} onChange={(event) => setForm({ ...form, kategori: event.target.value })}>
        {kategori.map((item) => <option key={item}>{item}</option>)}
      </select>
      <input required type="number" min="0" step="1" placeholder="Harga (Rp)" className="rounded-xl border p-3 dark:bg-gray-800" value={form.harga} onChange={(event) => updateNumber('harga', event.target.value)} />
      <input required type="number" min="0" max="100" step="0.1" placeholder="Komisi (%)" className="rounded-xl border p-3 dark:bg-gray-800" value={form.persenKomisi} onChange={(event) => updateNumber('persenKomisi', event.target.value)} />
      <input required type="number" min="0" step="1" placeholder="Terjual/bulan" className="rounded-xl border p-3 dark:bg-gray-800" value={form.terjualPerBulan} onChange={(event) => updateNumber('terjualPerBulan', event.target.value)} />
      <input required type="number" min="0" max="5" step="0.1" placeholder="Rating 0-5" className="rounded-xl border p-3 dark:bg-gray-800" value={form.rating} onChange={(event) => updateNumber('rating', event.target.value)} />
      <select className="rounded-xl border p-3 dark:bg-gray-800" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value as Produk['platform'] })}>
        <option value="shopee">Shopee</option>
        <option value="tiktok">TikTok Shop</option>
        <option value="keduanya">Keduanya</option>
      </select>
      <button className="rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark md:col-span-2">Analisis Produk</button>
    </form>
  )
}
