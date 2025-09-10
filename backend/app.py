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
feature_mapping = {
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


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Remap keys
        model_input = {feature_mapping[k]: v for k, v in data.items() if k in feature_mapping}

        # Ensure order matches training
        input_df = pd.DataFrame([model_input], columns=model.feature_names_in_)

        # Make prediction
        prediction = model.predict(input_df)[0]
        # Get probability of class 1 (passing)
        proba_pass = model.predict_proba(input_df)[0][1]  # index 1 is probability of class 1

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

'''
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

        //Comment---------------
        # Handle single array or list of arrays
        if isinstance(shap_values, list):
            # binary classification
            shap_array = shap_values[1][0]
        else:
            shap_array = shap_values[0]  # single output
        //---------------

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
'''

@app.route("/shap", methods=["POST"])
def shap_explanation():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # Remap to training feature names
        model_input = {
            feature_mapping[k]: v for k, v in data.items() if k in feature_mapping
        }
        # Build DataFrame in the exact feature order and numeric type
        input_df = pd.DataFrame([model_input], columns=model.feature_names_in_)

        # Predict + proba
        prediction = model.predict(input_df)[0]  # predicted class label
        probabilities = model.predict_proba(input_df)[0]
        class_labels = list(model.classes_)
        pred_class_idx = int(np.where(model.classes_ == 1)[0][0])

        # Compute SHAP values
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_df)

        # Pick SHAP values for the predicted class
        if isinstance(shap_values, list):
            shap_for_pred = shap_values[pred_class_idx][0]  # first (and only) sample
        else:
            shap_for_pred = shap_values[0]

        # Helper to unwrap any numpy scalars
        def unwrap(x):
            x = np.array(x)
            return float(x.item()) if x.size == 1 else float(x.ravel()[0])

        # Convert back to friendly names for frontend
        reverse_map = {v: k for k, v in feature_mapping.items()}
        feats = [
            {"feature": reverse_map.get(f, f), "contribution": unwrap(val)}
            for f, val in zip(model.feature_names_in_, shap_for_pred)
        ]
        feats_sorted = sorted(feats, key=lambda x: abs(x["contribution"]), reverse=True)

        '''resp = {
            "predicted_class": str(prediction),            # e.g. "1"
            "predicted_class_index": pred_class_idx,       # e.g. 1
            "probabilities": {
                str(cls): float(p) for cls, p in zip(class_labels, probabilities)
            },
            "shap_explanations": feats_sorted,             # ✅ contributions only for predicted class
            "input_features": {
                reverse_map.get(k, k): float(v) for k, v in model_input.items()
            },
            "model_classes": [str(c) for c in class_labels],
            "explanation_for_class": str(prediction)       # ✅ make it explicit
        }'''
        resp = {
    "predicted_class": str(prediction),
    "predicted_class_index": pred_class_idx,
    "probabilities": {str(cls): float(p) for cls, p in zip(class_labels, probabilities)},
    "shap_explanations": feats_sorted,
    "input_features": {reverse_map.get(k, k): float(v) for k, v in model_input.items()},
    "model_classes": [str(c) for c in class_labels],
    "explanation_for_class": "Pass" if str(prediction) == "1" else "Fail"  # ✅ add this
}


        print("SHAP RESPONSE:", resp)  # Debugging log
        return jsonify(resp)

    except Exception as e:
        print("SHAP ERROR:", e)
        return jsonify({"error": str(e), "shap_values": {}}), 400



'''
@app.route("/shap", methods=["POST"])
def shap_explanation():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # Remap to training feature names
        model_input = {feature_mapping[k]: v for k, v in data.items() if k in feature_mapping}
        # Build DataFrame in the exact feature order and numeric type
        input_df = pd.DataFrame([model_input], columns=model.feature_names_in_)


        # Predict and proba
        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        class_labels = list(model.classes_)

        # Compute SHAP values
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_df)

        #pred_class = int(model.predict(input_df)[0])   # 0 = Fail, 1 = Pass
        pred_class_idx = int(np.where(model.classes_ == prediction)[0][0])
        # Safely unwrap SHAP values for the predicted class
        if isinstance(shap_values, list):
            # Multi-class: pick predicted class array, first sample
            shap_for_pred = shap_values[pred_class_idx][0]
        else:
            # Single-output: use first sample
            shap_for_pred = shap_values[0]


        # Normalize and unwrap nested arrays safely
        def unwrap_scalar(x):
            x = np.array(x)
            if x.size == 1:
                return float(x.item())
            # If multiple elements, pick first (shouldn't happen for single sample)
            return float(x.ravel()[0])


        
        # Select the right class's SHAP array (handles list or single-array return)
        # Build per-class dict: { class_label: [{feature, contribution}, ...] }
        per_class = {}
        if isinstance(shap_values, list):
            # shap_values: list per class, each is (n_samples, n_features)
            for idx, cls in enumerate(class_labels):
                arr = shap_values[idx][0]  # first (only) sample
                feats = []
                for feat_name, val in zip(model.feature_names_in_, arr):
                    feats.append({
                        "feature": feat_name,
                        "contribution": unwrap_scalar(val)
                    })
                # sort by absolute contribution descending
                feats_sorted = sorted(feats, key=lambda x: abs(x["contribution"]), reverse=True)
                per_class[str(cls)] = feats_sorted
        else:
            # single-output SHAP (unlikely for multiclass), treat as class 0
            arr = shap_values[0]
            feats = [{"feature": f, "contribution": unwrap_scalar(v)} for f, v in zip(model.feature_names_in_, arr)]
            per_class[str(class_labels[0])] = sorted(feats, key=lambda x: abs(x["contribution"]), reverse=True)
        

        # Build feature contributions
        feats = [{"feature": f, "contribution": unwrap_scalar(v)}
                 for f, v in zip(model.feature_names_in_, shap_for_pred)]
        

        # Sort by absolute contribution descending
        feats_sorted = sorted(feats, key=lambda x: abs(x["contribution"]), reverse=True)


        
        # Convert feature names back to friendly labels for frontend
        reverse_map = {v: k for k, v in feature_mapping.items()}
        def to_friendly(feat_list):
            return [{"feature": reverse_map.get(item["feature"], item["feature"]),
                     "contribution": item["contribution"]} for item in feat_list]

        feats_friendly = [{"feature": reverse_map.get(item["feature"], item["feature"]),
                           "contribution": item["contribution"]} for item in feats_sorted]



        resp = {
           "predicted_class": str(prediction),
            "predicted_class_index": pred_class_idx,
            "probabilities": {str(cls): float(p) for cls, p in zip(class_labels, probabilities)},
            "shap_by_class": {str(prediction): feats_friendly},  # only predicted class
            "input_features": {reverse_map.get(k, k): float(v) for k, v in model_input.items()},
            "model_classes": [str(c) for c in class_labels]
      
        }
        print(resp)

        return jsonify(resp)




    except Exception as e:
        print("SHAP ERROR:", e)
        return jsonify({"error": str(e), "shap_values": {}}), 400
      
'''

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
