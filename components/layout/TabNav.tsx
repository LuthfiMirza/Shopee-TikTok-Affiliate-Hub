'use client'

import Link from 'next/link'

const tabs = [
  { key: 'analisis', label: 'Analisis' },
  { key: 'pipeline', label: 'Pipeline Produk' },
  { key: 'komisi', label: 'Komisi' },
  { key: 'konten', label: 'Konten AI' },
  { key: 'calendar', label: 'Kalender Konten' },
  { key: 'tracking', label: 'Tracking' },
]

export function TabNav({ active }: { active: string }) {
  return (
    <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm dark:bg-gray-900">
      {tabs.map((tab) => (
        <Link key={tab.key} href={`/dashboard?tab=${tab.key}`} className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ${active === tab.key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}>
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
