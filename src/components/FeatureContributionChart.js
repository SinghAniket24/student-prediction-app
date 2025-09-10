import React from "react";
/*import {1
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
  if (!shapValues  || Object.keys(shapValues).length === 0) {
    return(
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <p className="text-gray-500">No feature contributions available.</p>
      </div>
    );
  }

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

    
  /*const data =1
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
  
  const explanation = `Your ${positive.join(" and ")} are the main reasons for the prediction. But your ${negative.join(" and ")} are helping you.`;1*/

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
/* 1 return (
    <div className="p-4 bg-white shadow rounded-2xl mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Feature Contributions to Prediction
      </h2>
      <div className="h-80">

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number"  domain={[-1, 1]}/>
          <YAxis dataKey="feature" type="category" width={120}  
           tickFormatter={(val) => val.length > 20 ? val.slice(0,20) + '...' : val}
           />
          
          <Tooltip 
          formatter={(val) => val.toFixed(3)}
              contentStyle={{ borderRadius: "10px" }}/>
          <Bar
            dataKey="contribution"
            barSize={22}
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
      <p className="mt-6 text-center text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">{explanation}</p>
    </div>
  );
};

export default FeatureContributionChart;
*/

/*
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

const FeatureContributionChart = ({ shapValues = [], predictedClass = null, topN = 5 }) => {
  // shapValues expected as array of objects: [{ feature, contribution }, ...]
  if (!shapValues || shapValues.length === 0) {
    return (
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <p className="text-gray-500">No feature contributions available.</p>
      </div>
    );
  }

  // Normalize shapValues into {feature, contribution}
  const data =
    Array.isArray(shapValues)
      ? shapValues.map(item => ({
          feature: String(item.feature),
          contribution: Number(item.contribution)
        }))
      : Object.entries(shapValues).map(([feature, contribution]) => ({
          feature,
          contribution: Number(contribution)
        }));

  // Pick topN by absolute contribution for clarity (then reverse so biggest is on top)
  const topData = [...data]
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, topN)
    .reverse(); // reverse so the largest bar appears at top in vertical layout

  // Positive/negative feature lists (for the explanation)
  const positiveFeatures = topData.filter(f => f.contribution > 0).map(f => f.feature);
  const negativeFeatures = topData.filter(f => f.contribution < 0).map(f => f.feature);

  // Decide color mapping relative to the predicted class:
  // If predictedClass indicates PASS (string contains 'pass' or numeric 1), then
  // positive contributions mean "push toward PASS" (green).
  // If predictedClass indicates FAIL (contains 'fail' or 0), then positive
  // contributions push toward FAIL (we color them red).
  const predLower = predictedClass ? String(predictedClass).toLowerCase() : "";
  const positiveMeansPass = predLower.includes("pass") || predLower === "1" || predLower === "true";

  const positiveColor = positiveMeansPass ? "#16a34a" : "#ef4444"; // green if pushing PASS, red if pushing FAIL
  const negativeColor = positiveMeansPass ? "#ef4444" : "#16a34a"; // opposite color

  // Build readable explanation
  const targetLabel = predictedClass ? String(predictedClass) : "the selected class";
  const explanation = `The bars show how each feature moved the model output. Positive bars (green) push the model toward ${targetLabel}; negative bars (red) push it away. Top contributors pushing toward ${targetLabel}: ${positiveFeatures.length ? positiveFeatures.join(", ") : "none"}. Features pushing away: ${negativeFeatures.length ? negativeFeatures.join(", ") : "none"}.`;

  return (
    <div className="p-4 bg-white shadow rounded-2xl mt-6">
      <h2 className="text-lg font-semibold mb-4">
        Feature Contributions to Prediction
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={['auto', 'auto']} />
            <YAxis
              dataKey="feature"
              type="category"
              width={140}
              tickFormatter={(val) => (val && val.length > 24 ? val.slice(0, 24) + "..." : val)}
            />
            <Tooltip formatter={(val) => Number(val).toFixed(3)} contentStyle={{ borderRadius: "10px" }} />
            <Bar dataKey="contribution" barSize={22} label={{ position: "right" }}>
              {topData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.contribution > 0 ? positiveColor : negativeColor}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-6 text-center text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
        {explanation}
      </p>
    </div>
  );
};

export default FeatureContributionChart;*/

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

const FeatureContributionChart = ({ shapValues = [], predictedClass = null, topN = 5 }) => {
  if (!Array.isArray(shapValues) || shapValues.length === 0) {
    return (
      <div className="p-6 bg-white shadow rounded-2xl text-center">
        <p className="text-gray-500">No feature contributions available.</p>
      </div>
    );
  }

  // Ensure {feature, contribution} format
  const data = shapValues.map(item => ({
    feature: String(item.feature),
    contribution: Number(item.contribution)
  }));

  // Sort by absolute contribution, pick top N, reverse for chart order
  const topData = [...data]
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, topN)
    .reverse();

  // For explanation
  const positiveFeatures = topData.filter(f => f.contribution > 0).map(f => f.feature);
  const negativeFeatures = topData.filter(f => f.contribution < 0).map(f => f.feature);

  /* Decide coloring based on predicted class
  const predLower = predictedClass ? String(predictedClass).toLowerCase() : "";
  const positiveMeansPass =
    predLower.includes("pass") || predLower === "1" || predLower === "true";
*/
const predLower = predictedClass ? String(predictedClass).toLowerCase() : "";
const positiveMeansPass = predLower.includes("pass");  // ✅ simpler, always uses backend label

  const positiveColor = positiveMeansPass ? "#16a34a" : "#ef4444"; // green if pushing PASS
  const negativeColor = positiveMeansPass ? "#ef4444" : "#16a34a"; // red otherwise

  // Text explanation
  const targetLabel = predictedClass ? String(predictedClass) : "the selected class";
  const explanation = `The bars show how each feature moved the model output. Positive bars (green) push the model toward ${targetLabel}; negative bars (red) push it away. Top contributors pushing toward ${targetLabel}: ${
    positiveFeatures.length ? positiveFeatures.join(", ") : "none"
  }. Features pushing away: ${
    negativeFeatures.length ? negativeFeatures.join(", ") : "none"
  }.`;  

  return (
    <div className="p-4 bg-white shadow rounded-2xl mt-6">
      <h2 className="text-lg font-semibold mb-4">Feature Contributions to Prediction</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={topData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={["auto", "auto"]} />
            <YAxis
              dataKey="feature"
              type="category"
              width={140}
              tickFormatter={(val) =>
                val && val.length > 24 ? val.slice(0, 24) + "..." : val
              }
            />
            <Tooltip
              formatter={(val) => Number(val).toFixed(3)}
              contentStyle={{ borderRadius: "10px" }}
            />
            <Bar dataKey="contribution" barSize={22} label={{ position: "right" }}>
              {topData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.contribution > 0 ? positiveColor : negativeColor}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-6 text-center text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
        {explanation}
      </p>
    </div>
  );
};

export default FeatureContributionChart;
