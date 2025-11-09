'use client';

import { useState, useEffect } from 'react';
import DermConnect from '../components/DermConnect';
import { getDermatologists, Dermatologist } from '@/lib/database';

export default function DermatologistPage() {
  const [dermatologists, setDermatologists] = useState<Dermatologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDermatologists = async () => {
      try {
        const { data, error } = await getDermatologists();
        if (error) {
          throw error;
        }
        if (data) {
          setDermatologists(data);
        }
      } catch (err: unknown) {
        let message = 'Failed to load dermatologists';
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === 'string') {
          message = err;
        } else {
          try {
            message = JSON.stringify(err);
          } catch {
            /* keep fallback message */
          }
        }
        setError(message);
        console.error('Error fetching dermatologists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDermatologists();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dermatologists...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DermConnect dermatologists={dermatologists} />
      </div>
    </div>
  );
}

