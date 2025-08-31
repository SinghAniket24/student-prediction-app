from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained joblib model
model = load("student_prediction.joblib")

# Define the exact order of features your model expects
FEATURE_ORDER = [
    "Past Class Failures",
    "Number of School Absences",
    "Family Relationship Quality",
    "Weekend Alcohol Consumption",
    "Social Outings With Friends",
    "Higher Education Ambition",
    "Age",
    "Free Time After School",
    "Father’s Education Level",
    "Current Health Status",
]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Create feature vector in the exact order
        features = [data[key] for key in FEATURE_ORDER]

        # Convert to numpy array (1 sample, many features)
        features_array = np.array(features).reshape(1, -1)

        # Make prediction
        prediction = model.predict(features_array)[0]

        # Get probability of class 1 (passing )
        proba_pass = model.predict_proba(features_array)[0][1]  # index 1 is probability of class 1

        return jsonify({
            "prediction": str(prediction),
            "pass_probability": round(float(proba_pass) * 100, 2)  # percentage with 2 decimals
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
