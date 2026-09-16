from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import datetime
import uuid

router = APIRouter(prefix="/api/v1/citizen", tags=["Citizen"])

SUBMISSION_STATUS = {
    "SUBMITTED": "SUBMITTED",
    "UNDER_REVIEW": "UNDER_REVIEW",
    "APPROVED": "APPROVED",
    "REJECTED": "REJECTED",
    "ACTION_INITIATED": "ACTION_INITIATED",
    "RESOLVED": "RESOLVED",
    "CLOSED": "CLOSED",
}

# In-memory mock database for Citizen Submissions
citizen_db = [
    {
        "id": "SUB-2026-004821",
        "referenceId": "MPL-CIT-2026-004821",
        "type": "COMPLAINT",
        "projectId": "MPLAD-2026-004",
        "projectTitle": "Construction of Community Health Center Ward 12",
        "category": "Incomplete Work",
        "categoryLabel": "Incomplete Work",
        "citizenName": "Pooja Deshmukh",
        "citizenEmail": "verified@demo.in",
        "isVerified": True,
        "district": "Pune",
        "state": "Maharashtra",
        "date": "2026-02-28T09:40:00.000Z",
        "status": SUBMISSION_STATUS["UNDER_REVIEW"],
        "rating": None,
        "content": "The official dashboard reports this Community Health Center as 100% complete and handed over on 15 Feb 2026. However, on-ground inspection reveals that the top floor lacks roof waterproofing, external plastering is missing, and electrical wiring is incomplete. No medical staff or equipment are present.",
        "evidence": [
            {
                "name": "site_facade_inspection.jpg",
                "size": "2.4 MB",
                "type": "image/jpeg",
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=600&q=80",
            },
        ],
        "aiCorrelation": "Multiple citizen reports are associated with this project. Potential risk signal detected \u2014 administrative review required.",
        "timeline": [
            { "step": "Submitted", "date": "2026-02-28 09:40", "done": True, "note": "Submitted by citizen via MPLADS portal" },
            { "step": "Received by Administrator", "date": "2026-02-28 10:15", "done": True, "note": "Logged in MoSPI Central Grievance Ledger" },
            { "step": "Under Review", "date": "2026-03-01 11:30", "done": True, "note": "Assigned to District Vigilance Officer, Pune Collectorate" },
            { "step": "Action Initiated", "date": None, "done": False, "note": "Statutory inspection memo pending" },
            { "step": "Resolved", "date": None, "done": False, "note": "Rectification & final compliance audit" },
        ],
    },
    {
        "id": "SUB-2026-003192",
        "referenceId": "MPL-CIT-2026-003192",
        "type": "COMMENT",
        "projectId": "MPLAD-2026-001",
        "projectTitle": "Solar High-Mast Lighting at Public Bus Stand",
        "category": "Work Progress",
        "categoryLabel": "Work Progress",
        "citizenName": "Pooja Deshmukh",
        "citizenEmail": "verified@demo.in",
        "isVerified": True,
        "district": "Pune",
        "state": "Maharashtra",
        "date": "2026-03-01T14:15:00.000Z",
        "status": SUBMISSION_STATUS["APPROVED"],
        "rating": 4,
        "content": "Three out of four high masts illuminate the depot grounds brightly. The night visibility for commuters has significantly improved. Awaiting completion of the final terminal mast near platform 4.",
        "evidence": [],
        "aiCorrelation": "Sentiment analysis positive. Alignment with reported 85% completion.",
        "timeline": [
            { "step": "Submitted", "date": "2026-03-01 14:15", "done": True, "note": "Submitted by citizen" },
            { "step": "Approved for Public Display", "date": "2026-03-02 10:00", "done": True, "note": "Approved by MoSPI Content Moderator" },
        ],
    }
]

class SubmissionCreate(BaseModel):
    type: str
    projectId: str
    projectTitle: str
    category: str
    categoryLabel: str
    citizenName: str
    citizenEmail: str
    isVerified: bool
    district: str
    state: str
    content: str
    rating: Optional[int] = None
    categoriesRating: Optional[dict] = None
    evidence: Optional[list] = []

@router.get("/submissions")
def get_submissions(email: Optional[str] = None):
    """Get all submissions, optionally filtered by email"""
    if email:
        return [sub for sub in citizen_db if sub["citizenEmail"] == email]
    return citizen_db

@router.post("/submissions")
def create_submission(submission: SubmissionCreate):
    """Create a new citizen submission"""
    new_id = f"SUB-2026-{uuid.uuid4().hex[:6].upper()}"
    
    new_sub = {
        "id": new_id,
        "referenceId": f"MPL-CIT-{new_id}",
        "type": submission.type,
        "projectId": submission.projectId,
        "projectTitle": submission.projectTitle,
        "category": submission.category,
        "categoryLabel": submission.categoryLabel,
        "citizenName": submission.citizenName,
        "citizenEmail": submission.citizenEmail,
        "isVerified": submission.isVerified,
        "district": submission.district,
        "state": submission.state,
        "date": datetime.datetime.utcnow().isoformat() + "Z",
        "status": SUBMISSION_STATUS["SUBMITTED"],
        "rating": submission.rating,
        "categoriesRating": submission.categoriesRating,
        "content": submission.content,
        "evidence": submission.evidence,
        "aiCorrelation": "Pending AI Analysis",
        "timeline": [
            { "step": "Submitted", "date": datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M'), "done": True, "note": "Submitted by citizen" }
        ]
    }
    
    citizen_db.insert(0, new_sub) # Add to top
    return new_sub

@router.delete("/submissions/{sub_id}")
def delete_submission(sub_id: str, email: str):
    """Delete a submission by ID and verifying email"""
    global citizen_db
    for idx, sub in enumerate(citizen_db):
        if sub["id"] == sub_id:
            if sub["citizenEmail"] == email:
                deleted = citizen_db.pop(idx)
                return {"status": "success", "message": "Deleted successfully"}
            else:
                raise HTTPException(status_code=403, detail="Unauthorized")
    raise HTTPException(status_code=404, detail="Not found")

@router.put("/submissions/{sub_id}/status")
def update_submission_status(sub_id: str, status: str):
    """Update status of a submission (for Admin)"""
    for sub in citizen_db:
        if sub["id"] == sub_id:
            if status in SUBMISSION_STATUS.values():
                sub["status"] = status
                sub["timeline"].append({
                    "step": f"Status updated to {status}",
                    "date": datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M'),
                    "done": True,
                    "note": "Admin action"
                })
                return sub
            else:
                raise HTTPException(status_code=400, detail="Invalid status")
    raise HTTPException(status_code=404, detail="Not found")
