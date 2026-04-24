import { Send, Paperclip } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SupportInput() {
  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-white md:relative md:p-0 md:bg-transparent">
      <div className="container mx-auto max-w-2xl flex gap-3 items-center">
        <div className="relative flex-1">
          <Input placeholder="Message..." className="h-12 pr-12 rounded-2xl bg-secondary border-none" />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Paperclip className="h-5 w-5" />
          </button>
        </div>
        <Button size="icon" className="h-12 w-12 rounded-full shrink-0">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
