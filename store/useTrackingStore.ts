import { create } from 'zustand'
import type { CatatanPerforma, LinkAfiliasi } from '@/types'
import { ambil, simpan, STORAGE_KEYS } from '@/lib/storage'

type State = {
  links: LinkAfiliasi[]
  performa: CatatanPerforma[]
  hydrate: () => void
  tambahLink: (link: LinkAfiliasi) => void
  hapusLink: (id: string) => void
  tambahPerforma: (catatan: CatatanPerforma) => void
  hapusPerforma: (id: string) => void
}

export const useTrackingStore = create<State>((set, get) => ({
  links: [],
  performa: [],
  hydrate: () =>
    set({
      links: ambil<LinkAfiliasi[]>(STORAGE_KEYS.links, []),
      performa: ambil<CatatanPerforma[]>(STORAGE_KEYS.performa, []),
    }),
  tambahLink: (link) => {
    const links = [...get().links, link]
    simpan(STORAGE_KEYS.links, links)
    set({ links })
  },
  hapusLink: (id) => {
    const links = get().links.filter((link) => link.id !== id)
    simpan(STORAGE_KEYS.links, links)
    set({ links })
  },
  tambahPerforma: (catatan) => {
    const performa = [catatan, ...get().performa].slice(0, 30)
    simpan(STORAGE_KEYS.performa, performa)
    set({ performa })
  },
  hapusPerforma: (id) => {
    const performa = get().performa.filter((catatan) => catatan.id !== id)
    simpan(STORAGE_KEYS.performa, performa)
    set({ performa })
  },
}))
