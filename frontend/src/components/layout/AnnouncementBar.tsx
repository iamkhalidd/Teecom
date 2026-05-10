"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"

interface Announcement {
  id: number
  text: string
  link?: string
  background_color: string
  text_color: string
  is_active: boolean
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.content.announcements()
        const now = new Date()
        const activeOnes = (res.results || res).filter((a: any) => {
          if (!a.is_active) return false
          if (a.start_date && new Date(a.start_date) > now) return false
          if (a.end_date && new Date(a.end_date) < now) return false
          return true
        })
        setAnnouncements(activeOnes)
      } catch (error) {
        console.error("Failed to fetch announcements", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  if (loading || announcements.length === 0) return null

  const announcement = announcements[0]

  const content = (
    <div
      className="flex h-10 items-center justify-center px-4 text-center text-xs font-bold transition-all uppercase tracking-widest"
      style={{
        backgroundColor: announcement.background_color,
        color: announcement.text_color
      }}
    >
      {announcement.text}
    </div>
  )

  if (announcement.link) {
    return (
      <Link href={announcement.link} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    )
  }

  return content
}
