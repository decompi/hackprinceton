"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserScans, type Scan } from "@/lib/database"
import Image from "next/image"
import { Calendar, TrendingUp, ImageIcon, AlertCircle } from "lucide-react"

interface WeeklyTrend {
  day: string
  severity: number
}

export default function Dashboard() {
  const [scanHistory, setScanHistory] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const { user } = await getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }

        const { data, error } = await getUserScans(user.id)
        if (error) {
          throw error
        }

        if (data) {
          setScanHistory(data)
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load scans"
        setError(message)
        console.error("Error fetching scans:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchScans()
  }, [router])

  const calculateWeeklyTrend = (): WeeklyTrend[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentScans = scanHistory.filter((scan) => {
      const scanDate = new Date(scan.analysis_date)
      return scanDate >= weekAgo
    })

    const dayMap: { [key: string]: number[] } = {}
    recentScans.forEach((scan) => {
      const date = new Date(scan.analysis_date)
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]
      if (!dayMap[dayName]) {
        dayMap[dayName] = []
      }
      if (scan.confidence !== null) {
        dayMap[dayName].push(scan.confidence * 100)
      }
    })

    return days.map((day) => {
      const confidences = dayMap[day] || []
      const avgSeverity =
        confidences.length > 0 ? confidences.reduce((sum, val) => sum + val, 0) / confidences.length : 0
      return { day, severity: Math.round(avgSeverity) }
    })
  }

  const weeklyTrend = calculateWeeklyTrend()

  const getSeverityColor = (confidence: number | null) => {
    if (confidence === null) return "bg-gray-100 text-gray-800"
    const severity = confidence * 100
    if (severity < 40) return "bg-green-100 text-green-800"
    if (severity < 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getSeverityLabel = (confidence: number | null) => {
    if (confidence === null) return "unknown"
    const severity = confidence * 100
    if (severity < 40) return "mild"
    if (severity < 70) return "moderate"
    return "severe"
  }

  const maxSeverity = Math.max(...weeklyTrend.map((t) => t.severity), 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Dashboard</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-balance">Your Dashboard</h1>
          <p className="text-lg text-gray-600">Track your skin health progress</p>
        </div>

        {/* Weekly Trend Graph */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Skin This Week</h2>
              <p className="text-sm text-gray-600">Weekly severity tracking</p>
            </div>
          </div>

          <div className="h-72 flex items-end justify-between gap-3">
            {weeklyTrend.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-gray-100 rounded-lg relative overflow-hidden" style={{ height: "240px" }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500"
                    style={{ height: `${(day.severity / maxSeverity) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{day.day}</div>
                  <div className="text-xs text-gray-500">{day.severity}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scan History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ImageIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Scan History</h2>
                <p className="text-sm text-gray-600">View all your previous scans</p>
              </div>
            </div>
            <button className="px-5 py-2.5 text-sm text-blue-600 hover:text-white hover:bg-blue-600 font-medium rounded-lg border border-blue-600 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {scanHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">No scans yet</p>
                <p className="text-gray-500 text-sm">Start by uploading your first skin photo!</p>
              </div>
            ) : (
              scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 relative ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
                    <Image
                      src={scan.image_url || "/placeholder.svg"}
                      alt="Scan"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 capitalize text-lg">{scan.acne_type || "Unknown"}</h3>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getSeverityColor(scan.confidence)}`}
                      >
                        {getSeverityLabel(scan.confidence)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(scan.analysis_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {scan.confidence !== null && (
                      <p className="text-sm text-gray-500">
                        Confidence:{" "}
                        <span className="font-medium text-gray-700">{(scan.confidence * 100).toFixed(1)}%</span>
                      </p>
                    )}
                  </div>
                  <button className="px-5 py-2.5 text-sm text-blue-600 hover:text-white hover:bg-blue-600 font-medium rounded-lg border border-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}