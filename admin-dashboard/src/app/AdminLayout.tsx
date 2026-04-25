import {
  Users,
  Package,
  ShoppingBag,
  LayoutDashboard,
  BarChart2,
  Settings,
  LogOut,
  Ticket
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarLinks = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Coupons", href: "/coupons", icon: Ticket },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-xl font-bold tracking-tight">LUMOCART</h1>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-8 border-t border-border">
          <button className="flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
