import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

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

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
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

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ result: text })
  } catch (error: unknown) {
    console.error('Gemini API error:', error)

    const message = error instanceof Error ? error.message : ''

    if (message.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'API key Gemini tidak valid. Cek kembali di .env.local' },
        { status: 401 }
      )
    }

    if (message.includes('QUOTA_EXCEEDED')) {
      return NextResponse.json(
        { error: 'Kuota Gemini habis. Coba lagi besok atau upgrade plan.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Gagal memanggil AI. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
