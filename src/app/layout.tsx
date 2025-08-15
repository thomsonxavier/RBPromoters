import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from '@/providers/QueryProvider'

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'RBPromoters - A Real Estate & Property Management Company',
  description: 'RBPromoters is a real estate and property management company that provides a wide range of services to its clients.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${font.className} bg-white dark:bg-black antialiased`}>
        <NextTopLoader color={`var(--color-primary)`} />
        <QueryProvider>
          <ThemeProvider
            attribute='class'
            enableSystem={true}
            defaultTheme='light'>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
