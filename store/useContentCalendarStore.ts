import { create } from 'zustand'
import type { CalendarStatus, ContentCalendarItem } from '@/types'
import { ambil, simpan, STORAGE_KEYS } from '@/lib/storage'

type State = {
  items: ContentCalendarItem[]
  hydrate: () => void
  tambah: (item: ContentCalendarItem) => void
  updateStatus: (id: string, status: CalendarStatus) => void
  hapus: (id: string) => void
}

export const useContentCalendarStore = create<State>((set, get) => ({
  items: [],
  hydrate: () => set({ items: ambil<ContentCalendarItem[]>(STORAGE_KEYS.contentCalendar, []) }),
  tambah: (item) => {
    const items = [item, ...get().items].sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    simpan(STORAGE_KEYS.contentCalendar, items)
    set({ items })
  },
  updateStatus: (id, status) => {
    const items = get().items.map((item) => item.id === id ? { ...item, status } : item)
    simpan(STORAGE_KEYS.contentCalendar, items)
    set({ items })
  },
  hapus: (id) => {
    const items = get().items.filter((item) => item.id !== id)
    simpan(STORAGE_KEYS.contentCalendar, items)
    set({ items })
  },
}))
