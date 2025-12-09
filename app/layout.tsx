"use client"

import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import WhatsAppButton from "@/components/whatsapp-button"
import PromoPopup from "@/components/promo-popup"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        {children}
        <WhatsAppButton phoneNumber="6281234567890" />
        <PromoPopup displayFrequency="always" />
        <Analytics />
      </body>
    </html>
  )
}
