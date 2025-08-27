import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {SidebarProvider} from '@/components/ui/sidebar'
import {AppSidebar} from '@/components/app-sidebar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FC Scrape Demo',
  description: 'scrape any website with ease',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  )
}
