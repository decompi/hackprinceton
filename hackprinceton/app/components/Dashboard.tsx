'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserScans, Scan } from '@/lib/database';

interface WeeklyTrend {
  day: string;
  severity: number; // 0-100 scale
}

export default function Dashboard() {
  const [scanHistory, setScanHistory] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await getUserScans(user.id);
        if (error) {
          throw error;
        }

        if (data) {
          setScanHistory(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load scans');
        console.error('Error fetching scans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, [router]);

  // Calculate weekly trend from scan history
  const calculateWeeklyTrend = (): WeeklyTrend[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter scans from last week
    const recentScans = scanHistory.filter((scan) => {
      const scanDate = new Date(scan.analysis_date);
      return scanDate >= weekAgo;
    });

    // Group by day and calculate average confidence
    const dayMap: { [key: string]: number[] } = {};
    recentScans.forEach((scan) => {
      const date = new Date(scan.analysis_date);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      if (!dayMap[dayName]) {
        dayMap[dayName] = [];
      }
      if (scan.confidence !== null) {
        dayMap[dayName].push(scan.confidence * 100);
      }
    });

    return days.map((day) => {
      const confidences = dayMap[day] || [];
      const avgSeverity = confidences.length > 0
        ? confidences.reduce((sum, val) => sum + val, 0) / confidences.length
        : 0;
      return { day, severity: Math.round(avgSeverity) };
    });
  };

  const weeklyTrend = calculateWeeklyTrend();

  const getSeverityColor = (confidence: number | null) => {
    if (confidence === null) return 'bg-gray-100 text-gray-800';
    const severity = confidence * 100;
    if (severity < 40) return 'bg-green-100 text-green-800';
    if (severity < 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSeverityLabel = (confidence: number | null) => {
    if (confidence === null) return 'unknown';
    const severity = confidence * 100;
    if (severity < 40) return 'mild';
    if (severity < 70) return 'moderate';
    return 'severe';
  };

  const maxSeverity = Math.max(...weeklyTrend.map(t => t.severity));

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
        <p className="text-gray-600">Track your skin health progress</p>
      </div>

      {/* Weekly Trend Graph */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Your Skin This Week
        </h2>
        <div className="h-64 flex items-end justify-between space-x-2">
          {weeklyTrend.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                <div
                  className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all"
                  style={{ height: `${(day.severity / maxSeverity) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">{day.day}</div>
              <div className="text-xs text-gray-500">{day.severity}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Scan History</h2>
          <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {scanHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No scans yet. Start by uploading your first skin photo!</p>
            </div>
          ) : (
            scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={scan.image_url}
                    alt="Scan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {scan.acne_type || 'Unknown'}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(scan.confidence)}`}
                    >
                      {getSeverityLabel(scan.confidence)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(scan.analysis_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {scan.confidence !== null && (
                    <p className="text-xs text-gray-500 mt-1">
                      Confidence: {(scan.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

