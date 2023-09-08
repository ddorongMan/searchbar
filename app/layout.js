import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '또롱맨의 IT 어드벤처',
  description: '2022년 8월에 태어난 또롱맨의 IT 어드벤처입니다.',
  keywords: "또롱맨"
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
