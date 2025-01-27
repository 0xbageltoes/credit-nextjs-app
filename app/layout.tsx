import './globals.css'
import { Inter } from 'next/font/google'
import SupabaseProvider from '@/components/providers/supabase-provider'
import ClientProvider from '@/components/providers/client-provider'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'User Profile Management',
  description: 'Manage your user profile and settings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <ClientProvider>
            {children}
          </ClientProvider>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}
