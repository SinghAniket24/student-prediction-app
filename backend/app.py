from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import numpy as np
import pandas as pd
import shap

app = Flask(__name__)
CORS(app)

# Load the trained joblib model
model = load("student_prediction.joblib")


# Load dataset for averages (make sure you have it saved, or preprocess before)
#df = pd.read_csv("dataset/student-por.csv")  # use the same dataset you trained on

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
    

#We’ll extend your Flask backend so that, when the frontend calls /shap, 
# it not only returns the prediction and probability, 
# but also the SHAP feature contributions for that specific user input.


app.route("/shap", methods=["POST"])
def shap_explanation():
    data = request.json  # user input as JSON

    # Create feature vector in the exact order
    features = [data[key] for key in FEATURE_ORDER]

    # SHAP explainer
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(features)

    # For binary classification: pick shap_values[1] (class "pass")
    shap_dict = dict(zip(FEATURE_ORDER, shap_values[1][0].tolist()))

    return jsonify({"shap_values": shap_dict})


'''@app.route("/shap-values", methods=["POST"])
def shap_values():
    user_input = request.json
    # convert to dataframe for model
    input_df = pd.DataFrame([user_input])

    # SHAP explainer
    explainer = shap.TreeExplainer(model)
    shap_vals = explainer(input_df)

    compute shap values
    shap_vals_all = explainer.shap_values(input_df)

     # Check if explainer returns a list
    if isinstance(shap_vals_all, list):
        # Use the first array if only one class is present
        shap_vals = shap_vals_all[1] if len(shap_vals_all) > 1 else shap_vals_all[0]
    else:
        shap_vals = shap_vals_all
        
    
    feature_contributions = dict(zip(input_df.columns, shap_vals[0]))
    return jsonify({"shap_values": feature_contributions})

 Convert numpy array to list for JSON serialization
    feature_contributions = dict(zip(input_df.columns, shap_vals.values[0].tolist()))

    #Option A — Convert to array on backend
    feature_contributions = [
        {"feature": col, "contribution": val}
        for col, val in zip(input_df.columns, shap_vals.values[0].tolist())
    ]

    return jsonify({"shap_values": feature_contributions})
'''


if __name__ == "__main__":
    app.run(debug=True)
