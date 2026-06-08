import { create } from 'zustand'
import type { PipelineStatus, ProdukPipeline } from '@/types'
import { ambil, simpan, STORAGE_KEYS } from '@/lib/storage'

type State = {
  produk: ProdukPipeline[]
  hydrate: () => void
  simpanProduk: (item: ProdukPipeline) => void
  updateStatus: (id: string, status: PipelineStatus) => void
  updateCatatan: (id: string, catatan: string) => void
  hapusProduk: (id: string) => void
}

export const useProdukPipelineStore = create<State>((set, get) => ({
  produk: [],
  hydrate: () => set({ produk: ambil<ProdukPipeline[]>(STORAGE_KEYS.produkPipeline, []) }),
  simpanProduk: (item) => {
    const existing = get().produk.filter((produk) => produk.id !== item.id)
    const produk = [{ ...item, updatedAt: new Date().toISOString() }, ...existing]
    simpan(STORAGE_KEYS.produkPipeline, produk)
    set({ produk })
  },
  updateStatus: (id, status) => {
    const produk = get().produk.map((item) => item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item)
    simpan(STORAGE_KEYS.produkPipeline, produk)
    set({ produk })
  },
  updateCatatan: (id, catatan) => {
    const produk = get().produk.map((item) => item.id === id ? { ...item, catatan, updatedAt: new Date().toISOString() } : item)
    simpan(STORAGE_KEYS.produkPipeline, produk)
    set({ produk })
  },
  hapusProduk: (id) => {
    const produk = get().produk.filter((item) => item.id !== id)
    simpan(STORAGE_KEYS.produkPipeline, produk)
    set({ produk })
  },
}))
