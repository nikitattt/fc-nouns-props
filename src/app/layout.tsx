import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Upload to Ipfs',
  description: 'Get some image saved to ipfs and share it with others',
  icons: {
    icon: '/icon/icon.png',
    apple: [
      { url: '/icon/apple-icon.png' },
      {
        url: '/icon/apple-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'apple-icon-precomposed',
        url: '/icon/apple-icon-precomposed.png'
      }
    ]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
