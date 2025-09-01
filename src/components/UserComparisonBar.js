

import React from "react";

const UserComparisonBars = ({ averages }) => {
if (!averages || !Array.isArray(averages) || averages.length === 0) {
    return <p>No comparison data available.</p>;
  }
  // helper: pick a color
  const getBarColor = (user, avg) => {
    if (user > avg * 1.5) return "red";
    if (user < avg * 0.7) return "orange";
    return "green";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {averages.map((item, index) => {
        const percentage = Math.min((item.user / (item.avg * 2)) * 100, 100); 
        const barColor = getBarColor(item.user, item.avg);

        return (
          <div key={index} style={{ width: "100%" }}>
            {/* Label */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontWeight: "bold" }}>{item.feature}</span>
              <span style={{ color: "gray" }}>
                Your Input: {item.user} | Avg: {item.avg}
              </span>
            </div>

            {/* Bar */}
            <div style={{ background: "#e5e7eb", borderRadius: "8px", height: "16px", width: "100%" }}>
              <div
                style={{
                  height: "100%",
                  width: `${percentage}%`,
                  background: barColor,
                  borderRadius: "8px",
                  transition: "width 0.5s ease"
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserComparisonBars;
