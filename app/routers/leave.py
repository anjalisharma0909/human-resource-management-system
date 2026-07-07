from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.user import User, LeaveRequest
from app.schemas.admin_panel import LeaveResponse, LeaveStatusUpdate

router = APIRouter(prefix="/admin/leaves", tags=["Leave Management"])

@router.get("", response_model=List[LeaveResponse])
def get_leave_records(db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).all()
    response = []
    for l in leaves:
        u = db.query(User).filter(User.user_id == l.user_id).first()
        name = f"{u.first_name} {u.last_name or ''}".strip() if u else "Unknown Staff"
        response.append({
            "leave_id": l.leave_id,
            "employee_name": name,
            "leave_type": l.leave_type,
            "dates": f"{l.start_date} to {l.end_date}",
            "reason": l.reason,
            "reviewer": l.reviewer,
            "status": l.status
        })
    return response

@router.put("/{leave_id}")
def update_leave_status(leave_id: int, payload: LeaveStatusUpdate, db: Session = Depends(get_db)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.leave_id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Record not found")
    leave.status = payload.status
    leave.reviewer = payload.reviewer
    db.commit()
    return {"message": f"Leave status updated to {payload.status}"}