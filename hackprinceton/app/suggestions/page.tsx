'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Suggestions from '../components/Suggestions';

interface Suggestion {
  title: string;
  description: string;
  category: 'skincare' | 'lifestyle' | 'medical';
}

export default function SuggestionsPage() {
  const [acneType, setAcneType] = useState<string>('acne');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedAcneType = sessionStorage.getItem('acneType') || 'acne';
    setAcneType(storedAcneType);

    // Mock suggestions based on acne type
    const mockSuggestions: Suggestion[] = [
      {
        title: 'Gentle Cleansing Routine',
        description: 'Use a mild, non-comedogenic cleanser twice daily. Avoid harsh scrubs that can irritate the skin and worsen inflammation.',
        category: 'skincare',
      },
      {
        title: 'Topical Treatment',
        description: 'Consider using benzoyl peroxide (2.5-5%) or salicylic acid products. Start with lower concentrations to minimize irritation.',
        category: 'skincare',
      },
      {
        title: 'Moisturize Regularly',
        description: 'Use an oil-free, non-comedogenic moisturizer to maintain skin barrier function and prevent over-drying from treatments.',
        category: 'skincare',
      },
      {
        title: 'Dietary Adjustments',
        description: 'Reduce intake of high-glycemic foods and dairy products. Increase consumption of foods rich in omega-3 fatty acids and antioxidants.',
        category: 'lifestyle',
      },
      {
        title: 'Stress Management',
        description: 'Practice stress-reduction techniques such as meditation, yoga, or regular exercise, as stress can exacerbate acne.',
        category: 'lifestyle',
      },
      {
        title: 'Sleep Hygiene',
        description: 'Ensure 7-9 hours of quality sleep per night. Poor sleep can affect hormone levels and skin health.',
        category: 'lifestyle',
      },
      {
        title: 'Consult a Dermatologist',
        description: 'If acne persists or worsens, consider consulting with a board-certified dermatologist for prescription treatments.',
        category: 'medical',
      },
    ];

    setSuggestions(mockSuggestions);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suggestions acneType={acneType} suggestions={suggestions} />
      </div>
    </div>
  );
}

