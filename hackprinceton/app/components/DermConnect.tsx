'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dermatologist } from '@/lib/supabaseClient';
import { getCurrentUser } from '@/lib/auth';
import { createAppointment } from '@/lib/database';
import { sendAppointmentConfirmation } from '@/lib/email';

interface DermConnectProps {
  dermatologists: Dermatologist[];
}

export default function DermConnect({ dermatologists }: DermConnectProps) {
  const [selectedDerm, setSelectedDerm] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
  });

  const handleBookAppointment = (dermId: string) => {
    setSelectedDerm(dermId);
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      if (!selectedDerm) {
        throw new Error('No dermatologist selected');
      }

      // Combine date and time into ISO string
      const scheduledAt = new Date(`${bookingData.date}T${bookingData.time}`).toISOString();

      // Get scan ID from sessionStorage if available
      const scanId = sessionStorage.getItem('scanId') || null;

      const { data, error } = await createAppointment(
        user.id,
        selectedDerm,
        scanId,
        scheduledAt
      );

      if (error) {
        throw error;
      }

      if (data) {
        // Send confirmation email (non-blocking - don't wait for it)
        sendAppointmentConfirmation({
          appointmentId: data.id,
          userId: user.id,
          dermatologistId: selectedDerm,
          scheduledAt: scheduledAt,
          reason: bookingData.reason,
        }).catch((err) => {
          console.error('Failed to send confirmation email:', err);
          // Email failure doesn't prevent appointment booking
        });

        alert('Appointment booked successfully! A confirmation email has been sent to your email address.');
        setShowBookingForm(false);
        setBookingData({ date: '', time: '', reason: '' });
        setSelectedDerm(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect with Dermatologists
        </h1>
        <p className="text-gray-600">
          Book an appointment with board-certified dermatologists
        </p>
      </div>

      {!showBookingForm ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dermatologists.map((derm) => (
            <div
              key={derm.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {derm.location && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {derm.location.toLowerCase().includes('telehealth') || derm.location.toLowerCase().includes('online') ? 'Telehealth' : 'Available'}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {derm.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{derm.specialty || 'Dermatology'}</p>
                {derm.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{derm.bio}</p>
                )}
                <div className="space-y-1 mb-4 text-sm text-gray-600">
                  {derm.location && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {derm.location}
                    </div>
                  )}
                  {derm.email && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {derm.email}
                    </div>
                  )}
                  {derm.phone && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {derm.phone}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleBookAppointment(derm.id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Book Appointment
            </h2>
            <button
              onClick={() => {
                setShowBookingForm(false);
                setSelectedDerm(null);
                setError(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={bookingData.time}
                onChange={(e) =>
                  setBookingData({ ...bookingData, time: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                value={bookingData.reason}
                onChange={(e) =>
                  setBookingData({ ...bookingData, reason: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your skin concerns..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Booking...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedDerm(null);
                  setError(null);
                }}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

