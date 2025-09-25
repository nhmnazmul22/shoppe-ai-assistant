"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/shopee")
  }, [router])

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">S</span>
        </div>
        <p className="text-gray-600">Redirecting to Shopee SOP Assistant...</p>
      </div>
    </div>
  )
}

