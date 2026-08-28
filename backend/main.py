from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import data_routes
from backend.schemas import OverviewStats
from backend.database import db

app = FastAPI(
    title="MPLADS AI Backend API",
    description="Intelligent monitoring and auditing of MPLADS projects",
    version="1.0.0"
)

# Enable CORS for the React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon we allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_routes.router)

import pandas as pd

# Basic coordinate map for Indian states to render the geospatial map
STATE_COORDS = {
    "Andaman and Nicobar Islands": [92.6586, 11.7401],
    "Andhra Pradesh": [79.7400, 15.9129],
    "Arunachal Pradesh": [94.7278, 28.2180],
    "Assam": [92.9376, 26.2006],
    "Bihar": [85.3131, 25.0961],
    "Chandigarh": [76.7794, 30.7333],
    "Chhattisgarh": [81.8661, 21.2787],
    "Dadra and Nagar Haveli": [73.0169, 20.1809],
    "Daman and Diu": [73.0169, 20.1809],
    "Delhi": [77.1025, 28.7041],
    "Goa": [74.1240, 15.2993],
    "Gujarat": [71.1924, 22.2587],
    "Haryana": [76.0856, 29.0588],
    "Himachal Pradesh": [77.1734, 31.1048],
    "Jammu and Kashmir": [74.7973, 34.0837],
    "Jharkhand": [85.3096, 23.6102],
    "Karnataka": [75.7139, 15.3173],
    "Kerala": [76.2711, 10.8505],
    "Ladakh": [77.5771, 34.1526],
    "Lakshadweep": [72.6417, 10.5667],
    "Madhya Pradesh": [78.6569, 22.9734],
    "Maharashtra": [75.7139, 19.7515],
    "Manipur": [93.9063, 24.6637],
    "Meghalaya": [91.3662, 25.4670],
    "Mizoram": [92.9376, 23.1645],
    "Nagaland": [94.5624, 26.1584],
    "Odisha": [85.0985, 20.9517],
    "Puducherry": [79.8083, 11.9416],
    "Punjab": [75.3412, 31.1471],
    "Rajasthan": [74.2179, 27.0238],
    "Sikkim": [88.5122, 27.5330],
    "Tamil Nadu": [78.6569, 11.1271],
    "Telangana": [79.0159, 18.1124],
    "Tripura": [91.9882, 23.9408],
    "Uttar Pradesh": [80.9462, 26.8467],
    "Uttarakhand": [79.0193, 30.0668],
    "West Bengal": [87.8550, 22.9868],
}

@app.get("/api/v1/stats/overview", response_model=OverviewStats, tags=["Stats"])
def get_overview_stats():
    """Get high level statistics for the dashboard"""
    # 1. Total Disbursed (sum of Amount Disbursed column)
    # Handle possible NaN or string values
    amount_col = "Amount Disbursed ( ₹ )"
    total_disbursed_val = 0.0
    if amount_col in db.df_master.columns:
        total_disbursed_val = float(pd.to_numeric(db.df_master[amount_col], errors='coerce').fillna(0).sum())
    
    # 2. Risk Distribution
    total_duplicates = len(db.df_duplicates)
    total_cost_anomalies = len(db.df_anomalies)
    total_delayed = len(db.df_delays)
    total_compliance = len(db.df_compliance)
    
    risk_distribution = [
        {"name": "High Risk (Compliance & Fraud)", "value": total_duplicates + total_compliance, "color": "#DC2626"},
        {"name": "Medium Risk (Cost Outliers)", "value": total_cost_anomalies, "color": "#F59E0B"},
        {"name": "Low Risk (Schedule Delays)", "value": total_delayed, "color": "#3B82F6"}
    ]
    
    # 3. State Metrics
    # Count occurrences across all anomaly dataframes
    state_counts = {}
    
    # Initialize all states from master database
    if "state" in db.df_master.columns:
        for st in db.df_master["state"].dropna().unique():
            state_counts[st] = 0
            
    for df in [db.df_duplicates, db.df_anomalies, db.df_delays, db.df_compliance]:
        if "State" in df.columns:
            counts = df["State"].value_counts().to_dict()
            for state, count in counts.items():
                # Try to map exactly, or case-insensitive if needed
                matched = False
                for k in state_counts.keys():
                    if k.lower() == str(state).lower():
                        state_counts[k] += count
                        matched = True
                        break
                if not matched:
                    state_counts[state] = count
                
    # Sort
    sorted_states = sorted(state_counts.items(), key=lambda x: x[1], reverse=True)
    
    state_metrics = []
    for s_tuple in sorted_states:
        s_name = s_tuple[0]
        s_anomalies = s_tuple[1]
        
        # Calculate state specifics
        # Note: df_master has 'state', df_delays has 'State' (often inconsistent casing)
        works_count = len(db.df_master[db.df_master['state'].str.lower() == s_name.lower()]) if 'state' in db.df_master.columns else 0
        delayed_count = len(db.df_delays[db.df_delays['State'].str.lower() == s_name.lower()]) if 'State' in db.df_delays.columns else 0
        
        s_sanctioned_val = 0.0
        s_disbursed_val = 0.0
        
        if 'state' in db.df_master.columns:
            state_df = db.df_master[db.df_master['state'].str.lower() == s_name.lower()]
            if 'sanctionedAmount' in state_df.columns:
                s_sanctioned_val = float(pd.to_numeric(state_df['sanctionedAmount'], errors='coerce').fillna(0).sum())
            if 'Amount Disbursed ( ₹ )' in state_df.columns:
                s_disbursed_val = float(pd.to_numeric(state_df['Amount Disbursed ( ₹ )'], errors='coerce').fillna(0).sum())
                
        s_sanctioned_str = f"₹{s_sanctioned_val / 10000000:.1f} Cr" if s_sanctioned_val > 0 else "₹0 Cr"
        s_utilization = int((s_disbursed_val / s_sanctioned_val) * 100) if s_sanctioned_val > 0 else 80
        
        state_metrics.append({
            "state": s_name, 
            "anomalies": s_anomalies,
            "works": works_count,
            "sanctioned": s_sanctioned_str,
            "utilization": min(100, s_utilization), # Cap at 100%
            "delayed": delayed_count
        })
    
    # 4. Geospatial Data
    geospatial_data = []
    max_anomalies = max(state_counts.values()) if state_counts else 1
    for state, count in sorted_states:
        if state in STATE_COORDS:
            # Calculate a risk score between 0 and 100 based on relative volume
            risk_score = int((count / max_anomalies) * 100)
            geospatial_data.append({
                "id": state.upper().replace(" ", "_"),
                "name": state,
                "coordinates": STATE_COORDS[state],
                "riskScore": max(10, risk_score) # Give at least 10 for visibility
            })

    # 5. National Risk Index
    total_projects = len(db.df_master)
    # Simple relative scaling for demonstration (multiplying to make percentages visible)
    fin_pct = min(100, int((total_cost_anomalies / total_projects) * 100 * 15)) if total_projects else 10
    delay_pct = min(100, int((total_delayed / total_projects) * 100 * 5)) if total_projects else 10
    dup_pct = min(100, int((total_duplicates / total_projects) * 100 * 5)) if total_projects else 10
    overall_score = int((fin_pct + delay_pct + dup_pct) / 3)
    
    national_risk = {
        "overall_score": overall_score,
        "financial_score": fin_pct,
        "delay_score": delay_pct,
        "duplicate_score": dup_pct
    }

    return {
        "total_projects": total_projects,
        "total_duplicates": total_duplicates,
        "total_cost_anomalies": total_cost_anomalies,
        "total_delayed": total_delayed,
        "total_compliance_violations": total_compliance,
        "total_disbursed": total_disbursed_val,
        "risk_distribution": risk_distribution,
        "state_metrics": state_metrics,
        "geospatial_data": geospatial_data,
        "national_risk": national_risk
    }

from backend.schemas import FinancialAnalyticsResponse

@app.get("/api/v1/analytics", response_model=FinancialAnalyticsResponse, tags=["Analytics"])
def get_financial_analytics():
    """Get rich analytical data from live dataset for Financial Analytics dashboard"""
    
    # 1. Monthly Expenditure (Mocking timeline based on Sanction Date / amount for now, as exact time-series might not exist perfectly)
    # We will generate a rolling window of last 8 'months' based on distribution of sanitized data
    monthly_expenditure = [
        {"month": "Jan", "sanctioned": 320, "utilized": 280},
        {"month": "Feb", "sanctioned": 410, "utilized": 340},
        {"month": "Mar", "sanctioned": 580, "utilized": 490},
        {"month": "Apr", "sanctioned": 450, "utilized": 380},
        {"month": "May", "sanctioned": 620, "utilized": 510},
        {"month": "Jun", "sanctioned": 710, "utilized": 600},
        {"month": "Jul", "sanctioned": 890, "utilized": 740},
        {"month": "Aug", "sanctioned": 950, "utilized": 810}
    ] # Simplified time-series generation
    
    # 2. State Expenditure Breakdown
    state_totals = {}
    if "state" in db.df_master.columns:
        for state in db.df_master["state"].dropna().unique():
            subset = db.df_master[db.df_master["state"] == state]
            sanc = float(pd.to_numeric(subset["sanctionedAmount"], errors="coerce").fillna(0).sum())
            util = float(pd.to_numeric(subset["Amount Disbursed ( ₹ )"], errors="coerce").fillna(0).sum())
            state_totals[state] = {"sanctioned": sanc, "utilized": util}
                
    # Sort and take top 7 states by sanctioned amount
    sorted_states = sorted(state_totals.items(), key=lambda x: x[1]["sanctioned"], reverse=True)[:7]
    state_expenditure = []
    for state, amounts in sorted_states:
        state_expenditure.append({
            "state": str(state),
            "sanctioned": amounts["sanctioned"],
            "utilized": amounts["utilized"]
        })
        
    if not state_expenditure: # Fallback if empty
        state_expenditure = [{"state": "General", "sanctioned": 1000000.0, "utilized": 800000.0}]
        
    # 3. Trend Risk (Simplistic mapping for now)
    trend_risk = [
        {"label": "Jan", "anomalyRate": 12.4, "delayRate": 8.2},
        {"label": "Feb", "anomalyRate": 14.1, "delayRate": 9.1},
        {"label": "Mar", "anomalyRate": 11.8, "delayRate": 7.8},
        {"label": "Apr", "anomalyRate": 16.5, "delayRate": 11.4},
        {"label": "May", "anomalyRate": 18.2, "delayRate": 12.9},
        {"label": "Jun", "anomalyRate": 15.0, "delayRate": 10.1},
        {"label": "Jul", "anomalyRate": 19.8, "delayRate": 14.2},
        {"label": "Aug", "anomalyRate": 22.1, "delayRate": 15.8}
    ]

    return {
        "monthlyExpenditure": monthly_expenditure,
        "stateExpenditure": state_expenditure,
        "trendRisk": trend_risk
    }

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "MPLADS API is running"}
