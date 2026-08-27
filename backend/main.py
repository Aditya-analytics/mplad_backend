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

@app.get("/api/v1/stats/overview", response_model=OverviewStats, tags=["Stats"])
def get_overview_stats():
    """Get high level statistics for the dashboard"""
    return {
        "total_projects": len(db.df_master),
        "total_duplicates": len(db.df_duplicates),
        "total_cost_anomalies": len(db.df_anomalies),
        "total_delayed": len(db.df_delays),
        "total_compliance_violations": len(db.df_compliance)
    }

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "MPLADS API is running"}
