export default function ProductGallery() {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full overflow-hidden rounded-3xl bg-secondary">
        <div className="h-full w-full bg-zinc-200" />
      </div>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square w-20 overflow-hidden rounded-xl bg-secondary">
            <div className="h-full w-full bg-zinc-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
