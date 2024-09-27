import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Brainology 3.0',
  description: 'Test your color perception skills!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.className} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>{children}</body>
    </html>
  )
}
