"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ProductGallery({ images }: { images: any[] }) {
  const [activeImage, setActiveImage] = useState(0)

  if (!images || images.length === 0) {
    return <div className="aspect-square w-full rounded-3xl bg-muted" />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full overflow-hidden rounded-[2.5rem] bg-[#EFEFEF]">
        <img
          src={images[activeImage].image_url}
          alt="Product"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={cn(
              "h-20 w-20 overflow-hidden rounded-2xl bg-[#EFEFEF] border-2 transition-all",
              activeImage === i ? "border-primary" : "border-transparent"
            )}
          >
            <img src={img.image_url} alt={`Thumbnail ${i}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
