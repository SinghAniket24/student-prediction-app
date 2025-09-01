import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";

const FeatureContributionChart = ({ shapValues }) => {
  if (!shapValues  || Object.keys(shapValues).length === 0) { return <p>No feature contributions available.</p>;}

  /*Convert shapValues object into array for Recharts
    
  // normalize to array
  const allData = Array.isArray(shapValues)
    ? shapValues
    : Object.entries(shapValues).map(([feature, value]) => ({
        feature,
        contribution: value,
      }));*/
      
    /*const shapArray = Object.entries(data.shapValues).map(([feature, contribution]) => ({ feature, contribution }));
    setShapValues(shapArray);*/

  const data =
  Array.isArray(shapValues)
    ? shapValues 
    :Object.entries(shapValues).map(([feature, contribution]) => ({
    feature,
    contribution: Number(contribution),
  }));

  //const data = shapValues; // you already pass an array


  const positive = data
  .filter(f => f.contribution > 0)
  .sort((a, b) => b.contribution - a.contribution)
  .map(f => f.feature)
  .slice(0, 2);
  
  const negative = data
  .filter(f => f.contribution < 0)
  .sort((a, b) => a.contribution - b.contribution)
  .map(f => f.feature)
  .slice(0, 2);
  
  const explanation = `Your ${positive.join(" and ")} are the main reasons for the prediction. But your ${negative.join(" and ")} are helping you.`;

/*const positiveFeatures = shapValues.filter(f => f.contribution < 0).map(f => f.feature);
const negativeFeatures = shapValues.filter(f => f.contribution > 0).map(f => f.feature);
*/


/*Optional: sort by absolute contribution and take top N
const topShapArray = [...allData]
  .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
  .slice(0, 5); // top 5 contributors

  console.log("Top SHAP array:", topShapArray);


const positiveFeatures = topShapArray
  .filter(f => f.contribution > 0)
  .map(f => f.feature.toString()); // force string

const negativeFeatures = topShapArray
  .filter(f => f.contribution < 0)
  .map(f => f.feature.toString()); // force string


const insight = `Your ${positiveFeatures.join(', ')} are the main reasons for the prediction. But your ${negativeFeatures.join(', ')} are helping you.`;
*/
  return (
    <div className="p-4 bg-white shadow rounded-2xl mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Feature Contributions to Prediction
      </h2>
      <div className="h-80">

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number"  domain={[-1, 1]}/>
          <YAxis dataKey="feature" type="category" width={120}  
           tickFormatter={(val) => val.length > 20 ? val.slice(0,20) + '...' : val}
           />
          
          <Tooltip />
          <Bar
            dataKey="contribution"
            barSize={20}
            // Red if >0 (pushing towards Fail), Green if <0 (helping Pass)
            label={{ position: "right" }}
            //background={{ fill: "#e0e0e0" }} // gray background for zero line

          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.contribution > 0 ? "#f87171" : "#4ade80"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      <h3>{explanation}</h3>
    </div>
  );
};

export default FeatureContributionChart;
