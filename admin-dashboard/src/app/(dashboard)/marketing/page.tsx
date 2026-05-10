"use client"

import { useState, useEffect } from "react"
import {
  Mail,
  Plus,
  Send,
  Users,
  FileText,
  History,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"

interface Template {
  id: number
  name: string
  subject: string
  body_html: string
}

interface Campaign {
  id: number
  name: string
  template: number
  template_name: string
  status: "draft" | "scheduled" | "sending" | "sent" | "failed"
  segment: string
  sent_at: string | null
  created_at: string
}

export default function MarketingPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  // Create Campaign Form
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    template: "",
    segment: "all_customers"
  })
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)

  // Create Template Form
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body_html: ""
  })
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [templatesData, campaignsData] = await Promise.all([
        api.admin.marketing.templates.list(),
        api.admin.marketing.campaigns.list()
      ])
      setTemplates(templatesData)
      setCampaigns(campaignsData)
    } catch (error) {
      toast.error("Failed to load marketing data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      await api.admin.marketing.templates.create(newTemplate)
      toast.success("Template created")
      setIsTemplateDialogOpen(false)
      setNewTemplate({ name: "", subject: "", body_html: "" })
      fetchData()
    } catch (error) {
      toast.error("Failed to create template")
    }
  }

  const handleCreateCampaign = async () => {
    try {
      await api.admin.marketing.campaigns.create(newCampaign)
      toast.success("Campaign created")
      setIsCampaignDialogOpen(false)
      setNewCampaign({ name: "", template: "", segment: "all_customers" })
      fetchData()
    } catch (error) {
      toast.error("Failed to create campaign")
    }
  }

  const sendCampaign = async (id: number) => {
    if (!confirm("Are you sure you want to send this campaign now?")) return

    try {
      toast.info("Sending campaign...")
      const res = await api.admin.marketing.campaigns.send(id)
      toast.success(res.message || "Campaign sent")
      fetchData()
    } catch (error: any) {
      toast.error(error.message || "Failed to send campaign")
    }
  }

  const deleteCampaign = async (id: number) => {
    if (!confirm("Are you sure?")) return
    try {
      await api.admin.marketing.campaigns.delete(id)
      toast.success("Campaign deleted")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sent</Badge>
      case "sending":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 animate-pulse">Sending</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Email & CRM</h2>
          <p className="text-muted-foreground mt-1">Manage customer communication and marketing campaigns.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Email Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <Input
                    placeholder="e.g. Welcome Email"
                    value={newTemplate.name}
                    onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input
                    placeholder="e.g. Welcome to our store!"
                    value={newTemplate.subject}
                    onChange={e => setNewTemplate({...newTemplate, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Content (HTML)</label>
                  <Textarea
                    placeholder="<h1>Hello {{name}}!</h1>"
                    className="min-h-[200px]"
                    value={newTemplate.body_html}
                    onChange={e => setNewTemplate({...newTemplate, body_html: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Marketing Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input
                    placeholder="e.g. Summer Sale 2024"
                    value={newCampaign.name}
                    onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Template</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newCampaign.template}
                    onChange={e => setNewCampaign({...newCampaign, template: e.target.value})}
                  >
                    <option value="">Select a template...</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Segment</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newCampaign.segment}
                    onChange={e => setNewCampaign({...newCampaign, segment: e.target.value})}
                  >
                    <option value="all_customers">All Customers</option>
                    <option value="newsletter_subscribers">Newsletter Subscribers</option>
                    <option value="test">Test (Send to me only)</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCampaign}>Create Campaign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Mail className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Mail className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No campaigns created yet.</p>
                <Button variant="link" onClick={() => setIsCampaignDialogOpen(true)}>Create your first campaign</Button>
              </div>
            ) : (
              campaigns.map(campaign => (
                <Card key={campaign.id} className="p-6 overflow-hidden relative group">
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(campaign.status)}
                    <button onClick={() => deleteCampaign(campaign.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold mb-1 truncate">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Template: <span className="font-medium text-foreground">{campaign.template_name}</span></p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {campaign.segment.replace('_', ' ')}
                    </div>
                    {campaign.sent_at && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        {format(new Date(campaign.sent_at), "MMM d")}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    {campaign.status === 'sent' ? (
                      <Button variant="secondary" className="w-full" disabled>
                        Already Sent
                      </Button>
                    ) : (
                      <Button onClick={() => sendCampaign(campaign.id)} className="w-full shadow-lg shadow-primary/10">
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <Card key={template.id} className="p-6 hover:border-primary/20 transition-colors">
                <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{template.subject}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1">
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs">
           <Card className="p-0 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-gray-50 border-b border-gray-100">
                 <tr>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Campaign</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Segment</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                   <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {campaigns.filter(c => c.status === 'sent').map(campaign => (
                   <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4 font-medium">{campaign.name}</td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-green-500" />
                         <span className="text-sm font-medium">Sent</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">{campaign.segment}</td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">
                       {campaign.sent_at ? format(new Date(campaign.sent_at), "PPp") : "-"}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <Button size="sm" variant="ghost">
                         Report
                         <ArrowRight className="h-4 w-4 ml-2" />
                       </Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
