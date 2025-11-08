'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResultDisplay from '../components/ResultDisplay';

interface AnalysisResult {
  detections: Array<{
    type: string;
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
  }>;
  possibleCauses: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Get results from sessionStorage
    const storedResult = sessionStorage.getItem('analysisResult');
    const storedImageUrl = sessionStorage.getItem('analysisImageUrl');
    const storedScanId = sessionStorage.getItem('scanId');

    if (storedResult) {
      setResult(JSON.parse(storedResult));
      
      // Use image URL from Supabase if available, otherwise try to get from scanId
      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      } else if (storedScanId) {
        // Fetch image URL from database if not in sessionStorage
        fetchImageFromScanId(storedScanId);
      } else {
        // Fallback: redirect to scan page
        router.push('/scan');
      }
    } else {
      // If no results, redirect to scan page
      router.push('/scan');
    }
  }, [router]);

  const fetchImageFromScanId = async (scanId: string) => {
    try {
      const { getScanById } = await import('@/lib/database');
      const { data, error } = await getScanById(scanId);
      if (data && !error) {
        setImageUrl(data.image_url);
      }
    } catch (err) {
      console.error('Error fetching scan:', err);
    }
  };

  const handleViewSuggestions = () => {
    if (result) {
      // Store acne type for suggestions page
      const acneType = result.detections[0]?.type || 'acne';
      sessionStorage.setItem('acneType', acneType);
      router.push('/suggestions');
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResultDisplay
          imageUrl={imageUrl}
          result={result}
          onViewSuggestions={handleViewSuggestions}
        />
      </div>
    </div>
  );
}

