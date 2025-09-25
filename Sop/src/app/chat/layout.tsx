"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LogOut, User, History } from "lucide-react"
import Image from "next/image"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/shopee")
      return
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

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Logo responsive */}
              <Image 
                src="/shopee-logo-final.png"
                alt="SOP Assistant"
                width={48}
                height={48}
                className="h-8 w-auto sm:h-10 md:h-12 object-contain"
                priority
              />
              <div>
                <h1 className="text-xl font-bold text-[#EE4D2D] leading-tight">
                  SOP Assistant
                </h1>
                <p className="text-xs text-gray-500">Return &amp; Refund Support</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/chat/history')}
                className="flex items-center gap-2 text-gray-600 hover:text-[#EE4D2D] transition-colors"
              >
                <History className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Chat History</span>
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="truncate max-w-[10rem] sm:max-w-[14rem]">{session.user.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {session.user.role}
                </span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/shopee" })}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
