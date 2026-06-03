'use client'

import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { AddLink } from '@/components/tracking/AddLink'
import { CatatPerforma } from '@/components/tracking/CatatPerforma'
import { ExportCSV } from '@/components/tracking/ExportCSV'
import { GrafikPerforma } from '@/components/tracking/GrafikPerforma'
import { LinkList } from '@/components/tracking/LinkList'
import { RingkasanStatistik } from '@/components/tracking/RingkasanStatistik'
import { useTrackingStore } from '@/store/useTrackingStore'

export function TrackingOverview() {
  const { performa, hydrate } = useTrackingStore()

  useEffect(() => hydrate(), [hydrate])

  return (
    <>
      <Card title="Ringkasan Statistik">
        <RingkasanStatistik data={performa} />
      </Card>
      <GrafikPerforma data={performa} />
      <Card title="Tambah Link Afiliasi">
        <AddLink />
      </Card>
      <Card title="Daftar Link">
        <LinkList />
      </Card>
      <Card title="Catat Performa">
        <CatatPerforma />
      </Card>
      <ExportCSV data={performa} />
    </>
  )
}
