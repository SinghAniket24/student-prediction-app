import React, { useEffect, useState } from "react";
import FeatureContributionChart from "../components/FeatureContributionChart";
import UserComparisonBars from "../components/UserComparisonBar";
import { useLocation } from "react-router-dom";

const Analysis = () => {
  const [userComparison, setUserComparison] = useState([]);
  const [shapValues, setShapValues] = useState(null);
  const location = useLocation();
  const { payload, prediction } = location.state || {}; // mapped user input

  // Convert numeric prediction into label
  const predictionLabel = String(prediction) === "1" ? "✅ Pass" : "❌ Fail";

  useEffect(() => {
    if (!payload) return;
    let isMounted = true;

    const fetchShap = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/shap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!isMounted) return;

        if (!data.shap_values) {
          setShapValues([]);
          return;
        }

        const shapArray = Object.entries(data.shap_values).map(
          ([feature, contribution]) => ({
            feature,
            contribution,
          })
        );

        const topShapArray = shapArray
          .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
          .slice(0, 5);

        setShapValues(topShapArray);
      } catch (err) {
        console.error("Error fetching SHAP values:", err);
      }
    };

    const fetchAverages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/averages");
        const averages = await res.json();

        if (!averages || !payload) return;

        const comparison = Object.keys(payload)
          .map((feature) => {
            const userVal = payload[feature];
            const avgVal = averages[feature];
            if (avgVal === undefined) return null;

            return {
              feature,
              user: Number(userVal),
              avg: Number(avgVal),
              diff: Number(userVal) - Number(avgVal),
            };
          })
          .filter(Boolean);

        setUserComparison(comparison);
      } catch (err) {
        console.error("Error fetching averages:", err);
      }
    };

    fetchShap();
    fetchAverages();

    return () => {
      isMounted = false;
    };
  }, [payload]);

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "950px",
        margin: "auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          background: "linear-gradient(90deg, #007bff, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "clamp(22px, 2.5vw, 32px)",
          fontWeight: "800",
        }}
      >
        Detailed Analysis
      </h2>

      {/* 🔹 Prediction Highlight */}
      <div
        style={{
          background: predictionLabel.includes("Pass")
            ? "linear-gradient(135deg, #e6f9f0, #d4f5e6)"
            : "linear-gradient(135deg, #fdecea, #fbd2d2)",
          border: predictionLabel.includes("Pass")
            ? "2px solid #28a745"
            : "2px solid #dc3545",
          padding: "25px",
          borderRadius: "14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          marginBottom: "35px",
          textAlign: "center",
          transition: "transform 0.2s",
        }}
      >
        <h3
          style={{
            fontSize: "22px",
            marginBottom: "12px",
            color: predictionLabel.includes("Pass") ? "#28a745" : "#dc3545",
          }}
        >
          Prediction Result
        </h3>
        <p
          style={{
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          {predictionLabel}
        </p>
      </div>

      {/* 🔹 SHAP Feature Contribution */}
      <div
        style={{
          background: "linear-gradient(145deg, #fdfbfb, #ebedee)",
          padding: "28px",
          borderRadius: "14px",
          border: "1.5px solid #b8c6db",
          boxShadow: "0 6px 15px rgba(0,0,0,0.07)",
          marginBottom: "40px",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            marginBottom: "22px",
            color: "#2c3e50",
            textAlign: "center",
            fontWeight: "700",
            borderBottom: "2px solid #b8c6db",
            paddingBottom: "10px",
          }}
        >
          Top 5 Feature Contributions
        </h3>
        <FeatureContributionChart shapValues={shapValues} />
      </div>

      {/* 🔹 User Comparison */}
      <div
        style={{
          background: "linear-gradient(145deg, #ffffff, #f7f9fc)",
          padding: "28px",
          borderRadius: "14px",
          border: "1.5px solid #cfd9df",
          boxShadow: "0 6px 15px rgba(0,0,0,0.07)",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            marginBottom: "22px",
            color: "#2c3e50",
            textAlign: "center",
            fontWeight: "700",
            borderBottom: "2px solid #cfd9df",
            paddingBottom: "10px",
          }}
        >
          Your Inputs vs Dataset Averages
        </h3>
        <UserComparisonBars averages={userComparison} />
      </div>
    </div>
  );
};

export default Analysis;
