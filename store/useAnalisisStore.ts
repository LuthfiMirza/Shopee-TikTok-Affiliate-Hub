import { create } from 'zustand'
import type { HasilAnalisis, Produk } from '@/types'
type State = { produk?: Produk; hasil?: HasilAnalisis; setAnalisis: (produk: Produk, hasil: HasilAnalisis) => void }
export const useAnalisisStore = create<State>((set) => ({ setAnalisis: (produk, hasil) => set({ produk, hasil }) }))
