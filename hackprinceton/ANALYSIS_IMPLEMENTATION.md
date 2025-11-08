# How the Skin Analysis Works

## Current Implementation (Mock Data)

Currently, the application uses **mock analysis results** for demonstration purposes. Here's how it works:

### Flow Diagram

```
User Uploads Image
    ↓
Image Stored in State
    ↓
User Clicks "Analyze"
    ↓
handleAnalyze() Function
    ↓
Mock Result Generated (hardcoded)
    ↓
Results Stored in sessionStorage
    ↓
Image Uploaded to Supabase Storage
    ↓
Scan Record Saved to Database
    ↓
User Redirected to Results Page
```

### Current Code Location

**File:** `app/scan/page.tsx` (lines 39-92)

```typescript
const handleAnalyze = async () => {
  // TODO: Replace with actual AI model API call
  // For now, using mock analysis result
  const mockResult = {
    detections: [
      { type: 'papules', confidence: 0.85, boundingBox: {...} },
      { type: 'pustules', confidence: 0.72, boundingBox: {...} },
    ],
    possibleCauses: [
      'Hormonal changes',
      'Dietary factors',
      'Stress-related',
    ],
    severity: 'moderate',
  };
  
  // Process and save results...
}
```

## How to Connect a Real AI Model

### Option 1: REST API Endpoint (Recommended)

1. **Create a Backend API** (FastAPI/Flask):
   ```python
   # Example FastAPI endpoint
   @app.post("/analyze")
   async def analyze_skin(image: UploadFile):
       # Process image with your ML model
       result = model.predict(image)
       return {
           "detections": result.detections,
           "possibleCauses": result.causes,
           "severity": result.severity
       }
   ```

2. **Update `app/scan/page.tsx`**:
   ```typescript
   const handleAnalyze = async () => {
     setIsAnalyzing(true);
     
     try {
       // Convert file to FormData
       const formData = new FormData();
       formData.append('image', selectedFile);
       
       // Call your AI model API
       const response = await fetch('https://your-api.com/analyze', {
         method: 'POST',
         body: formData,
       });
       
       const analysisResult = await response.json();
       
       // Process results...
       const primaryType = analysisResult.detections[0]?.type || 'acne';
       const avgConfidence = analysisResult.detections.reduce(
         (sum, d) => sum + d.confidence, 0
       ) / analysisResult.detections.length;
       
       // Upload scan to Supabase
       const { data: scanData, error: uploadError } = await uploadScan(
         userId,
         selectedFile,
         primaryType,
         analysisResult.possibleCauses,
         avgConfidence
       );
       
       // Store results and redirect...
     } catch (error) {
       // Handle error
     }
   };
   ```

### Option 2: TensorFlow.js (Client-Side)

1. **Install TensorFlow.js**:
   ```bash
   npm install @tensorflow/tfjs
   ```

2. **Load Model and Analyze**:
   ```typescript
   import * as tf from '@tensorflow/tfjs';
   
   const analyzeImage = async (imageFile: File) => {
     // Load your trained model
     const model = await tf.loadLayersModel('/models/acne-detection/model.json');
     
     // Preprocess image
     const image = await loadImage(imageFile);
     const tensor = preprocessImage(image);
     
     // Run prediction
     const prediction = model.predict(tensor);
     const results = processPrediction(prediction);
     
     return results;
   };
   ```

### Option 3: Supabase Edge Functions

1. **Create Edge Function**:
   ```typescript
   // supabase/functions/analyze-skin/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   
   serve(async (req) => {
     const { imageUrl } = await req.json()
     
     // Call your ML model API or process locally
     const result = await analyzeWithModel(imageUrl)
     
     return new Response(JSON.stringify(result), {
       headers: { "Content-Type": "application/json" },
     })
   })
   ```

2. **Call from Frontend**:
   ```typescript
   const { data, error } = await supabase.functions.invoke('analyze-skin', {
     body: { imageUrl: uploadedImageUrl }
   });
   ```

## Expected Analysis Result Format

Your AI model should return data in this format:

```typescript
interface AnalysisResult {
  detections: Array<{
    type: string;              // e.g., 'papules', 'pustules', 'nodules'
    confidence: number;        // 0-1 (e.g., 0.85 = 85%)
    boundingBox: {            // Optional: location of detection
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  possibleCauses: string[];    // e.g., ['Hormonal changes', 'Dietary factors']
  severity: 'mild' | 'moderate' | 'severe';
}
```

## Implementation Steps

1. **Train/Obtain Your ML Model**
   - Use TensorFlow, PyTorch, or another framework
   - Train on dermatological image dataset
   - Export model for inference

2. **Deploy Model**
   - Option A: Deploy as REST API (FastAPI/Flask on Render/AWS)
   - Option B: Use TensorFlow.js for client-side
   - Option C: Use Supabase Edge Functions

3. **Update Frontend Code**
   - Replace mock data in `app/scan/page.tsx`
   - Add API call to your model endpoint
   - Handle loading states and errors

4. **Test Integration**
   - Test with various image types
   - Verify results are saved correctly
   - Check error handling

## Example: Full Implementation with FastAPI

### Backend (Python/FastAPI)

```python
from fastapi import FastAPI, UploadFile, File
from PIL import Image
import numpy as np
import tensorflow as tf

app = FastAPI()
model = tf.keras.models.load_model('acne_model.h5')

@app.post("/analyze")
async def analyze_skin(image: UploadFile = File(...)):
    # Read and preprocess image
    img = Image.open(image.file)
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Run prediction
    predictions = model.predict(img_array)
    
    # Process results
    detections = process_predictions(predictions)
    causes = determine_causes(detections)
    severity = calculate_severity(detections)
    
    return {
        "detections": detections,
        "possibleCauses": causes,
        "severity": severity
    }
```

### Frontend Update

```typescript
// In app/scan/page.tsx
const handleAnalyze = async () => {
  setIsAnalyzing(true);
  setError(null);
  
  try {
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    const analysisResult = await response.json();
    
    // Continue with existing code...
    const primaryType = analysisResult.detections[0]?.type || 'acne';
    const avgConfidence = analysisResult.detections.reduce(
      (sum, d) => sum + d.confidence, 0
    ) / analysisResult.detections.length;
    
    const { data: scanData, error: uploadError } = await uploadScan(
      userId,
      selectedFile,
      primaryType,
      analysisResult.possibleCauses,
      avgConfidence
    );
    
    // Store and redirect...
  } catch (err: any) {
    setError(err.message || 'Failed to analyze image');
  } finally {
    setIsAnalyzing(false);
  }
};
```

## Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Next Steps

1. Choose your ML model deployment method
2. Update `app/scan/page.tsx` to call your API
3. Test with real images
4. Handle edge cases and errors
5. Optimize for production

