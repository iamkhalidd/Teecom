import MessageBubble from "./MessageBubble"

const messages = [
  { text: "Hello, good morning", time: "09:41", isSupport: true },
  { text: "I am a Customer Service, is there anything I can help you with?", time: "09:41", isSupport: true },
  { text: "Hi, I'm having problems with my order & payment", time: "09:41", isSupport: false },
  { text: "Can you help me?", time: "09:41", isSupport: false },
  { text: "Of course...", time: "09:41", isSupport: true },
  { text: "Can you tell me the problem you are having? so I can help solve it 😊", time: "10:00", isSupport: true },
]

export default function ChatWindow() {
  return (
    <div className="flex flex-col gap-4 mb-20">
      <div className="flex justify-center my-4">
        <span className="text-[10px] font-bold px-3 py-1 bg-secondary rounded-lg uppercase">Today</span>
      </div>
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} {...msg} />
      ))}
    </div>
  )
}
