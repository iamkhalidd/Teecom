"use client"

import { useState, useEffect } from "react"
import MessageBubble from "./MessageBubble"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChatWindow() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const tickets = await api.accounts.support.list()
        const ticketList = Array.isArray(tickets) ? tickets : tickets.results || []
        // Get the latest ticket's messages
        if (ticketList.length > 0) {
          const latestTicket = ticketList[0]
          const ticketMessages = latestTicket.messages || []
          setMessages(ticketMessages)
        }
      } catch (err) {
        console.error("Failed to fetch support messages", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-12 w-1/2 self-end" />
        <Skeleton className="h-12 w-3/4" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-2">No messages yet.</p>
        <p className="text-sm text-muted-foreground">
          Start a conversation by typing a message below.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 mb-20">
      <div className="flex justify-center my-4">
        <span className="text-[10px] font-bold px-3 py-1 bg-secondary rounded-lg uppercase">
          Support Chat
        </span>
      </div>
      {messages.map((msg: any) => (
        <MessageBubble
          key={msg.id}
          text={msg.message}
          time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          isSupport={msg.sender_role === 'admin' || msg.sender_role === 'support'}
        />
      ))}
    </div>
  )
}
