export async function generateAI(prompt: string): Promise<string> {
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

  return data.result
}
