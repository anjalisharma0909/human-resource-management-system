from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.user import User, LeaveRequest
from app.schemas.admin_panel import EmployeeListResponse

router = APIRouter(prefix="/admin/employees", tags=["Employee Management"])

@router.get("", response_model=List[EmployeeListResponse])
def get_all_employees(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_deleted == False).all()
    response = []
    for u in users:
        is_on_leave = db.query(LeaveRequest).filter(LeaveRequest.user_id == u.user_id, LeaveRequest.status == "APPROVED").count() > 0
        response.append({
            "employee_id": f"EMP{str(u.user_id).zfill(3)}",
            "name": f"{u.first_name} {u.last_name or ''}".strip(),
            "email": u.email,
            "department": u.department_name or "Not Assigned",
            "role": u.role,
            "status": "ON LEAVE" if is_on_leave else "ACTIVE",
            "salary": 75000.00
        })
    return response