import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProviderNew } from '@/components/AuthProviderNew'
import { NoSSR } from '@/components/NoSSR'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TalentAI - Smart Hiring Assistant',
  description: 'AI-powered tool that screens and ranks job applicants to help recruiters hire faster and smarter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NoSSR fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
          </div>}>
            <AuthProviderNew>
            <div className="min-h-screen bg-dark-900 text-white">
              <div className="fixed inset-0 bg-hero-glow pointer-events-none" />
              <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-purple/10 via-transparent to-transparent pointer-events-none" />
              <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-pink/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <Navbar />
                <main>{children}</main>
              </div>
            </div>
          </AuthProviderNew>
          </NoSSR>
        </ThemeProvider>
      </body>
    </html>
  )
}
