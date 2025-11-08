"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../components/ImageUpload";
import { getCurrentUser } from "@/lib/auth";
import { uploadScan } from "@/lib/database";

export default function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { user } = await getCurrentUser();
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, [router]);

  const handleImageSelect = (file: File | null) => {
    if (file === null) {
      setSelectedFile(null);
      setSelectedImage(null);
      setIsAnalyzing(false); // Reset analysis state
      setError(null); // Clear any previous errors
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !userId) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // 1️⃣ Prepare the form data for Flask
      const formData = new FormData();
      formData.append("file", selectedFile);

      // 2️⃣ Send to your Flask backend (running on port 5001)
      const response = await fetch("http://localhost:5001/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();

      // 3️⃣ Parse the backend response
      // e.g., { prediction: "Papules_Moderate", confidence: 0.847 }
      const predictedType = result.prediction || "Unknown";
      const confidence = result.confidence || 0;

      // 4️⃣ Convert it into your app’s structure (for Supabase upload)
      const mockResult = {
        detections: [
          {
            type: predictedType,
            confidence: confidence,
            boundingBox: { x: 100, y: 100, width: 80, height: 80 }, // optional placeholder
          },
        ],
        possibleCauses: [
          "Hormonal changes",
          "Dietary factors",
          "Stress-related",
        ],
        severity: predictedType.toLowerCase().includes("severe")
          ? "severe"
          : predictedType.toLowerCase().includes("moderate")
          ? "moderate"
          : "mild",
      };

      // 5️⃣ Upload the result to Supabase
      const primaryType = mockResult.detections[0]?.type || "acne";
      const avgConfidence =
        mockResult.detections.reduce((sum, d) => sum + d.confidence, 0) /
        mockResult.detections.length;

      const { data: scanData, error: uploadError } = await uploadScan(
        userId,
        selectedFile,
        primaryType,
        mockResult.possibleCauses,
        avgConfidence
      );

      if (uploadError) throw uploadError;

      // 6️⃣ Save results in sessionStorage
      sessionStorage.setItem("analysisResult", JSON.stringify(mockResult));
      if (scanData) {
        sessionStorage.setItem("scanId", scanData.id);
        sessionStorage.setItem("analysisImageUrl", scanData.image_url);
      }

      // 7️⃣ Redirect to results page
      router.push("/results");
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Skin Photo
          </h1>
          <p className="text-gray-600">
            Take a clear photo of the affected area for best results
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <ImageUpload
            onImageSelect={handleImageSelect}
            previewImage={selectedImage}
          />

          {selectedImage && (
            <div className="mt-6 text-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !userId}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
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
                    Analyzing...
                  </span>
                ) : (
                  "Analyze"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
