'use client'
import { useMemo, useState } from 'react'
import { promptTemplateHashtag } from '@/lib/prompts'
import { CopyButton } from '@/components/ui/CopyButton'
const kategori = ['Kecantikan', 'Fashion', 'Makanan', 'Elektronik', 'Rumah Tangga', 'Kesehatan']
export function TemplateHashtag() { const [selected, setSelected] = useState(kategori[0]); const text = useMemo(() => promptTemplateHashtag(selected), [selected]); return <div className="space-y-4"><select className="rounded-xl border p-3 dark:bg-gray-800" value={selected} onChange={(e) => setSelected(e.target.value)}>{kategori.map((k) => <option key={k}>{k}</option>)}</select><div className="flex flex-wrap gap-2">{text.split(' ').map((tag) => <span key={tag} className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary-dark">{tag}</span>)}</div><CopyButton text={text} /></div> }
