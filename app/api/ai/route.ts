import { NextRequest, NextResponse } from 'next/server'

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

const SYSTEM_INSTRUCTION = `Kamu adalah asisten afiliasi Shopee dan TikTok Shop yang berpengalaman di Indonesia.
Selalu jawab dalam Bahasa Indonesia yang natural, santai, dan mudah dipahami.
Fokus pada tips praktis yang langsung bisa diterapkan oleh afiliator pemula maupun profesional.
Hindari bahasa yang terlalu formal atau kaku.`

const requestLog: number[] = []
const RATE_LIMIT = 15
const WINDOW_MS = 60 * 1000

function checkRateLimit(): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  while (requestLog.length > 0 && requestLog[0] < windowStart) {
    requestLog.shift()
  }

  if (requestLog.length >= RATE_LIMIT) return false

  requestLog.push(now)
  return true
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Gagal memanggil AI. Silakan coba lagi.'
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key Gemini belum dikonfigurasi. Isi GOOGLE_GEMINI_API_KEY di .env.local' },
        { status: 500 }
      )
    }

    if (!checkRateLimit()) {
      return NextResponse.json(
        { error: 'Terlalu banyak request. Tunggu 1 menit lalu coba lagi.' },
        { status: 429 }
      )
    }

    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong' }, { status: 400 })
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: 'Prompt terlalu panjang (max 2000 karakter)' }, { status: 400 })
    }

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const message = data?.error?.message || 'Gagal memanggil AI. Silakan coba lagi.'

      if (message.includes('API key not valid') || message.includes('API_KEY_INVALID')) {
        return NextResponse.json(
          { error: 'API key Gemini tidak valid. Cek kembali di .env.local' },
          { status: 401 }
        )
      }

      if (message.includes('quota') || message.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { error: 'Kuota Gemini habis. Coba lagi besok atau upgrade plan.' },
          { status: 429 }
        )
      }

      console.error('Gemini REST API error:', data)
      return NextResponse.json({ error: message }, { status: response.status })
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim()

    return NextResponse.json({ result: text || 'AI tidak mengembalikan teks. Coba ulangi prompt.' })
  } catch (error) {
    console.error('Gemini REST route error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    )
  }
}
