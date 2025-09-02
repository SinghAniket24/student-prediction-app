import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/*
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontWeight: "bold" }}>{item.feature}</span>
              <span style={{ color: "gray" }}>
                Your Input: {item.user} | Avg: {item.avg}
              </span>
            </div>

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
*/



const UserComparisonGroupedBar = ({ averages }) => {
  if (!averages || !Array.isArray(averages) || averages.length === 0) {
    return(
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
        <p className="text-gray-600">No comparison data available.</p>
      </div>
    );
  }

  // Transform data for recharts
  const chartData = averages.map((item) => ({
    feature: item.feature,
    "Your Input": item.user,
    "Dataset Avg": item.avg,
  }));

  return (
  <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-md mt-6">
    <div className="h-96">

    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="feature"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={70}
            tick={{ fontSize: 12 }}

          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Dataset Avg" fill="#3b82f6" />
          <Bar dataKey="Your Input" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    </div>
  </div>
  );
};

export default UserComparisonGroupedBar;

