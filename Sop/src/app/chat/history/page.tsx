"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Clock, User, Bot, Image, Trash2, Eye } from "lucide-react"

interface ChatMessage {
  id: string
  role: string
  content: string
  imageUrl?: string
  createdAt: string
}

interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

export default function ChatHistoryPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)

  useEffect(() => {
    if (session) {
      fetchChatHistory()
    }
  }, [session])

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/history')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat session?')) {
      return
    }

    try {
      const response = await fetch(`/api/chat/history/${sessionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId))
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null)
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#EE4D2D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat History</h1>
            <p className="text-gray-600">View and manage your previous SOP assistance conversations</p>
          </div>
          <button
            onClick={() => router.push('/chat')}
            className="bg-[#EE4D2D] text-white px-4 py-2 rounded-lg hover:bg-[#d63916] transition-colors flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Chat Sessions ({sessions.length})</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {sessions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No chat sessions yet</p>
                  <p className="text-sm">Start a new conversation to see it here</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSession?.id === session.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{session.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(session.updatedAt)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSession(session)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">{selectedSession.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Created: {formatDate(selectedSession.createdAt)} • 
                  Last updated: {formatDate(selectedSession.updatedAt)}
                </p>
              </div>
              <div className="max-h-[600px] overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'assistant' 
                          ? 'bg-[#EE4D2D] text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {message.role === 'assistant' ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${
                        message.role === 'assistant' ? 'text-left' : 'text-right'
                      }`}>
                        <div className={`inline-block p-3 rounded-lg ${
                          message.role === 'assistant'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {message.imageUrl && (
                            <div className="mb-2">
                              <div className="flex items-center space-x-2 text-sm opacity-75 mb-2">
                                <Image className="w-4 h-4" />
                                <span>Image attached</span>
                              </div>
                              <img
                                src={message.imageUrl}
                                alt="Uploaded"
                                className="max-w-full h-auto rounded border"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        <div className={`text-xs text-gray-400 mt-1 ${
                          message.role === 'assistant' ? 'text-left' : 'text-right'
                        }`}>
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Chat Session</h3>
                <p>Choose a session from the list to view the conversation details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

