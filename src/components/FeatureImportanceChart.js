import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";


const FeatureImportanceChart = ({ data }) => {
     if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No feature importance data available.</p>;
  }
  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Top 10 Important Features</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="feature" />
          <Tooltip />
          <Bar dataKey="importance" fill="#3b82f6" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImportanceChart;
