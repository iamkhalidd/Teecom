import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  text: string
  time: string
  isSupport: boolean
}

export default function MessageBubble({ text, time, isSupport }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col max-w-[80%]", isSupport ? "self-start" : "self-end items-end")}>
      <div
        className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isSupport ? "bg-secondary rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
        )}
      >
        {text}
      </div>
      <span className="text-[10px] text-muted-foreground mt-1">{time}</span>
    </div>
  )
}
