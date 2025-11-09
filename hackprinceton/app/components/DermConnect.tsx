"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { Dermatologist } from "@/lib/supabaseClient"
import { getCurrentUser } from "@/lib/auth"
import { createAppointment } from "@/lib/database"
import { sendAppointmentConfirmation } from "@/lib/email"
import usStates from "us-state-codes"

interface DermConnectProps {
  dermatologists: Dermatologist[]
}

export default function DermConnect({ dermatologists }: DermConnectProps) {
  const [selectedDerm, setSelectedDerm] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    reason: "",
  })

  const [filters, setFilters] = useState({
    location: "",
    availability: "all",
    sortBy: "name",
  })

  const filteredAndSortedDermatologists = useMemo(() => {
    let filtered = [...dermatologists]

    if (filters.location.trim()) {
      const query = filters.location.trim().toLowerCase()

      filtered = filtered.filter((derm) => {
        const rawLoc = derm.location || ""
        let locExtended = rawLoc.toLowerCase()

        const match = rawLoc.match(/,\s*([A-Za-z]{2})\b/)
        if (match) {
          const code = match[1].toUpperCase()
          const fullName = usStates.getStateNameByStateCode(code)
          if (fullName) {
            locExtended += " " + fullName.toLowerCase()
          }
        }

        return locExtended.includes(query)
      })
    }

    if (filters.availability !== "all") {
      filtered = filtered.filter((derm) => {
        const loc = derm.location?.toLowerCase() || ""
        const isTelehealth = loc.includes("telehealth") || loc.includes("online")
        return filters.availability === "telehealth" ? isTelehealth : !isTelehealth
      })
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === "name") return a.name.localeCompare(b.name)
      if (filters.sortBy === "location") return (a.location || "").localeCompare(b.location || "")
      return 0
    })

    return filtered
  }, [dermatologists, filters])

  const selectedDermatologist = selectedDerm ? dermatologists.find((d) => d.id === selectedDerm) : null

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { user } = await getCurrentUser()
      if (!user) {
        router.push("/login")
        return
      }

      if (!selectedDerm) {
        throw new Error("No dermatologist selected")
      }

      const scheduledAt = new Date(`${bookingData.date}T${bookingData.time}`).toISOString()
      const scanId = sessionStorage.getItem("scanId") || null

      const { data, error } = await createAppointment(user.id, selectedDerm, scanId, scheduledAt)

      if (error) {
        throw error
      }

      if (data) {
        sendAppointmentConfirmation({
          appointmentId: data.id,
          userId: user.id,
          dermatologistId: selectedDerm,
          scheduledAt: scheduledAt,
          reason: bookingData.reason,
        }).catch((err) => {
          console.error("Failed to send confirmation email:", err)
        })

        alert("Appointment booked successfully! A confirmation email has been sent to your email address.")
        setShowBookingForm(false)
        setBookingData({ date: "", time: "", reason: "" })
        setSelectedDerm(null)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to book appointment"
      setError(msg)
      console.error("Booking error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (dermId: string) => {
    setSelectedDerm(dermId)
    setShowBookingForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-balance">
            Connect with Expert Dermatologists
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Book an appointment with board-certified dermatologists specializing in acne treatment and skin care
          </p>
        </div>

        {!showBookingForm ? (
          <>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Filter Dermatologists</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      Location
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Search by city or state..."
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Availability
                    </span>
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Options</option>
                    <option value="telehealth">Telehealth Only</option>
                    <option value="in-person">In-Person Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        />
                      </svg>
                      Sort By
                    </span>
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-sm font-medium text-gray-700">
                    Showing{" "}
                    <span className="text-blue-600 font-semibold">{filteredAndSortedDermatologists.length}</span> of{" "}
                    {dermatologists.length} dermatologists
                  </p>
                </div>
                {(filters.location || filters.availability !== "all") && (
                  <button
                    onClick={() => setFilters({ location: "", availability: "all", sortBy: "name" })}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {filteredAndSortedDermatologists.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No dermatologists found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-pretty">
                  We couldn&apos;t find any dermatologists matching your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={() => setFilters({ location: "", availability: "all", sortBy: "name" })}
                  className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedDermatologists.map((derm) => {
                  const isTelehealth =
                    derm.location?.toLowerCase().includes("telehealth") ||
                    derm.location?.toLowerCase().includes("online")

                  return (
                    <div
                      key={derm.id}
                      className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg
                              className="w-12 h-12 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                        {derm.location && (
                          <div
                            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md ${
                              isTelehealth ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                            }`}
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            {isTelehealth ? "Telehealth" : "Available"}
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {derm.name}
                          </h3>
                          <p className="text-sm font-medium text-blue-600">{derm.specialty || "Dermatology"}</p>
                        </div>

                        {derm.bio && <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{derm.bio}</p>}

                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          {derm.location && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              <span className="leading-relaxed">{derm.location}</span>
                            </div>
                          )}
                          {derm.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4 text-gray-400 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="truncate">{derm.email}</span>
                            </div>
                          )}
                          {derm.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4 text-gray-400 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span>{derm.phone}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleBookAppointment(derm.id)}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Book Appointment</h2>
                    {selectedDermatologist && (
                      <p className="text-sm text-gray-600">
                        with <span className="font-semibold text-blue-600">{selectedDermatologist.name}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowBookingForm(false)
                      setSelectedDerm(null)
                      setError(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmitBooking} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Date</label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Appointment Time</label>
                      <input
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Visit</label>
                    <textarea
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Please describe your skin concerns in detail..."
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Be as specific as possible to help your dermatologist prepare for your appointment
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Confirming...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm Booking
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingForm(false)
                        setSelectedDerm(null)
                        setError(null)
                      }}
                      disabled={loading}
                      className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}