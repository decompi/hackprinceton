'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Our AI</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Advanced Machine Learning Technology
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our AI-powered skin analysis system uses state-of-the-art deep learning
                models trained on thousands of dermatological images. The system can
                accurately identify and classify various types of acne, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Papules - Small, raised, red bumps</li>
                <li>Pustules - Inflamed lesions with pus</li>
                <li>Nodules - Large, painful, deep lesions</li>
                <li>Cysts - Deep, pus-filled lesions</li>
                <li>Blackheads and Whiteheads</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you upload an image, our AI model:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4">
                <li>Preprocesses the image to enhance quality and normalize lighting</li>
                <li>Uses computer vision to detect skin regions and potential acne lesions</li>
                <li>Classifies each detected lesion by type and severity</li>
                <li>Calculates confidence scores for each detection</li>
                <li>Generates personalized recommendations based on the analysis</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Accuracy & Limitations
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our AI model has been trained on diverse datasets and achieves high accuracy
                in acne detection. However, it's important to note:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Results are for informational purposes only</li>
                <li>AI analysis is not a substitute for professional medical diagnosis</li>
                <li>Image quality significantly affects accuracy</li>
                <li>For persistent or severe conditions, always consult a dermatologist</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Privacy & Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We take your privacy seriously. All images are processed securely and can be
                anonymized for model improvement purposes. Your personal health information
                is protected according to HIPAA guidelines. You can control your privacy
                settings in your dashboard.
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Disclaimer:</strong> This AI tool is designed to assist with skin
                analysis but should not replace professional medical advice. Always consult
                with a licensed dermatologist for diagnosis and treatment of skin conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

