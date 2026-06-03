import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Affiliate Hub', description: 'Shopee & TikTok Affiliate Hub untuk afiliator Indonesia' }
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="id"><body className="min-h-screen bg-[#F9FAFB] text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">{children}</body></html> }
