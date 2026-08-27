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
