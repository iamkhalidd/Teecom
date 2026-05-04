"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function SEOFields({ model, objectId }: { model: string, objectId: number }) {
  const [meta, setMeta] = useState<any>({
    title: "",
    description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchMeta() {
      try {
        const data = await api.admin.seo.getMeta(model, objectId)
        if (data && data.title !== undefined) {
          setMeta(data)
        }
      } catch (err) {
        console.error("Failed to fetch SEO meta", err)
      } finally {
        setLoading(false)
      }
    }
    if (objectId) fetchMeta()
    else setLoading(false)
  }, [model, objectId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.admin.seo.updateMeta({
        model,
        object_id: objectId,
        metadata: meta
      })
      alert("SEO metadata updated")
    } catch (err) {
      alert("Failed to update SEO metadata")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Skeleton className="h-64 w-full rounded-2xl" />

  return (
    <div className="space-y-6 pt-6 border-t border-border/50">
      <h3 className="text-lg font-bold">Search Engine Optimization</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Meta Title</label>
            <Input
              value={meta.title || ""}
              onChange={(e) => setMeta({...meta, title: e.target.value})}
              placeholder="Primary search title"
              className="rounded-xl"
            />
            <p className="text-[10px] text-muted-foreground">Recommended: 50-60 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Meta Description</label>
            <Textarea
              value={meta.description || ""}
              onChange={(e) => setMeta({...meta, description: e.target.value})}
              placeholder="Search result snippet"
              className="rounded-xl h-24"
            />
            <p className="text-[10px] text-muted-foreground">Recommended: 150-160 characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Canonical URL</label>
            <Input
              value={meta.canonical_url || ""}
              onChange={(e) => setMeta({...meta, canonical_url: e.target.value})}
              placeholder="https://example.com/original-url"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">OG Title (Social)</label>
            <Input
              value={meta.og_title || ""}
              onChange={(e) => setMeta({...meta, og_title: e.target.value})}
              placeholder="Title for Facebook/Twitter"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">OG Description (Social)</label>
            <Textarea
              value={meta.og_description || ""}
              onChange={(e) => setMeta({...meta, og_description: e.target.value})}
              placeholder="Snippet for social sharing"
              className="rounded-xl h-24"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">OG Image URL</label>
            <Input
              value={meta.og_image || ""}
              onChange={(e) => setMeta({...meta, og_image: e.target.value})}
              placeholder="URL to social preview image"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="rounded-xl px-8 font-bold">
          {saving ? "Saving..." : "Save SEO Metadata"}
        </Button>
      </div>
    </div>
  )
}
