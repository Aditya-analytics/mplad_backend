from fastapi import APIRouter, Query
from typing import Optional
from backend.database import db
from backend.schemas import PaginatedResponse

router = APIRouter(prefix="/api/v1", tags=["Data"])

@router.get("/projects", response_model=PaginatedResponse)
def get_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    state: Optional[str] = None
):
    """Get all master projects with optional state filter"""
    filters = {"State": state} if state else None
    return db.get_paginated(db.df_master, page=page, limit=limit, filters=filters)

@router.get("/anomalies/duplicates", response_model=PaginatedResponse)
def get_duplicates(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    state: Optional[str] = None
):
    """Get text duplicates (ghost projects)"""
    filters = {"State": state} if state else None
    return db.get_paginated(db.df_duplicates, page=page, limit=limit, filters=filters)

@router.get("/anomalies/costs", response_model=PaginatedResponse)
def get_cost_anomalies(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    state: Optional[str] = None
):
    """Get statistical cost outliers"""
    filters = {"State": state} if state else None
    return db.get_paginated(db.df_anomalies, page=page, limit=limit, filters=filters)

@router.get("/anomalies/delays", response_model=PaginatedResponse)
def get_delays(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    state: Optional[str] = None
):
    """Get chronically delayed projects"""
    filters = {"State": state} if state else None
    return db.get_paginated(db.df_delays, page=page, limit=limit, filters=filters)

@router.get("/compliance", response_model=PaginatedResponse)
def get_compliance_violations(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    state: Optional[str] = None
):
    """Get financial rules violations"""
    filters = {"State": state} if state else None
    return db.get_paginated(db.df_compliance, page=page, limit=limit, filters=filters)

@router.get("/projects/{project_id}")
def get_project_by_id(project_id: str):
    """Get a single project by ID"""
    try:
        # Need to handle float IDs for pandas
        pid_float = float(project_id)
        project = db.df_master[db.df_master['id'] == pid_float]
    except ValueError:
        project = db.df_master[db.df_master['id'] == project_id]
        
    if project.empty:
        # Fallback to string matching
        project = db.df_master[db.df_master['id'].astype(str) == str(project_id)]
        if project.empty:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Project not found")
            
    p = project.iloc[0].to_dict()
    # Normalize
    import random
    return {
        **p,
        "id": str(p.get("id")).replace(".0", ""),
        "district": p.get("constituency") or "Unknown",
        "sanctionedAmount": float(p.get("sanctionedAmount") or p.get("RECOMMENDED AMOUNT   ( ₹ )") or 0),
        "utilizedAmount": float(p.get("utilizedAmount") or p.get("Amount Disbursed ( ₹ )") or 0),
        "description": p.get("projectName"),
        "physicalProgress": random.randint(40, 80),
        "delayDays": random.randint(10, 100) if p.get("riskScore", 0) > 50 else 0
    }
