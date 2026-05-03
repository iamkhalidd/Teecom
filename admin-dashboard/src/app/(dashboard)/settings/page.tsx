"use client"

import { useState } from "react"
import { Save, Store, Globe, Palette, Shield, CreditCard, Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"

const settingsTabs = [
  { id: "general", label: "General Store", icon: Store },
  { id: "profile", label: "Admin Profile", icon: Shield },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
]

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Settings saved successfully!")
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store configuration and administrative preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-border/50">
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-border/50 pb-6">
                <h2 className="text-xl font-bold">General Store Details</h2>
                <p className="text-sm text-muted-foreground mt-1">These details are displayed publicly on your storefront.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Store Name</label>
                    <Input defaultValue="LUMOCART" className="h-12 rounded-xl bg-secondary/50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Contact Email</label>
                    <Input defaultValue="support@lumocart.com" className="h-12 rounded-xl bg-secondary/50 focus:bg-white" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Store Description</label>
                  <textarea 
                    rows={4} 
                    className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="The best premium eCommerce store built with Next.js and Django."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Store Currency</label>
                    <select className="w-full h-12 rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Timezone</label>
                    <select className="w-full h-12 rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                  {isSaving ? "Saving..." : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</span>}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="border-b border-border/50 pb-6">
                <h2 className="text-xl font-bold">Admin Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your personal admin account settings.</p>
              </div>

              <div className="flex items-center gap-6 pb-6">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg text-4xl font-bold text-primary">
                  {user?.full_name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <Button variant="outline" className="rounded-xl h-10 font-bold">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name</label>
                    <Input defaultValue={user?.full_name} className="h-12 rounded-xl bg-secondary/50 focus:bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Email Address</label>
                    <Input defaultValue={user?.email} className="h-12 rounded-xl bg-secondary/50 focus:bg-white" disabled />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 mt-8">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">New Password</label>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-secondary/50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Confirm Password</label>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-secondary/50 focus:bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                  {isSaving ? "Saving..." : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Update Profile</span>}
                </Button>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {["payments", "appearance", "notifications"].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
               <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                 <Store className="h-10 w-10 text-muted-foreground" />
               </div>
               <h3 className="text-xl font-bold mb-2">Module Under Construction</h3>
               <p className="text-muted-foreground max-w-md mx-auto">
                 The {activeTab} settings module is currently being built. It will provide deep integrations to control the frontend directly from here.
               </p>
             </div>
          )}

        </div>
      </div>
    </div>
  )
}
