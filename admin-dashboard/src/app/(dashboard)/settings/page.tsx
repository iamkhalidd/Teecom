"use client"

import { useState, useEffect, useRef } from "react"
import { Save, Store, Globe, Palette, Shield, CreditCard, Bell, Mail, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api"

const settingsTabs = [
  { id: "general", label: "General Store", icon: Store },
  { id: "profile", label: "Admin Profile", icon: Shield },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
]

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    store_name: "LUMOCART",
    store_email: "support@lumocart.com",
    store_description: "Premium eCommerce store",
    currency: "USD",
    timezone: "UTC",
  })

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    full_name: "",
    phone: "",
  })

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  })

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [generalData, profileData] = await Promise.all([
          api.admin.settings.general.get(),
          api.admin.settings.profile.get(),
        ])
        setGeneralSettings(generalData)
        setProfileSettings(profileData)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load settings:", err)
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleGeneralSave = async () => {
    setIsSaving(true)
    try {
      await api.admin.settings.general.update(generalSettings)
      alert("General settings saved successfully!")
    } catch (err: any) {
      console.error("Save error:", err)
      alert(err.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleProfileSave = async () => {
    setIsSaving(true)
    try {
      await api.admin.settings.profile.update(profileSettings)
      await refreshUser()
      alert("Profile updated successfully!")
    } catch (err: any) {
      console.error("Save error:", err)
      alert(err.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      alert("Passwords do not match")
      return
    }
    setIsSaving(true)
    try {
      await api.auth.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password_confirm: passwordData.new_password_confirm,
      })
      setPasswordData({ old_password: "", new_password: "", new_password_confirm: "" })
      alert("Password changed successfully!")
    } catch (err: any) {
      console.error("Password change error:", err)
      alert(err.message || "Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 800 * 1024) {
      alert("File size must be less than 800KB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      alert("Please select a file first")
      return
    }

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)
      const result = await api.auth.uploadAvatar(formData)
      alert("Avatar uploaded successfully!")
      await refreshUser()
      setAvatarPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err: any) {
      console.error("Upload error:", err)
      alert(err.message || "Failed to upload avatar")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>
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
                    <Input 
                      value={generalSettings.store_name}
                      onChange={(e) => setGeneralSettings({...generalSettings, store_name: e.target.value})}
                      className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Contact Email</label>
                    <Input 
                      value={generalSettings.store_email}
                      onChange={(e) => setGeneralSettings({...generalSettings, store_email: e.target.value})}
                      className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Store Description</label>
                  <textarea 
                    rows={4}
                    value={generalSettings.store_description}
                    onChange={(e) => setGeneralSettings({...generalSettings, store_description: e.target.value})}
                    className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Store Currency</label>
                    <select 
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                      className="w-full h-12 rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="AUD">AUD ($)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Timezone</label>
                    <select 
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                      className="w-full h-12 rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="UTC">UTC</option>
                      <option value="US/Eastern">Eastern Time (ET)</option>
                      <option value="US/Central">Central Time (CT)</option>
                      <option value="US/Mountain">Mountain Time (MT)</option>
                      <option value="US/Pacific">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="Europe/Paris">Paris (CET/CEST)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                      <option value="Asia/Dubai">Dubai (GST)</option>
                      <option value="Australia/Sydney">Sydney (AEDT/AEST)</option>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex justify-end">
                <Button onClick={handleGeneralSave} disabled={isSaving} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
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
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg text-4xl font-bold text-primary overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0).toUpperCase() || "A"
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-10 font-bold"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" /> Choose File
                  </Button>
                  {avatarPreview && (
                    <Button 
                      onClick={handleAvatarUpload}
                      disabled={isSaving}
                      className="ml-2 h-10 font-bold"
                    >
                      {isSaving ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name</label>
                    <Input 
                      value={profileSettings.full_name}
                      onChange={(e) => setProfileSettings({...profileSettings, full_name: e.target.value})}
                      className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Email Address</label>
                    <Input 
                      value={user?.email || ""}
                      className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                      disabled 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                  <Input 
                    value={profileSettings.phone}
                    onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                    type="tel"
                    className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                  />
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h3 className="text-lg font-bold mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Current Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        value={passwordData.old_password}
                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                        className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                      />
                    </div>
                    <div />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">New Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">Confirm Password</label>
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        value={passwordData.new_password_confirm}
                        onChange={(e) => setPasswordData({...passwordData, new_password_confirm: e.target.value})}
                        className="h-12 rounded-xl bg-secondary/50 focus:bg-white" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 flex justify-end gap-4">
                <Button 
                  onClick={handlePasswordChange} 
                  disabled={isSaving || !passwordData.old_password}
                  variant="outline"
                  className="h-12 px-8 rounded-xl font-bold"
                >
                  {isSaving ? "Updating..." : "Change Password"}
                </Button>
                <Button 
                  onClick={handleProfileSave} 
                  disabled={isSaving}
                  className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  {isSaving ? "Saving..." : <span className="flex items-center gap-2"><Save className="h-4 w-4" /> Save Profile</span>}
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
