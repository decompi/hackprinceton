'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AcneDetection {
  type: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
}

interface AnalysisResult {
  detections: AcneDetection[];
  possibleCauses: string[];
  severity: 'mild' | 'moderate' | 'severe';
}

interface ResultDisplayProps {
  imageUrl: string;
  result: AnalysisResult;
  onViewSuggestions: () => void;
}

export default function ResultDisplay({ imageUrl, result, onViewSuggestions }: ResultDisplayProps) {
  const router = useRouter();

  const handleConsultDermatologist = () => {
    // Store scan ID in sessionStorage so dermatologist page can link appointment to scan
    const scanId = sessionStorage.getItem('scanId');
    if (scanId) {
      // Keep scanId in sessionStorage for appointment booking
    }
    router.push('/dermatologist');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image with Overlays */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full">
              <Image
                src={imageUrl}
                alt="Analyzed skin"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                unoptimized
              />
            </div>
            {/* Bounding boxes overlay would be rendered here in a real implementation */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
              </span>
            </div>
          </div>

          {/* Results Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Acne Types</h3>
              <div className="space-y-3">
                {result.detections.map((detection, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {detection.type}
                      </span>
                      <span className={`font-semibold ${getConfidenceColor(detection.confidence)}`}>
                        {(detection.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${detection.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Possible Causes</h3>
              <ul className="space-y-2">
                {result.possibleCauses.map((cause, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onViewSuggestions}
              className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              View Treatment Suggestions
            </button>
            <button
              onClick={handleConsultDermatologist}
              className="flex-1 px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Consult Dermatologist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

