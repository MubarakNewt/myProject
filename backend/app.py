from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__)
CORS(app, origins=["https://heart-disease-predictor-frontend.vercel.app"])

# ✅ Base directory: this guarantees paths work inside Docker
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Robust relative paths
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")
PIPELINE_PATH = os.path.join(BASE_DIR, "preprocess", "pipeline.pkl")
MI_INDICES_PATH = os.path.join(BASE_DIR, "model", "mi_indices.pkl")

# ✅ Load artifacts
model = joblib.load(MODEL_PATH)
pipeline = joblib.load(PIPELINE_PATH)
mi_indices = joblib.load(MI_INDICES_PATH)

@app.route("/")
def home():
    return jsonify({"status": "up", "message": "Heart Disease Predictor is running"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        df = pd.DataFrame([data])
        X_pre = pipeline.transform(df)
        X_sel = X_pre[:, mi_indices]
        prediction = int(model.predict(X_sel)[0])
        probability = float(model.predict_proba(X_sel)[0][1])
        return jsonify({"prediction": prediction, "probability": probability})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
