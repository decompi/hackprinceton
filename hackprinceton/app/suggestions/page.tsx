"use client";

import Suggestions from "../components/Suggestions";
import { treatmentSuggestions } from "../../lib/treatmentSuggestions";

function getInitialAcneType(): string {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("acneType") || "acne";
  }
  return "acne";
}

function getInitialSuggestions() {
  if (typeof window !== "undefined") {
    const storedAcneType = sessionStorage.getItem("acneType") || "acne";
    return treatmentSuggestions[storedAcneType] || [];
  }
  return [];
}

export default function SuggestionsPage() {
  const acneType = getInitialAcneType();
  const suggestions = getInitialSuggestions();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suggestions acneType={acneType} suggestions={suggestions} />
      </div>
    </div>
  );
}