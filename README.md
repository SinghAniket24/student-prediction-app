🎓 Student Performance Prediction Website

This React-based web application predicts student academic performance using a trained machine learning model integrated through a Flask backend.
Users can enter their demographic and academic details to receive predictions such as Pass / Fail along with visual insights.

🧾 Dataset

The model is trained on the UCI Student Performance Dataset, which includes data from secondary school students in Portugal.
It contains around 649 records with 33 features such as demographic, social, and academic details.
The target variable is the Final Grade (G3), categorized as Pass / Fail for prediction.

🌐 Website Features

Prediction Page:

Allows users to input details like absences, past failures, age, and family relationship quality.

Displays the prediction result (Pass/Fail) and the model’s confidence level.

Analysis Page:

Feature Contribution Chart: Visualizes how different features influenced the prediction.

User vs Dataset Comparison: Compares the user’s inputs with average dataset values for better understanding.

🧩 Key Technologies

Frontend: React.js

Backend: Flask (Python)

Machine Learning: scikit-learn (Random Forest, SVM)
