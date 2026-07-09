from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.config.database import get_db
from app.models.user import User, Department, LeaveRequest, Attendance
from app.schemas.admin_panel import DashboardStatsResponse

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/dashboard-stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    emp_count = db.query(User).filter(User.is_deleted == False).count()
    dept_count = db.query(Department).count()
    leave_count = db.query(LeaveRequest).filter(LeaveRequest.status == "Pending").count()
    present_count = db.query(Attendance).filter(Attendance.date == date.today(), Attendance.status.in_(["ON-TIME", "LATE"])).count()

    return {
        "total_employees": emp_count,
        "total_departments": dept_count,
        "pending_leaves": leave_count,
        "today_attendance_present": present_count,
        "today_attendance_total": emp_count,
        "admin_name": "Shruti Sharma"
    }