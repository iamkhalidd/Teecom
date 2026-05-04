"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Globe, Link as LinkIcon, Plus, Trash2, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function SEOPage() {
  const [redirects, setRedirects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newRedirect, setNewRedirect] = useState({ source_path: "", destination_path: "", type: 301 })
  const [showAddRedirect, setShowAddRedirect] = useState(false)

  const fetchRedirects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.admin.seo.redirects.list()
      setRedirects(data)
    } catch (err) {
      console.error("Failed to fetch redirects", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRedirects()
  }, [fetchRedirects])

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.admin.seo.redirects.create(newRedirect)
      setNewRedirect({ source_path: "", destination_path: "", type: 301 })
      setShowAddRedirect(false)
      fetchRedirects()
    } catch (err) {
      alert("Failed to create redirect. Path might already exist.")
    }
  }

  const handleDeleteRedirect = async (id: number) => {
    if (confirm("Delete this redirect?")) {
      try {
        await api.admin.seo.redirects.delete(id)
        fetchRedirects()
      } catch (err) {
        alert("Failed to delete redirect")
      }
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SEO Manager</h1>
        <p className="text-muted-foreground">Manage search engine optimization and URL redirects.</p>
      </div>

      <Tabs defaultValue="redirects" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="redirects" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LinkIcon className="h-4 w-4 mr-2" /> URL Redirects
          </TabsTrigger>
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Globe className="h-4 w-4 mr-2" /> Site Visibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="redirects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Redirects</h2>
            <Button onClick={() => setShowAddRedirect(true)} className="rounded-xl gap-2">
              <Plus className="h-4 w-4" /> Add Redirect
            </Button>
          </div>

          {showAddRedirect && (
            <Card className="border-none shadow-md bg-white p-6 animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleAddRedirect} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Source Path (Old)</label>
                    <Input
                      placeholder="/old-product-slug"
                      value={newRedirect.source_path}
                      onChange={(e) => setNewRedirect({...newRedirect, source_path: e.target.value})}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Destination Path (New)</label>
                    <Input
                      placeholder="/products/new-slug"
                      value={newRedirect.destination_path}
                      onChange={(e) => setNewRedirect({...newRedirect, destination_path: e.target.value})}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setShowAddRedirect(false)}>Cancel</Button>
                  <Button type="submit" className="px-8 rounded-xl">Create Redirect</Button>
                </div>
              </form>
            </Card>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="p-4 font-semibold text-sm">Source Path</th>
                  <th className="p-4 font-semibold text-sm">Destination Path</th>
                  <th className="p-4 font-semibold text-sm">Type</th>
                  <th className="p-4 font-semibold text-sm text-center">Hits</th>
                  <th className="p-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ))
                ) : redirects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      No redirects configured.
                    </td>
                  </tr>
                ) : (
                  redirects.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-muted/10">
                      <td className="p-4 font-medium text-sm">{r.source_path}</td>
                      <td className="p-4 text-sm text-muted-foreground">{r.destination_path}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">
                          {r.type}
                        </Badge>
                      </td>
                      <td className="p-4 text-center text-sm font-bold">{r.hit_count}</td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteRedirect(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-success" /> Sitemap Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex justify-between items-center">
                    <span className="text-sm font-medium">Sitemap URL</span>
                    <span className="text-xs text-primary font-bold">/sitemap.xml</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Your sitemap is automatically generated every 24 hours.</p>
                  <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-xs">Regenerate Now</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" /> SEO Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Products with Meta Description</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success w-[85%] rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Categories with OG Images</span>
                      <span className="font-bold">40%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-warning w-[40%] rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
