"use client"

import { useEffect, useState } from "react"
import { FileText, MessageSquare, Users, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalSops: number
  totalCategories: number
  totalChats: number
  activeUsers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSops: 0,
    totalCategories: 0,
    totalChats: 0,
    activeUsers: 0
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const statCards = [
    {
      title: "Total SOPs",
      value: stats.totalSops,
      icon: FileText,
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Users,
      color: "bg-green-500",
      change: "+5%"
    },
    {
      title: "Chat Sessions",
      value: stats.totalChats,
      icon: MessageSquare,
      color: "bg-purple-500",
      change: "+23%"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+8%"
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Shopee SOP Assistant Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/sops/new"
              className="block w-full text-left px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="font-medium">Create New SOP</div>
              <div className="text-sm text-orange-600">Add a new standard operating procedure</div>
            </a>
            <a
              href="/admin/categories"
              className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="font-medium">Manage Categories</div>
              <div className="text-sm text-blue-600">Organize SOP categories</div>
            </a>
            <a
              href="/admin/chats"
              className="block w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="font-medium">View Chat History</div>
              <div className="text-sm text-purple-600">Monitor agent conversations</div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New SOP created</p>
                <p className="text-xs text-gray-500">Damaged Item Return Process</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Agent chat session</p>
                <p className="text-xs text-gray-500">Counterfeit product case resolved</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">SOP updated</p>
                <p className="text-xs text-gray-500">Wrong Item Return Process v2.1</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

