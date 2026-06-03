import { create } from 'zustand'
import type { ItemKomisi } from '@/types'
import { ambil, simpan, STORAGE_KEYS } from '@/lib/storage'
type State = { items: ItemKomisi[]; hydrate: () => void; tambah: (item: ItemKomisi) => void; hapus: (id: string) => void }
export const useKomisiStore = create<State>((set, get) => ({ items: [], hydrate: () => set({ items: ambil<ItemKomisi[]>(STORAGE_KEYS.multiproduk, []) }), tambah: (item) => { const items = [...get().items, item]; simpan(STORAGE_KEYS.multiproduk, items); set({ items }) }, hapus: (id) => { const items = get().items.filter((item) => item.id !== id); simpan(STORAGE_KEYS.multiproduk, items); set({ items }) } }))
