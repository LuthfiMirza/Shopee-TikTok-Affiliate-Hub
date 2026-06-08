'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { useContentCalendarStore } from '@/store/useContentCalendarStore'
import type { CalendarStatus, ContentCalendarItem, JenisKonten } from '@/types'

const platforms: ContentCalendarItem['platform'][] = ['TikTok', 'Instagram', 'Shopee Video', 'WhatsApp']
const jenisKonten: JenisKonten[] = ['review', 'unboxing', 'tutorial', 'perbandingan', 'hook', 'caption']
const statuses: { key: CalendarStatus; label: string; variant: 'green' | 'amber' | 'blue' | 'gray' }[] = [
  { key: 'planned', label: 'Planned', variant: 'gray' },
  { key: 'draft', label: 'Draft', variant: 'amber' },
  { key: 'posted', label: 'Posted', variant: 'blue' },
  { key: 'reviewed', label: 'Reviewed', variant: 'green' },
]

export function ContentCalendar() {
  const { items, hydrate, tambah, updateStatus, hapus } = useContentCalendarStore()
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    produk: '',
    platform: 'TikTok' as ContentCalendarItem['platform'],
    jenisKonten: 'review' as JenisKonten,
    targetKlik: 100,
    catatan: '',
  })

  useEffect(() => hydrate(), [hydrate])

  const summary = useMemo(() => ({
    total: items.length,
    posted: items.filter((item) => item.status === 'posted' || item.status === 'reviewed').length,
    today: items.filter((item) => item.tanggal === new Date().toISOString().slice(0, 10)).length,
  }), [items])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const produk = form.produk.trim()
    if (!produk) return

    tambah({
      ...form,
      produk,
      targetKlik: Math.max(0, form.targetKlik),
      id: crypto.randomUUID(),
      status: 'planned',
      createdAt: new Date().toISOString(),
    })
    setForm({ ...form, produk: '', catatan: '', targetKlik: 100 })
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Total Rencana" value={summary.total.toLocaleString('id-ID')} />
        <StatCard label="Sudah Posting" value={summary.posted.toLocaleString('id-ID')} color="green" />
        <StatCard label="Jadwal Hari Ini" value={summary.today.toLocaleString('id-ID')} color="amber" />
      </div>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:grid-cols-3">
        <input required type="date" className="rounded-xl border p-3 dark:bg-gray-800" value={form.tanggal} onChange={(event) => setForm({ ...form, tanggal: event.target.value })} />
        <input required className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Produk / angle konten" value={form.produk} onChange={(event) => setForm({ ...form, produk: event.target.value })} />
        <select className="rounded-xl border p-3 dark:bg-gray-800" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value as ContentCalendarItem['platform'] })}>
          {platforms.map((platform) => <option key={platform}>{platform}</option>)}
        </select>
        <select className="rounded-xl border p-3 dark:bg-gray-800" value={form.jenisKonten} onChange={(event) => setForm({ ...form, jenisKonten: event.target.value as JenisKonten })}>
          {jenisKonten.map((jenis) => <option key={jenis} value={jenis}>{jenis}</option>)}
        </select>
        <input type="number" min="0" step="1" className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Target klik" value={form.targetKlik} onChange={(event) => setForm({ ...form, targetKlik: Math.max(0, Number(event.target.value) || 0) })} />
        <input className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Catatan CTA/hook" value={form.catatan} onChange={(event) => setForm({ ...form, catatan: event.target.value })} />
        <button className="rounded-xl bg-primary px-4 py-3 font-semibold text-white md:col-span-3">Tambah Jadwal Konten</button>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="rounded-xl border p-4 text-sm text-gray-500 dark:border-gray-800">Belum ada jadwal. Buat kalender konten agar posting lebih konsisten.</p>}
        {items.map((item) => {
          const status = statuses.find((option) => option.key === item.status) || statuses[0]
          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.produk}</h3>
                    <Badge label={status.label} variant={status.variant} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.tanggal} · {item.platform} · {item.jenisKonten} · target {item.targetKlik} klik</p>
                  {item.catatan && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.catatan}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <select className="rounded-lg border p-2 text-sm dark:bg-gray-800" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value as CalendarStatus)}>
                    {statuses.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
                  </select>
                  <button type="button" onClick={() => hapus(item.id)} className="text-sm font-semibold text-red-600">Hapus</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
