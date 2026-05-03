"use client"

import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
