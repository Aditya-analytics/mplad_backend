from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PaginatedResponse(BaseModel):
    data: List[Dict[str, Any]]
    total: int
    page: int
    limit: int
    total_pages: int

class RiskDistribution(BaseModel):
    name: str
    value: int
    color: str

class StateMetric(BaseModel):
    state: str
    anomalies: int
    works: int
    sanctioned: str
    utilization: int
    delayed: int

class GeospatialData(BaseModel):
    id: str
    name: str
    coordinates: List[float]
    riskScore: int

class NationalRiskIndex(BaseModel):
    overall_score: int
    financial_score: int
    delay_score: int
    duplicate_score: int

class OverviewStats(BaseModel):
    total_projects: int
    total_duplicates: int
    total_cost_anomalies: int
    total_delayed: int
    total_compliance_violations: int
    total_disbursed: float
    risk_distribution: List[RiskDistribution]
    state_metrics: List[StateMetric]
    geospatial_data: List[GeospatialData]
    national_risk: NationalRiskIndex

class MonthlyExpenditure(BaseModel):
    month: str
    sanctioned: float
    utilized: float

class StateExpenditure(BaseModel):
    state: str
    sanctioned: float
    utilized: float

class TrendRisk(BaseModel):
    label: str
    anomalyRate: float
    delayRate: float

class FinancialAnalyticsResponse(BaseModel):
    monthlyExpenditure: List[MonthlyExpenditure]
    stateExpenditure: List[StateExpenditure]
    trendRisk: List[TrendRisk]

