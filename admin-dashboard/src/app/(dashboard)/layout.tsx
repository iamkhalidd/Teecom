"use client"

import {
  Users,
  Package,
  ShoppingBag,
  LayoutDashboard,
  BarChart2,
  Settings,
  Globe,
  LogOut,
  Ticket,
  ChevronRight,
  Search,
  Menu,
  ChevronLeft,
  X,
  Layout
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useNotifications } from "@/context/NotificationContext"
import NotificationDropdown from "@/components/navigation/NotificationDropdown"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarLinks = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "SEO", href: "/seo", icon: Globe },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Coupons", href: "/coupons", icon: Ticket },
  { name: "Designer", href: "/cms", icon: Layout },
  { name: "Shipping", href: "/shipping", icon: ShoppingBag },
  { name: "Security", href: "/security", icon: Globe },
  { name: "Revenue", href: "/analytics", icon: BarChart2 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-border/50 flex flex-col fixed h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 transition-all duration-300
          ${isCollapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="h-10 w-10 bg-primary rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-xl">L</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">LUMOCART</h1>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest whitespace-nowrap">Admin Panel</p>
            </div>
          )}
          {isMobileOpen && (
            <button
              className="lg:hidden ml-auto p-2"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 custom-scrollbar">
          <div className={`px-2 mb-4 mt-2 ${isCollapsed ? "text-center" : ""}`}>
            {!isCollapsed && <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Main Menu</div>}
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    title={isCollapsed ? link.name : ""}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                      {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
                    </div>
                    {isActive && !isCollapsed && <ChevronRight className="h-4 w-4 opacity-50" />}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className={`px-2 mb-4 ${isCollapsed ? "text-center" : ""}`}>
            {!isCollapsed && <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Preferences</div>}
            <nav className="space-y-1">
              <Link
                href="/settings"
                title={isCollapsed ? "Settings" : ""}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-4"} py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  pathname === "/settings"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`h-5 w-5 flex-shrink-0 ${pathname === "/settings" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                  {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
                </div>
                {pathname === "/settings" && !isCollapsed && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-auto border-t border-border/50 bg-gray-50/50">
          <div className={`p-4 ${isCollapsed ? "flex justify-center" : "space-y-4"}`}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                    {user.full_name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-destructive bg-destructive/5 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={logout}
                title="Logout"
                className="h-10 w-10 flex items-center justify-center rounded-xl text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center py-2 text-muted-foreground hover:text-foreground border-t border-border/50 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-border/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm shadow-black/[0.02]">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative w-48 sm:w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-secondary/50 border-none rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
            <button className="relative">
              <NotificationDropdown />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>
              )}
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
