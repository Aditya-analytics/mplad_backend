from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PaginatedResponse(BaseModel):
    data: List[Dict[str, Any]]
    total: int
    page: int
    limit: int
    total_pages: int

class OverviewStats(BaseModel):
    total_projects: int
    total_duplicates: int
    total_cost_anomalies: int
    total_delayed: int
    total_compliance_violations: int
