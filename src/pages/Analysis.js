

import React, { useEffect, useState } from "react";
import FeatureContributionChart from "../components/FeatureContributionChart";
import UserComparisonBars from "../components/UserComparisonBar";

const Analysis = () => {
  const [userComparison, setUserComparison] = useState([]);
  const [shapValues, setShapValues] = useState(null);

  useEffect(() => {
    
    //FEATURE CONTRIBUTION
    
    // dummy data to test rendering
    const dummy = [
      { feature: "Absences", contribution: -0.15 },
      { feature: "Past Class Failures", contribution: 0.20 },
      { feature: "Family Relationship", contribution: 0.10 },
      { feature: "Weekend Alcohol Consumption", contribution: -0.15 },
      { feature: "Higher Education Ambition", contribution: 0.05 },
    ];
    
    setShapValues(dummy);
    /*fetch("http://127.0.0.1:5000/shap-values", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInput),
  })
    .then((res) => res.json())
    .then((data) => {
    const shapArray = Object.entries(data.shap_values).map(([feature, contribution]) => ({ feature, contribution }))
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)) // optional: sort
      .slice(0, 5); // optional: top 5 contributors;
      // Convert shapValues to array if it's an object
    const data = Array.isArray(Response.shapValues)
    ? Response.shapValues
    : Object.entries(Response.jsonshapValues).map(([feature, contribution]) => ({ feature, contribution }));
// Optional: sort by absolute contribution and take top 5
    const topShapArray = shapArray
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
      .slice(0, 5);

      setShapValues(shapArray);
    })
    .catch((err) => console.error("Error fetching SHAP values:", err));
*/

    //Fetch dataset averages
  
    //Example static data (replace with backend fetch)
    setUserComparison([
      { feature: "Absences", user: 3, avg: 5 },
      { feature: "Study Time", user: 2, avg: 4 },
      { feature: "Failures", user: 0, avg: 0 },
    ]);
  }, []);


    return (
  
      <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Analysis</h1>
      
      {/* SHAP Feature Contribution */}
      <FeatureContributionChart shapValues={shapValues} />

      {/* User Comparison */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Input vs Dataset Average</h2>
        <UserComparisonBars averages={userComparison} />
      </div>
    </div>
  );
};

export default Analysis;
