"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Settings,
  FileText,
  Users,
  LogOut,
  BarChart3,
  MessageSquare,
  Menu,
  X,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/shopee")
      return
    }
    if (session?.user?.role !== "ADMIN") {
      router.push("/chat")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#EE4D2D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== "ADMIN") return null

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "SOP Management", href: "/admin/sops", icon: FileText },
    { name: "Categories", href: "/admin/categories", icon: Settings },
    { name: "Chat History", href: "/admin/chats", icon: MessageSquare },
    // contoh: { name: "Users", href: "/admin/users", icon: Users },
  ]

  const NavLink = ({
    href,
    name,
    Icon,
  }: {
    href: string
    name: string
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  }) => {
    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          active
            ? "bg-orange-100 text-[#EE4D2D] font-medium"
            : "text-gray-700 hover:bg-orange-50 hover:text-[#EE4D2D]"
        }`}
        onClick={() => setOpen(false)}
      >
        <Icon className="w-5 h-5" />
        <span>{name}</span>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar (mobile) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Image
              src="/shopee-logo-final.png"
              alt="Admin Panel"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
            <span className="font-semibold text-[#EE4D2D]">Admin Panel</span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/shopee" })}
            className="text-gray-600 hover:text-red-600"
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {/* overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Image
              src="/shopee-logo-final.png"
              alt="Shopee"
              width={48}
              height={48}
              className="h-10 w-auto md:h-12 object-contain rounded-lg shadow-sm"
              priority
            />
            <div>
              <div className="text-lg font-bold text-[#EE4D2D] leading-tight">Admin Panel</div>
              <div className="text-xs text-gray-500">SOP Management</div>
            </div>
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink href={item.href} name={item.name} Icon={item.icon} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/shopee" })}
            className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
