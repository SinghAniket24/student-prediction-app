

import React, { useEffect, useState } from "react";
import FeatureContributionChart from "../components/FeatureContributionChart";
import UserComparisonBars from "../components/UserComparisonBar";
import { useLocation } from "react-router-dom";

const Analysis = () => {
  const [userComparison, setUserComparison] = useState([]);
  const [shapValues, setShapValues] = useState(null);
  const location = useLocation();
  const { payload , prediction} = location.state || {}; // this is the mapped user input
  console.log("Received payload:", payload);  
  console.log("Prediction:", prediction);

    
    //FEATURE CONTRIBUTION
    
    /* dummy data to test rendering
    const dummy = [
      { feature: "Absences", contribution: -0.15 },
      { feature: "Past Class Failures", contribution: 0.20 },
      { feature: "Family Relationship", contribution: 0.10 },
      { feature: "Weekend Alcohol Consumption", contribution: -0.15 },
      { feature: "Higher Education Ambition", contribution: 0.05 },
    ];
    
    setShapValues(dummy);*/
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

      // Defensive check
      if (!data.shap_values) {
        console.error("No SHAP values received:", data);
        setShapValues([]);
        return;
      }

      const shapArray = 
      data && data.shap_values
      ?Object.entries(data.shap_values).map(([feature, contribution]) => ({
        feature,
        contribution,
      }))
      : [];

      // Optional: log SHAP values for debugging
      console.log("Received SHAP values from backend:", shapArray);
    

      // Optional: top 5 contributors by absolute value
      const topShapArray = shapArray
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
        .slice(0, 5);

      setShapValues(topShapArray);
   

    } catch (err) {
      console.error("Error fetching SHAP values:", err);
    }
  };

  fetchShap();



    //Fetch dataset averages
  
    /*Example static data (replace with backend fetch)
    setUserComparison([
      { feature: "Absences", user: 3, avg: 5 },
      { feature: "Study Time", user: 2, avg: 4 },
      { feature: "Failures", user: 0, avg: 0 },
    ]);*/



  const fetchAverages = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/averages");
      const averages = await res.json();

      // Defensive: make sure averages and payload are valid
      if (!averages || !payload) return;


      // Map into array for your UserComparisonBars component
      const comparison = Object.keys(payload).map((feature) => {
        const userVal = payload[feature];
        const avgVal = averages[feature];

         // Only include if avgVal exists
        if (avgVal === undefined) return null;


        return {
          feature,
          user: Number(userVal), // make sure numeric
          avg: Number(avgVal),
          diff: Number(userVal) - Number(avgVal), // optional: store difference
        };
      }).filter(Boolean); // remove nulls

      setUserComparison(comparison);
    } catch (err) {
      console.error("Error fetching averages:", err);
    }
  };

  fetchAverages();


      return () => {
    isMounted = false; // cleanup
  };

  }, [payload]);


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
