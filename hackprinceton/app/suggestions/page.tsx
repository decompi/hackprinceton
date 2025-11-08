"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Suggestions from "../components/Suggestions";
import {
  treatmentSuggestions,
  TreatmentSuggestion,
} from "../../lib/treatmentSuggestions";

interface Suggestion {
  title: string;
  description: string;
  category: "skincare" | "lifestyle"; // Removed 'medical' since it's not in the new data
}

export default function SuggestionsPage() {
  const [acneType, setAcneType] = useState<string>("acne");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedAcneType = sessionStorage.getItem("acneType") || "acne";
    setAcneType(storedAcneType);

    const relevantSuggestions = treatmentSuggestions[storedAcneType] || [];
    setSuggestions(relevantSuggestions);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suggestions acneType={acneType} suggestions={suggestions} />
      </div>
    </div>
  );
}
