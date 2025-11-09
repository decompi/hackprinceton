from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# ---------------------------
# Load model and class names
# ---------------------------
model = tf.keras.models.load_model('acne_model_finetuned.h5')

# NOTE: update these to match your dataset (you currently have 18 classes)
class_names = [
    "Blackheads_Mild", "Blackheads_Moderate", "Blackheads_Severe",
    "Cystic_Mild", "Cystic_Moderate", "Cystic_Severe",
    "Nodular_Mild", "Nodular_Moderate", "Nodular_Severe",
    "Papules_Mild", "Papules_Moderate", "Papules_Severe",
    "Pustules_Mild", "Pustules_Moderate", "Pustules_Severe",
    "Whiteheads_Mild", "Whiteheads_Moderate", "Whiteheads_Severe"
]

# ---------------------------
# Prediction route
# ---------------------------
@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    # Read and preprocess image safely
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    preds = model.predict(img_array)
    pred_idx = int(np.argmax(preds[0]))
    confidence = float(np.max(preds[0]))

    # Format and return
    return jsonify({
        "prediction": class_names[pred_idx],
        "confidence": round(confidence, 3)
    })

# ---------------------------
# Run server
# ---------------------------
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)