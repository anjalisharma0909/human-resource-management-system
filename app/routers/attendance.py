from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.user import User, Attendance
from app.schemas.admin_panel import AttendanceResponse

router = APIRouter(prefix="/admin/attendance", tags=["Attendance Tracking"])

@router.get("", response_model=List[AttendanceResponse])
def get_attendance_feed(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    response = []
    for r in records:
        u = db.query(User).filter(User.user_id == r.user_id).first()
        name = f"{u.first_name} {u.last_name or ''}".strip() if u else "Staff Member"
        response.append({
            "id": f"ATT{str(r.attendance_id).zfill(3)}",
            "employee": name,
            "date": str(r.date),
            "clock_in": str(r.clock_in) if r.clock_in else "--:--",
            "clock_out": str(r.clock_out) if r.clock_out else "--:--",
            "work_duration": r.work_duration or "0 hrs",
            "status": r.status
        })
    return response