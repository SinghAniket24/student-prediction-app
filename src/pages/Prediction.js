import { useState } from "react";

export default function Prediction() {
  const [formData, setFormData] = useState({
    "Past Class Failures": "None",
    "Number of School Absences": "0–5 (Low)",
    "Family Relationship Quality": "Good",
    "Weekend Alcohol Consumption": "Medium",
    "Social Outings With Friends": "Medium",
    "Higher Education Ambition": "Aspirant",
    "Age": 17,
    "Free Time After School": "Medium",
    "Father’s Education Level": "Secondary",
    "Current Health Status": "Average",
  });

  const [prediction, setPrediction] = useState("");
  const [passProbability, setPassProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const mapping = {
    "Past Class Failures": { "None": 0, "One": 1, "Two": 2, "Three or More": 3 },
    "Number of School Absences": { "0–5 (Low)": 2, "6–15 (Medium)": 10, "16+ (High)": 20 },
    "Family Relationship Quality": { "Very Bad": 1, "Bad": 2, "Neutral": 3, "Good": 4, "Excellent": 5 },
    "Weekend Alcohol Consumption": { "Very Low": 1, "Low": 2, "Medium": 3, "High": 4, "Very High": 5 },
    "Social Outings With Friends": { "Very Low": 1, "Low": 2, "Medium": 3, "High": 4, "Very High": 5 },
    "Higher Education Ambition": { "Aspirant": 1, "Not Interested": 0 },
    "Age": (val) => Number(val),
    "Free Time After School": { "Very Low": 1, "Low": 2, "Medium": 3, "High": 4, "Very High": 5 },
    "Father’s Education Level": { "None": 0, "Primary": 1, "Middle": 2, "Secondary": 3, "Higher": 4 },
    "Current Health Status": { "Very Poor": 1, "Poor": 2, "Average": 3, "Good": 4, "Excellent": 5 },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction("");
    setPassProbability(null);

    const payload = {};
    Object.keys(formData).forEach((key) => {
      payload[key] =
        typeof mapping[key] === "function"
          ? mapping[key](formData[key])
          : mapping[key][formData[key]];
    });

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setPassProbability(data.pass_probability);
      setShowModal(true);
    } catch (error) {
      console.error("Error while fetching prediction:", error);
      setPrediction("Error connecting to backend.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "650px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#007bff",
          fontSize: "clamp(20px, 2.5vw, 28px)",
        }}
      >
        Student Result Prediction
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "clamp(14px, 2vw, 16px)",
              }}
            >
              {key}
            </label>
            {key === "Age" ? (
              <input
                type="number"
                name={key}
                min={15}
                max={22}
                value={formData[key]}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            ) : (
              <select
                name={key}
                value={formData[key]}
                onChange={handleChange}
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              >
                {Object.keys(mapping[key]).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#28a745",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "10px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "15px", color: "#dc3545", fontSize: "20px" }}>
              Prediction Result
            </h3>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              <strong>Result:</strong> {prediction}
            </p>
            {passProbability !== null && (
              <p style={{ fontSize: "15px" }}>
                Pass Probability: {passProbability}%
              </p>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 600px) {
          form {
            gap: 14px;
          }
          select, input {
            font-size: 14px;
          }
          button {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
