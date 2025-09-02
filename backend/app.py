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

# --- SHAP FEATURE CONTRIBUTION ENDPOINT ---

@app.route("/shap", methods=["POST"])
def shap_explanation():
    try:
        data = request.get_json()
        if not data or not all(key in data for key in FEATURE_ORDER):
            return jsonify({"error": "Invalid input payload", "shap_values": {}}), 400

        # Convert to numeric DataFrame
        input_df = pd.DataFrame([data], columns=FEATURE_ORDER).astype(float)

        #print(model.classes_)
        # Tree SHAP explainer
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_df)

        '''
        # Handle single array or list of arrays
        if isinstance(shap_values, list):
            # binary classification
            shap_array = shap_values[1][0]
        else:
            shap_array = shap_values[0]  # single output
        '''

        # Handle both list and array outputs for binary classification
        if isinstance(shap_values, list):
            shap_array = shap_values[1][0]  # pick class "pass" and first sample
        else:
            shap_array = shap_values[0]  # single-output array
            

        #shap_dict = dict(zip(FEATURE_ORDER, shap_array.tolist()))
             # Make sure each element is a single number
        shap_dict = {}
        for feature, val in zip(FEATURE_ORDER, shap_array):
            # If val is an array (sometimes happens), take the first element
            if isinstance(val, (list, np.ndarray)):
                shap_dict[feature] = float(val[0])
            else:
                shap_dict[feature] = float(val)

             #Optional: sort by absolute contribution
            shap_dict_sorted = dict(sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True))

        return jsonify({"shap_values": shap_dict_sorted})

    except Exception as e:
        print("SHAP ERROR:", e)  # Log full error to console
        return jsonify({"error": str(e), "shap_values": {}}), 400


# --- DATASET AVERAGES ENDPOINT ---
'''@app.route("/averages", methods=["GET"])
def averages():
    df = pd.read_csv("dataset/student-por.csv")
    print(df.columns)
    feature_avgs = {col: df[col].mean() for col in FEATURE_ORDER}
    return jsonify(feature_avgs)'''
@app.route("/averages", methods=["GET"])
def averages():
    '''try:
        df = pd.read_csv("dataset/student-por.csv", sep=',')  # semicolon delimiter
        # Map your FEATURE_ORDER to actual CSV columns
        feature_avgs = {key: df[col].mean() for key, col in CSV_COLUMNS.items()}
        return jsonify(feature_avgs)
    except Exception as e:
        return jsonify({"error": str(e), "averages": {}}), 400'''
    try:
        # Mapping yes/no columns to numeric
        YES_NO_COLS = ['schoolsup', 'famsup', 'paid', 'activities', 'nursery', 'higher', 'internet', 'romantic']

        # Read CSV (use correct delimiter)
        df = pd.read_csv("dataset/student-por.csv", sep=';')


        for col in YES_NO_COLS:
            if col in df.columns:
                df[col] = df[col].map({'yes': 1, 'no': 0})


        # Print the column names to debug
        print("CSV columns:", df.columns.tolist())

        column_mapping = {
            "Past Class Failures": "failures",
            "Number of School Absences": "absences",
            "Family Relationship Quality": "famrel",
            "Weekend Alcohol Consumption": "Walc",
            "Social Outings With Friends": "goout",
            "Higher Education Ambition": "higher",
            "Age": "age",
            "Free Time After School": "freetime",
            "Father’s Education Level": "Fedu",
            "Current Health Status": "health",
        }
        # Compute averages
        feature_avgs = {}
        for feature, col in column_mapping.items():
            if col in df.columns:
                feature_avgs[feature] = df[col].mean()
            else:
                print(f"Column missing in CSV: {col}")
                feature_avgs[feature] = None  # or 0, or skip

        # Print averages before returning
        print("Feature averages:", feature_avgs)

        return jsonify(feature_avgs)

    except Exception as e:
        print("AVERAGES ERROR:", e)
        return jsonify({"error": str(e), "averages": {}}), 400



if __name__ == "__main__":
    app.run(debug=True)
