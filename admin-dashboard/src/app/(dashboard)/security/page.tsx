"use client"

import { useState, useEffect, useCallback } from "react"
import { Shield, Key, History, Smartphone, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"

export default function SecurityPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [showDisable2FA, setShowDisable2FA] = useState(false)
  const [setupData, setSetupData] = useState<any>(null)
  const [otpCode, setOtpCode] = useState("")
  const [password, setPassword] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])

  const fetchAuditLogs = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const data = await api.admin.users.auditLogs()
      setLogs(data.results || data)
    } catch (err) {
      console.error("Failed to fetch audit logs", err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  const fetchSessions = useCallback(async () => {
    try {
      const data = await api.admin.users.sessions()
      setSessions(data)
    } catch (err) {
      console.error("Failed to fetch sessions", err)
    }
  }, [])

  useEffect(() => {
    fetchAuditLogs()
    fetchSessions()
  }, [fetchAuditLogs, fetchSessions])

  const handleStart2FASetup = async () => {
    try {
      const data = await api.admin.users.setup2FA()
      setSetupData(data)
      setShow2FASetup(true)
    } catch (err) {
      alert("Failed to start 2FA setup")
    }
  }

  const handleVerify2FA = async () => {
    try {
      await api.admin.users.verify2FA({ code: otpCode, password })
      setShow2FASetup(false)
      window.location.reload()
    } catch (err: any) {
      alert(err.message || "Invalid code or password")
    }
  }

  const handleRevokeSession = async (id: number) => {
    if (confirm("Revoke this session? You will be logged out on that device.")) {
      try {
        await api.admin.users.revokeSession(id)
        fetchSessions()
      } catch (err) {
        alert("Failed to revoke session")
      }
    }
  }

  const handleLogoutOthers = async () => {
    if (confirm("Logout from all other devices?")) {
      try {
        await api.admin.users.logoutOthers()
        fetchSessions()
      } catch (err) {
        alert("Failed to logout from other devices")
      }
    }
  }

  const handleDisable2FA = async () => {
    try {
      await api.admin.users.disable2FA({ password })
      setShowDisable2FA(false)
      window.location.reload()
    } catch (err: any) {
      alert(err.message || "Invalid password")
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security & Privacy</h1>
        <p className="text-muted-foreground">Manage your account security and monitor activity.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Smartphone className="h-4 w-4 mr-2" /> Sessions
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="h-4 w-4 mr-2" /> Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${user?.two_factor_enabled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                       <Smartphone className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">Two-Factor Authentication</CardTitle>
                  </div>
                  <CardDescription>Add an extra layer of security to your account by requiring a verification code from your mobile device.</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 mb-6">
                     <div className="flex items-center gap-3">
                        {user?.two_factor_enabled ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
                        <span className="font-bold text-sm">{user?.two_factor_enabled ? 'Active' : 'Not Enabled'}</span>
                     </div>
                     <Badge variant={user?.two_factor_enabled ? 'default' : 'secondary'} className="rounded-full">
                        {user?.two_factor_enabled ? 'Highly Secure' : 'At Risk'}
                     </Badge>
                  </div>
                  {user?.two_factor_enabled ? (
                    <Button variant="outline" className="w-full rounded-xl text-destructive hover:bg-destructive/10 border-none font-bold" onClick={() => setShowDisable2FA(true)}>
                       Disable Two-Factor Authentication
                    </Button>
                  ) : (
                    <Button className="w-full rounded-xl font-bold shadow-lg shadow-primary/20" onClick={handleStart2FASetup}>
                       Enable 2FA Protection
                    </Button>
                  )}
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
               <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <Key className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">Password Management</CardTitle>
                  </div>
                  <CardDescription>Ensure your account is using a strong, unique password to prevent unauthorized access.</CardDescription>
               </CardHeader>
               <CardContent className="p-8 pt-4">
                  <p className="text-sm text-muted-foreground mb-6">Last changed: 3 months ago</p>
                  <Button variant="outline" className="w-full rounded-xl border-none bg-muted/50 font-bold">
                     Update Password
                  </Button>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Active Sessions</h2>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-none font-bold" onClick={handleLogoutOthers}>
               Logout from all other devices
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                       <Smartphone className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">Active JWT Session</p>
                        {session.id === sessions[0]?.id && (
                          <Badge className="bg-success/10 text-success border-none text-[10px] uppercase px-2 py-0">Current Session</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Expires: {new Date(session.expires_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {session.id !== sessions[0]?.id && (
                    <Button variant="ghost" size="sm" className="text-destructive font-bold text-xs" onClick={() => handleRevokeSession(session.id)}>
                      Revoke
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold">System Audit Logs</h2>
             <Button variant="ghost" size="sm" className="gap-2" onClick={fetchAuditLogs} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
             </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="p-4 font-semibold text-sm">Action</th>
                  <th className="p-4 font-semibold text-sm">User</th>
                  <th className="p-4 font-semibold text-sm">Details</th>
                  <th className="p-4 font-semibold text-sm">IP Address</th>
                  <th className="p-4 font-semibold text-sm">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-muted/5">
                      <td className="p-4">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold bg-primary/5 text-primary border-primary/10">
                          {log.action_type.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-medium">{log.user_email || 'System'}</td>
                      <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{log.description}</td>
                      <td className="p-4 text-sm font-mono text-xs">{log.ip_address || 'N/A'}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FASetup} onOpenChange={setShow2FASetup}>
        <DialogContent className="rounded-[2.5rem] bg-white p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Setup 2FA</DialogTitle>
            <DialogDescription>Scan the QR code below with your authenticator app.</DialogDescription>
          </DialogHeader>
          {setupData && (
            <div className="space-y-6 py-4 flex flex-col items-center">
              <div className="bg-white p-4 rounded-3xl border border-border shadow-inner">
                 <img src={setupData.qr_code} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <div className="w-full space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Manual Key</p>
                   <code className="text-sm font-bold tracking-widest">{setupData.secret}</code>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Verification Code</label>
                  <Input
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="rounded-xl h-12 text-center text-xl tracking-[0.5em] font-bold"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl h-12"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShow2FASetup(false)}>Cancel</Button>
            <Button onClick={handleVerify2FA} className="px-8 rounded-xl font-bold">Verify & Enable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisable2FA} onOpenChange={setShowDisable2FA}>
        <DialogContent className="rounded-[2.5rem] bg-white p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-destructive">Disable 2FA</DialogTitle>
            <DialogDescription>To disable two-factor authentication, please confirm your password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Your Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>
            <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-start gap-3">
               <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
               <p className="text-xs text-destructive font-medium leading-relaxed">Disabling 2FA makes your account more vulnerable. We recommend keeping it enabled.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDisable2FA(false)}>Cancel</Button>
            <Button onClick={handleDisable2FA} variant="destructive" className="px-8 rounded-xl font-bold">Confirm Disable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
