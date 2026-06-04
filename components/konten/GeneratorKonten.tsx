'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/ui/CopyButton'
import { promptGeneratorKonten } from '@/lib/prompts'
import type { GeneratorConfig, JenisKonten } from '@/types'

const jenis: JenisKonten[] = ['review', 'unboxing', 'tutorial', 'perbandingan', 'hook', 'caption']
const audiens = ['Remaja 17-22', 'Dewasa 23-35', 'Ibu rumah tangga', 'Pria muda']

export function GeneratorKonten() {
  const [config, setConfig] = useState<GeneratorConfig>({
    produk: '',
    jenisKonten: 'review',
    targetAudiens: audiens[0],
    poinUtama: '',
  })
  const [prompt, setPrompt] = useState('')
  const [hasil, setHasil] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const buatPrompt = () => setPrompt(promptGeneratorKonten(config))

  const generate = async () => {
    const nextPrompt = prompt || promptGeneratorKonten(config)
    setPrompt(nextPrompt)
    setLoading(true)
    setError('')
    setHasil('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: nextPrompt }),
      })
      const data = await response.json()

      if (response.status === 429) {
        throw new Error('Terlalu banyak request, tunggu 1 menit')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Gagal generate konten')
      }

      setHasil(data.result || '')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Gagal generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Nama/deskripsi produk" value={config.produk} onChange={(event) => setConfig({ ...config, produk: event.target.value })} />
        <select className="rounded-xl border p-3 dark:bg-gray-800" value={config.jenisKonten} onChange={(event) => setConfig({ ...config, jenisKonten: event.target.value as JenisKonten })}>
          {jenis.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select className="rounded-xl border p-3 dark:bg-gray-800" value={config.targetAudiens} onChange={(event) => setConfig({ ...config, targetAudiens: event.target.value })}>
          {audiens.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <textarea className="rounded-xl border p-3 dark:bg-gray-800" placeholder="Poin utama (opsional)" value={config.poinUtama} onChange={(event) => setConfig({ ...config, poinUtama: event.target.value })} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={buatPrompt} className="rounded-xl border px-4 py-2 font-semibold">Buat Prompt</button>
        <button onClick={generate} className="rounded-xl bg-primary px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
          {loading ? 'Generating...' : 'Generate dengan AI'}
        </button>
      </div>
      {prompt && (
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap rounded-xl bg-gray-100 p-4 text-sm dark:bg-gray-800">{prompt}</pre>
          <CopyButton text={prompt} size="sm" />
        </div>
      )}
      {loading && <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {hasil && (
        <div className="space-y-2">
          <div className="whitespace-pre-wrap rounded-xl border p-4 dark:border-gray-700">{hasil}</div>
          <CopyButton text={hasil} size="sm" />
        </div>
      )}
    </div>
  )
}
