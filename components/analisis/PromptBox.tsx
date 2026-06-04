'use client'

import { useMemo, useState } from 'react'
import { CopyButton } from '@/components/ui/CopyButton'
import { promptAnalisisProduk } from '@/lib/prompts'
import { useAnalisisStore } from '@/store/useAnalisisStore'

export function PromptBox() {
  const produk = useAnalisisStore((state) => state.produk)
  const prompt = useMemo(() => (produk ? promptAnalisisProduk(produk) : ''), [produk])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const ask = async () => {
    setLoading(true)
    setResult('')
    setError('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()

      if (response.status === 429) {
        throw new Error('Terlalu banyak request, tunggu 1 menit')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memanggil AI')
      }

      setResult(data.result || '')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Gagal memanggil AI')
    } finally {
      setLoading(false)
    }
  }

  if (!produk) {
    return <p className="text-sm text-gray-500">Prompt AI akan muncul setelah analisis.</p>
  }

  return (
    <div className="space-y-3">
      <pre className="whitespace-pre-wrap rounded-xl bg-gray-100 p-4 text-sm dark:bg-gray-800">{prompt}</pre>
      <div className="flex flex-wrap gap-2">
        <CopyButton text={prompt} />
        <button onClick={ask} className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          Tanya AI Langsung
        </button>
      </div>
      {loading && <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <div className="whitespace-pre-wrap rounded-xl border p-4 text-sm dark:border-gray-700">{result}</div>}
      <p className="text-xs text-gray-500">Jika API key belum tersedia, copy prompt ini ke ChatGPT/Gemini gratis secara manual.</p>
    </div>
  )
}
