"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, Clock, Search } from "lucide-react";

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  lastMessage: string;
  status: "active" | "completed";
}

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSessions: ChatSession[] = [
        {
          id: "1",
          userId: "agent1",
          userName: "Agent Shopee",
          userRole: "AGENT",
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          messageCount: 15,
          lastMessage:
            "Customer received damaged laptop. Evidence conclusive. Return approved.",
          status: "completed",
        },
        {
          id: "2",
          userId: "agent2",
          userName: "Agent Support",
          userRole: "AGENT",
          startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          messageCount: 8,
          lastMessage: "Analyzing counterfeit product case...",
          status: "active",
        },
        {
          id: "3",
          userId: "agent1",
          userName: "Agent Shopee",
          userRole: "AGENT",
          startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          endTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          messageCount: 22,
          lastMessage: "Wrong item return process completed. Refund processed.",
          status: "completed",
        },
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error("Failed to fetch chat sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end || new Date();
    const duration = Math.floor(
      (endTime.getTime() - start.getTime()) / (1000 * 60)
    );
    if (duration < 60) {
      return `${duration}m`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#EE4D2D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
          <p className="text-gray-600">
            Monitor agent conversations and chat sessions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by agent name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 text-gray-600 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "active" | "completed"
                )
              }
              className="px-4 text-gray-600 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] focus:border-transparent"
            >
              <option value="all">All Sessions</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-[#EE4D2D]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter((s) => s.status === "active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">45m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Sessions
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredSessions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No chat sessions found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Chat sessions will appear here once agents start conversations."}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div key={session.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[#EE4D2D] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.userName}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {session.lastMessage}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Started {formatTime(session.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Duration:{" "}
                          {formatDuration(session.startTime, session.endTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.messageCount} messages
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-[#EE4D2D] hover:text-[#d63916] text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
