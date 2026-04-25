"use client"

import { AuthProvider } from "@/context/AuthContext"
import { Inter } from "next/font/google"
import "./globals.css"
import AdminLayout from "./AdminLayout"

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
          <AdminLayout>
            {children}
          </AdminLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
