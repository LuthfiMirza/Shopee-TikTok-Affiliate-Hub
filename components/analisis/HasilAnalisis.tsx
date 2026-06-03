'use client'
import { formatRupiah } from '@/lib/calculations'
import { useAnalisisStore } from '@/store/useAnalisisStore'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
export function HasilAnalisis() { const hasil = useAnalisisStore((s) => s.hasil); if (!hasil) return <p className="text-sm text-gray-500">Isi form untuk melihat skor dan estimasi.</p>; const variant = hasil.skor >= 80 ? 'green' : hasil.skor >= 60 ? 'amber' : 'red'; return <div className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><StatCard label="Potensi/bulan" value={formatRupiah(hasil.potensiPerBulan)} color="green" /><StatCard label="Skor Produk" value={`${hasil.skor}/100`} color={variant} /><StatCard label="Komisi/produk" value={formatRupiah(hasil.komisiPerUnit)} /></div><Badge label={hasil.skorLabel} variant={variant} /><p className="text-gray-700 dark:text-gray-300">{hasil.rekomendasi}</p></div> }
