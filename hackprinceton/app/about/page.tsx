import { Brain, Search, ShieldCheck, AlertCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">About Our AI</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Advanced Machine Learning Technology</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our AI-powered skin analysis system uses state-of-the-art deep learning models trained on thousands of
                dermatological images. The system can accurately identify and classify various types of acne, including:
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                  <span>
                    <strong className="text-gray-900">Papules</strong> - Small, raised, red bumps
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                  <span>
                    <strong className="text-gray-900">Pustules</strong> - Inflamed lesions with pus
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                  <span>
                    <strong className="text-gray-900">Nodules</strong> - Large, painful, deep lesions
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                  <span>
                    <strong className="text-gray-900">Cysts</strong> - Deep, pus-filled lesions
                  </span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                  <span>
                    <strong className="text-gray-900">Blackheads and Whiteheads</strong>
                  </span>
                </li>
              </ul>
            </section>

            <div className="border-t border-gray-200"></div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">How It Works</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">When you upload an image, our AI model:</p>
              <ol className="space-y-3 mb-4">
                <li className="flex items-start gap-4 text-gray-700 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <span className="pt-0.5">Preprocesses the image to enhance quality and normalize lighting</span>
                </li>
                <li className="flex items-start gap-4 text-gray-700 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <span className="pt-0.5">Uses computer vision to detect skin regions and potential acne lesions</span>
                </li>
                <li className="flex items-start gap-4 text-gray-700 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <span className="pt-0.5">Classifies each detected lesion by type and severity</span>
                </li>
                <li className="flex items-start gap-4 text-gray-700 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </span>
                  <span className="pt-0.5">Calculates confidence scores for each detection</span>
                </li>
                <li className="flex items-start gap-4 text-gray-700 p-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    5
                  </span>
                  <span className="pt-0.5">Generates personalized recommendations based on the analysis</span>
                </li>
              </ol>
            </section>

            <div className="border-t border-gray-200"></div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Accuracy & Limitations</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our AI model has been trained on diverse datasets and achieves high accuracy in acne detection. However,
                it&apos;s important to note:
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></span>
                  <span>Results are for informational purposes only</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></span>
                  <span>AI analysis is not a substitute for professional medical diagnosis</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></span>
                  <span>Image quality significantly affects accuracy</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700 p-3 rounded-lg hover:bg-amber-50 transition-colors">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2"></span>
                  <span>For persistent or severe conditions, always consult a dermatologist</span>
                </li>
              </ul>
            </section>

            <div className="border-t border-gray-200"></div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Privacy & Security</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We take your privacy seriously. All images are processed securely and can be anonymized for model
                improvement purposes. Your personal health information is protected according to HIPAA guidelines. You
                can control your privacy settings in your dashboard.
              </p>
            </section>

            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong className="font-semibold">Disclaimer:</strong> This AI tool is designed to assist with skin
                  analysis but should not replace professional medical advice. Always consult with a licensed
                  dermatologist for diagnosis and treatment of skin conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
