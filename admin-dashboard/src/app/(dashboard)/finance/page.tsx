"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  Receipt,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  Filter,
  Search,
  Download,
  Calendar,
  ChevronRight,
  Trash2
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

interface Payout {
  id: number
  payout_id: string
  amount: number
  provider: string
  status: "pending" | "completed" | "failed"
  reference: string | null
  payout_date: string | null
  created_at: string
}

interface TaxRule {
  id: number
  name: string
  rate: number
  country: string | null
  region: string | null
  is_active: boolean
}

export default function FinancePage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [taxRules, setTaxRules] = useState<TaxRule[]>([])
  const [loading, setLoading] = useState(true)

  const [newTaxRule, setNewTaxRule] = useState({
    name: "",
    rate: "",
    country: "",
    region: ""
  })
  const [isTaxDialogOpen, setIsTaxDialogOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [payoutsData, taxData] = await Promise.all([
        api.admin.payments.payouts.list(),
        api.admin.tax.rules.list()
      ])
      setPayouts(payoutsData)
      setTaxRules(taxData)
    } catch (error) {
      console.error("Failed to fetch finance data", error)
      toast.error("Failed to load finance data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTaxRule = async () => {
    try {
      await api.admin.tax.rules.create(newTaxRule)
      toast.success("Tax rule created")
      setIsTaxDialogOpen(false)
      setNewTaxRule({ name: "", rate: "", country: "", region: "" })
      fetchData()
    } catch (error) {
      toast.error("Failed to create tax rule")
    }
  }

  const deleteTaxRule = async (id: number) => {
    if (!confirm("Are you sure?")) return
    try {
      await api.admin.tax.rules.delete(id)
      toast.success("Tax rule deleted")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Tax & Payouts</h2>
          <p className="text-muted-foreground mt-1">Manage tax rules, payout history, and financial settings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Dialog open={isTaxDialogOpen} onOpenChange={setIsTaxDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tax Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tax Rule</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rule Name</label>
                  <Input
                    placeholder="e.g. Standard VAT"
                    value={newTaxRule.name}
                    onChange={e => setNewTaxRule({...newTaxRule, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input
                    type="number"
                    placeholder="15.00"
                    value={newTaxRule.rate}
                    onChange={e => setNewTaxRule({...newTaxRule, rate: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input
                      placeholder="e.g. US"
                      value={newTaxRule.country}
                      onChange={e => setNewTaxRule({...newTaxRule, country: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Region/State</label>
                    <Input
                      placeholder="e.g. CA"
                      value={newTaxRule.region}
                      onChange={e => setNewTaxRule({...newTaxRule, region: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTaxRule}>Create Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              12%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Next Payout</p>
          <h3 className="text-2xl font-bold mt-1">$4,280.50</h3>
          <p className="text-xs text-muted-foreground mt-2">Expected on Dec 28, 2024</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Tax Collected (MTD)</p>
          <h3 className="text-2xl font-bold mt-1">$842.20</h3>
          <p className="text-xs text-muted-foreground mt-2">Across 4 tax rules</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Total Payouts (YTD)</p>
          <h3 className="text-2xl font-bold mt-1">$52,140.00</h3>
          <p className="text-xs text-muted-foreground mt-2">12 successful transfers</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium">Avg. Payout</p>
          <h3 className="text-2xl font-bold mt-1">$4,345.00</h3>
          <p className="text-xs text-muted-foreground mt-2">Monthly average</p>
        </Card>
      </div>

      <Tabs defaultValue="payouts" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="payouts" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Payout History
          </TabsTrigger>
          <TabsTrigger value="taxes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Receipt className="h-4 w-4 mr-2" />
            Tax Rules
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4 mr-2" />
            Finance Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payouts">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search payouts..." className="pl-9 h-9 bg-white" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Payout ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">
                      No payout history found.
                    </td>
                  </tr>
                ) : (
                  payouts.map(payout => (
                    <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{payout.payout_id}</td>
                      <td className="px-6 py-4 font-bold">${payout.amount}</td>
                      <td className="px-6 py-4 text-sm">{payout.provider}</td>
                      <td className="px-6 py-4">
                        <Badge className={
                          payout.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                          payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                          'bg-red-100 text-red-700 hover:bg-red-100'
                        }>
                          {payout.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {payout.payout_date ? format(new Date(payout.payout_date), "PP") : format(new Date(payout.created_at), "PP")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm">
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taxRules.map(rule => (
              <Card key={rule.id} className="p-6 relative group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${rule.is_active ? 'bg-primary/5 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteTaxRule(rule.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Badge variant={rule.is_active ? "default" : "secondary"}>
                      {rule.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">{rule.name}</h3>
                <p className="text-3xl font-bold text-primary mb-4">{rule.rate}%</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">Location:</span>
                    {rule.country || "Global"} {rule.region ? `- ${rule.region}` : ""}
                  </div>
                </div>
              </Card>
            ))}

            <button
              onClick={() => setIsTaxDialogOpen(true)}
              className="h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/20 hover:bg-primary/5 transition-all group"
            >
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white shadow-sm transition-colors">
                <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary" />
              </div>
              <span className="text-sm font-bold text-gray-500 group-hover:text-primary">Add New Tax Rule</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-8 max-w-2xl">
            <h3 className="text-xl font-bold mb-6">Financial Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold">Automatic Payouts</p>
                  <p className="text-sm text-muted-foreground">Transfer funds to your bank every Monday</p>
                </div>
                <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                   <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold">Tax Inclusive Pricing</p>
                  <p className="text-sm text-muted-foreground">Show product prices with tax already included</p>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
                   <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Currency</label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>USD - US Dollar ($)</option>
                    <option>EUR - Euro (€)</option>
                    <option>GBP - British Pound (£)</option>
                  </select>
                </div>
                <Button className="w-full">Save Financial Settings</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
