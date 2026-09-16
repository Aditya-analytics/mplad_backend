import axios from 'axios';

async function test() {
  try {
    const response = await axios.get('http://localhost:5001/api/v1/stats/overview');
    const data = response.data;
    const disbursedInCr = data.total_disbursed / 10000000;
    console.log("disbursedInCr:", disbursedInCr);
    console.log("disbursedInCr.toFixed(1):", disbursedInCr.toFixed(1));
    
    // Simulate dashboardService
    const summary = {
      totalProjects: data.total_projects,
      flaggedProjects: data.total_duplicates + data.total_cost_anomalies + data.total_delayed,
      criticalAlerts: data.total_compliance_violations,
      totalDisbursed: `₹${disbursedInCr.toFixed(1)} Cr`,
    };
    console.log("Summary:", summary);
    console.log("Geo:", data.geospatial_data.length);
    console.log("Nat:", data.national_risk);
  } catch (err) {
    console.error("FAIL:", err.message);
  }
}

test();
