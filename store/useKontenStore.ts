import { create } from 'zustand'
type State = { prompt: string; hasil: string; setPrompt: (prompt: string) => void; setHasil: (hasil: string) => void }
export const useKontenStore = create<State>((set) => ({ prompt: '', hasil: '', setPrompt: (prompt) => set({ prompt }), setHasil: (hasil) => set({ hasil }) }))
