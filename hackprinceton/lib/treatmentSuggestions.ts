export interface TreatmentSuggestion {
  title: string;
  category: 'skincare' | 'lifestyle';
  description: string;
}

export const treatmentSuggestions: { [key: string]: TreatmentSuggestion[] } = {
  // Treatment Suggestions for Blackheads_Mild
  Blackheads_Mild: [
    {
      title: 'Gentle Cleansing Routine',
      category: 'skincare',
      description: 'Cleanse twice daily with a gentle, foaming, non-comedogenic cleanser to remove excess oil and impurities without stripping moisture.',
    },
    {
      title: 'Exfoliation and Topicals',
      category: 'skincare',
      description: 'Use a low-strength salicylic acid (0.5–2%) or glycolic acid toner 2–3 times per week to prevent pore blockage.',
    },
    {
      title: 'Oil Control',
      category: 'skincare',
      description: 'Apply a lightweight, oil-free moisturizer to maintain hydration balance and reduce sebum overproduction.',
    },
    {
      title: 'Lifestyle Adjustments',
      category: 'lifestyle',
      description: 'Avoid heavy makeup or occlusive products that can clog pores. Maintain a balanced diet and stay hydrated.',
    },
  ],

  // Treatment Suggestions for Blackheads_Moderate
  Blackheads_Moderate: [
    {
      title: 'Cleansing and Exfoliation',
      category: 'skincare',
      description: 'Use a salicylic acid or glycolic acid cleanser once daily to dissolve excess oil and debris in pores.',
    },
    {
      title: 'Retinoid Use',
      category: 'skincare',
      description: 'Apply a retinoid (adapalene 0.1%) nightly to promote cell turnover and prevent comedone formation.',
    },
    {
      title: 'Moisturizing and Sun Protection',
      category: 'skincare',
      description: 'Moisturize with non-comedogenic products and apply sunscreen daily to avoid post-inflammatory pigmentation.',
    },
    {
      title: 'Dietary Modifications',
      category: 'lifestyle',
      description: 'Reduce sugary foods and dairy; increase intake of fiber, lean protein, and antioxidants.',
    },
  ],

  // Treatment Suggestions for Blackheads_Severe
  Blackheads_Severe: [
    {
      title: 'Advanced Topicals',
      category: 'skincare',
      description: 'Use prescription-strength retinoids (tretinoin or adapalene 0.3%) under dermatologist supervision.',
    },
    {
      title: 'Professional Extraction or Chemical Peels',
      category: 'skincare',
      description: 'Dermatologist-performed extractions or light chemical peels can help clear deep-seated comedones.',
    },
    {
      title: 'Oil Regulation',
      category: 'skincare',
      description: 'Avoid occlusive skincare and hair products. Use oil-absorbing sheets or mattifying gels if needed.',
    },
    {
      title: 'Lifestyle Support',
      category: 'lifestyle',
      description: 'Minimize stress and maintain consistent sleep and hydration patterns to support skin balance.',
    },
  ],

  // Treatment Suggestions for Cystic_Mild
  Cystic_Mild: [
    {
      title: 'Cleansing and Soothing Care',
      category: 'skincare',
      description: 'Cleanse gently with a hydrating, non-stripping cleanser. Avoid picking or squeezing cysts.',
    },
    {
      title: 'Topical Anti-Inflammatories',
      category: 'skincare',
      description: 'Use benzoyl peroxide (2.5%) or sulfur-based spot treatments to reduce inflammation.',
    },
    {
      title: 'Hydration and Barrier Care',
      category: 'skincare',
      description: 'Apply ceramide-rich moisturizers to support healing and reduce irritation.',
    },
    {
      title: 'Lifestyle and Hormone Awareness',
      category: 'lifestyle',
      description: 'Track hormonal cycles; consult a dermatologist if breakouts correlate with menstrual changes.',
    },
  ],

  // Treatment Suggestions for Cystic_Moderate
  Cystic_Moderate: [
    {
      title: 'Targeted Topical Treatments',
      category: 'skincare',
      description: 'Combine benzoyl peroxide with a retinoid (adapalene 0.1%) to target deep inflammation and prevent new cysts.',
    },
    {
      title: 'Professional Guidance',
      category: 'skincare',
      description: 'Dermatologists may prescribe oral antibiotics or hormonal therapy (e.g., spironolactone).',
    },
    {
      title: 'Anti-Inflammatory Diet',
      category: 'lifestyle',
      description: 'Incorporate foods rich in omega-3s, green tea, and zinc; reduce processed and high-glycemic foods.',
    },
    {
      title: 'Stress and Sleep Management',
      category: 'lifestyle',
      description: 'Adopt relaxation routines and ensure consistent sleep to regulate hormonal balance.',
    },
  ],

  // Treatment Suggestions for Cystic_Severe
  Cystic_Severe: [
    {
      title: 'Medical Treatment Required',
      category: 'skincare',
      description: 'Oral isotretinoin is often the most effective option for severe cystic acne. Must be prescribed by a dermatologist.',
    },
    {
      title: 'Supportive Skincare',
      category: 'skincare',
      description: 'Use gentle cleansers and non-comedogenic moisturizers to reduce dryness and irritation during treatment.',
    },
    {
      title: 'Avoid Aggravation',
      category: 'lifestyle',
      description: 'Do not attempt extraction. Limit dairy, sugar, and processed foods that can worsen inflammation.',
    },
    {
      title: 'Follow-Up and Patience',
      category: 'lifestyle',
      description: 'Follow dermatologist guidance and attend regular check-ins to monitor skin and blood health.',
    },
  ],

  // Treatment Suggestions for Nodular_Mild
  Nodular_Mild: [
    {
      title: 'Cleansing and Soothing',
      category: 'skincare',
      description: 'Cleanse gently and apply ice compresses to reduce swelling.',
    },
    {
      title: 'Spot Treatments',
      category: 'skincare',
      description: 'Use benzoyl peroxide gel on affected areas to limit bacterial growth.',
    },
    {
      title: 'Consistent Moisturization',
      category: 'skincare',
      description: 'Hydrate with lightweight moisturizers to support healing.',
    },
    {
      title: 'Lifestyle Support',
      category: 'lifestyle',
      description: 'Manage stress and ensure proper hydration to support the skin barrier.',
    },
  ],

  // Treatment Suggestions for Nodular_Moderate
  Nodular_Moderate: [
    {
      title: 'Topical and Oral Combination Therapy',
      category: 'skincare',
      description: 'Use retinoids alongside dermatologist-prescribed oral antibiotics to reduce inflammation.',
    },
    {
      title: 'Anti-Inflammatory Skincare',
      category: 'skincare',
      description: 'Avoid harsh scrubs and fragranced products; use calming ingredients like niacinamide.',
    },
    {
      title: 'Lifestyle Adjustments',
      category: 'lifestyle',
      description: 'Reduce dairy and high-glycemic foods; incorporate zinc and vitamin A-rich foods.',
    },
  ],

  // Treatment Suggestions for Nodular_Severe
  Nodular_Severe: [
    {
      title: 'Professional Intervention',
      category: 'skincare',
      description: 'Consult a dermatologist for oral isotretinoin or corticosteroid injections for large nodules.',
    },
    {
      title: 'Supportive Care',
      category: 'skincare',
      description: 'Use gentle cleansers and avoid popping or applying pressure to lesions.',
    },
    {
      title: 'Holistic Care',
      category: 'lifestyle',
      description: 'Maintain stress control, sleep, and balanced nutrition for long-term healing.',
    },
  ],

  // Treatment Suggestions for Papules_Mild
  Papules_Mild: [
    {
      title: 'Cleansing and Spot Care',
      category: 'skincare',
      description: 'Use a mild cleanser and spot-treat with benzoyl peroxide or salicylic acid.',
    },
    {
      title: 'Barrier Support',
      category: 'skincare',
      description: 'Moisturize daily to prevent dryness and irritation.',
    },
    {
      title: 'Lifestyle Focus',
      category: 'lifestyle',
      description: 'Avoid touching your face and reduce dietary triggers like sugar and dairy.',
    },
  ],

  // Treatment Suggestions for Papules_Moderate
  Papules_Moderate: [
    {
      title: 'Targeted Topicals',
      category: 'skincare',
      description: 'Apply topical retinoids (e.g., adapalene 0.1%) nightly to promote cell turnover and reduce inflammation.',
    },
    {
      title: 'Anti-inflammatory Care',
      category: 'skincare',
      description: 'Incorporate niacinamide or azelaic acid to calm redness and swelling.',
    },
    {
      title: 'Professional Consultation',
      category: 'skincare',
      description: 'Consider dermatologist-prescribed oral antibiotics if papules are widespread or persistent.',
    },
    {
      title: 'Diet and Hydration',
      category: 'lifestyle',
      description: 'Focus on a low-glycemic diet, increase water intake, and reduce alcohol consumption.',
    },
  ],

  // Treatment Suggestions for Papules_Severe
  Papules_Severe: [
    {
      title: 'Advanced Topicals and Oral Support',
      category: 'skincare',
      description: 'Combine prescription retinoids with oral antibiotics to reduce widespread inflammation.',
    },
    {
      title: 'Moisturization and Repair',
      category: 'skincare',
      description: 'Use ceramide-based moisturizers and avoid exfoliating products during flare-ups.',
    },
    {
      title: 'Lifestyle and Stress Control',
      category: 'lifestyle',
      description: 'Engage in stress management and consistent sleep routines to minimize hormonal triggers.',
    },
  ],

  // Treatment Suggestions for Pustules_Mild
  Pustules_Mild: [
    {
      title: 'Antibacterial Cleansing',
      category: 'skincare',
      description: 'Use a gentle cleanser with benzoyl peroxide (2.5%) to prevent bacterial growth.',
    },
    {
      title: 'Targeted Spot Treatment',
      category: 'skincare',
      description: 'Apply sulfur or salicylic acid treatments only to affected areas.',
    },
    {
      title: 'Healthy Lifestyle Habits',
      category: 'lifestyle',
      description: 'Avoid picking pustules and maintain a balanced diet with anti-inflammatory foods.',
    },
  ],

  // Treatment Suggestions for Pustules_Moderate
  Pustules_Moderate: [
    {
      title: 'Dual Therapy Approach',
      category: 'skincare',
      description: 'Use a topical retinoid at night and benzoyl peroxide in the morning.',
    },
    {
      title: 'Professional Consultation',
      category: 'skincare',
      description: 'If inflammation persists, consider dermatologist-prescribed antibiotics.',
    },
    {
      title: 'Dietary and Sleep Care',
      category: 'lifestyle',
      description: 'Avoid processed foods, prioritize hydration, and get adequate rest.',
    },
  ],

  // Treatment Suggestions for Pustules_Severe
  Pustules_Severe: [
    {
      title: 'Medical Management',
      category: 'skincare',
      description: 'Combine oral antibiotics with topical retinoids and benzoyl peroxide. Avoid manual extraction.',
    },
    {
      title: 'Barrier Recovery',
      category: 'skincare',
      description: 'Use gentle, non-irritating skincare to support healing and prevent scarring.',
    },
    {
      title: 'Lifestyle Support',
      category: 'lifestyle',
      description: 'Adopt a low-inflammatory diet and ensure consistent sleep and stress management.',
    },
  ],

  // Treatment Suggestions for Whiteheads_Mild
  Whiteheads_Mild: [
    {
      title: 'Gentle Cleansing',
      category: 'skincare',
      description: 'Wash twice daily with a mild cleanser. Avoid pore-clogging products.',
    },
    {
      title: 'Topical Exfoliation',
      category: 'skincare',
      description: 'Use a low-strength salicylic acid product to clear pores and prevent new whiteheads.',
    },
    {
      title: 'Lifestyle',
      category: 'lifestyle',
      description: 'Keep pillowcases and phone screens clean to reduce bacteria transfer.',
    },
  ],

  // Treatment Suggestions for Whiteheads_Moderate
  Whiteheads_Moderate: [
    {
      title: 'Active Exfoliation',
      category: 'skincare',
      description: 'Use salicylic acid and a topical retinoid (adapalene) to enhance skin turnover.',
    },
    {
      title: 'Hydration and Repair',
      category: 'skincare',
      description: 'Use a lightweight, oil-free moisturizer to maintain hydration.',
    },
    {
      title: 'Diet and Lifestyle',
      category: 'lifestyle',
      description: 'Limit dairy and sugar; manage stress through exercise or relaxation.',
    },
  ],

  // Treatment Suggestions for Whiteheads_Severe
  Whiteheads_Severe: [
    {
      title: 'Advanced Retinoid Regimen',
      category: 'skincare',
      description: 'Use dermatologist-prescribed retinoids or chemical peels for deep comedones.',
    },
    {
      title: 'Medical Supervision',
      category: 'skincare',
      description: 'Oral retinoids may be prescribed for persistent or scarring whiteheads.',
    },
    {
      title: 'Lifestyle Consistency',
      category: 'lifestyle',
      description: 'Maintain healthy sleep, hydration, and nutrition to regulate oil production.',
    },
  ],
};
