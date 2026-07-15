# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from app.config.database import get_db
# from app.models.user import User, LeaveRequest
# from app.schemas.admin_panel import LeaveResponse, LeaveStatusUpdate

# router = APIRouter(prefix="/admin/leaves", tags=["Leave Management"])

# @router.get("", response_model=List[LeaveResponse])
# def get_leave_records(db: Session = Depends(get_db)):
#     leaves = db.query(LeaveRequest).all()
#     response = []
#     for l in leaves:
#         u = db.query(User).filter(User.user_id == l.user_id).first()
#         name = f"{u.first_name} {u.last_name or ''}".strip() if u else "Unknown Staff"
#         response.append({
#             "leave_id": l.leave_id,
#             "employee_name": name,
#             "leave_type": l.leave_type,
#             "dates": f"{l.start_date} to {l.end_date}",
#             "reason": l.reason,
#             "reviewer": l.reviewer,
#             "status": l.status
#         })
#     return response

# @router.put("/{leave_id}")
# def update_leave_status(leave_id: int, payload: LeaveStatusUpdate, db: Session = Depends(get_db)):
#     leave = db.query(LeaveRequest).filter(LeaveRequest.leave_id == leave_id).first()
#     if not leave:
#         raise HTTPException(status_code=404, detail="Record not found")
#     leave.status = payload.status
#     leave.reviewer = payload.reviewer
#     db.commit()
#     return {"message": f"Leave status updated to {payload.status}"}



from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel, Field
from app.config.database import get_db
from app.models.user import User, LeaveRequest
from app.schemas.admin_panel import LeaveResponse, LeaveStatusUpdate

# Main Router Configuration with prefix
router = APIRouter(prefix="/leave", tags=["Leave Management"])

class EmployeeLeaveApplyPayload(BaseModel):
    user_id: int = Field(..., description="ID of the employee applying for leave")
    leave_type: str = Field(..., description="Casual Leave, Sick Leave, or Earned Leave")
    start_date: str = Field(..., description="YYYY-MM-DD format start date")
    end_date: str = Field(..., description="YYYY-MM-DD format end date")
    reason: str = Field(..., description="Contextual reason for authorization")

class EmployeeLeaveLogResponse(BaseModel):
    leave_type: str
    dates: str
    reason: str
    status: str

    class Config:
        from_attributes = True


@router.get("/all-requests")
async def get_all_leave_requests(db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).order_by(LeaveRequest.leave_id.desc()).all()
    response = []
    
    for l in leaves:
        u = db.query(User).filter(User.user_id == l.user_id).first()
        response.append({
            "leave_id": l.leave_id,
            "first_name": u.first_name if u else "Unknown Staff",
            "last_name": u.last_name if u else "",
            "department_name": u.department_name if u else "General",
            "leave_type": l.leave_type,
            "start_date": str(l.start_date),
            "end_date": str(l.end_date),
            "reason": l.reason or "",
            "status": l.status or "Pending"
        })
    return response

# Full URL: http://127.0.0.1:8000/api/v1/leave/admin/leaves
@router.get("/admin/leaves", response_model=List[LeaveResponse])
def get_leave_records(db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).order_by(LeaveRequest.leave_id.desc()).all()
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

# Full URL: http://127.0.0.1:8000/api/v1/leave/admin/leaves/{leave_id}
@router.put("/admin/leaves/{leave_id}")
def update_leave_status(leave_id: int, payload: LeaveStatusUpdate, db: Session = Depends(get_db)):
    leave = db.query(LeaveRequest).filter(LeaveRequest.leave_id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Record not found")
    
    leave.status = payload.status
    leave.reviewer = payload.reviewer
    db.commit()
    return {"message": f"Leave status updated to {payload.status}"}


# Full URL: http://127.0.0.1:8000/api/v1/leave/employee/apply-leave
@router.post("/employee/apply-leave")
def employee_apply_leave(payload: EmployeeLeaveApplyPayload, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.user_id == payload.user_id).first()
    if not user_exists:
        raise HTTPException(status_code=404, detail="Employee record not found in system")

    try:
        parsed_start = datetime.strptime(payload.start_date, "%Y-%m-%d").date()
        parsed_end = datetime.strptime(payload.end_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date layout format. Use YYYY-MM-DD")

    new_leave = LeaveRequest(
        user_id=payload.user_id,
        leave_type=payload.leave_type,
        start_date=parsed_start,
        end_date=parsed_end,
        reason=payload.reason,
        status="Pending",       
        reviewer="None"         
    )
    
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    
    return {"status": "Success", "message": "Leave application sent to Admin successfully!"}


# Full URL: http://127.0.0.1:8000/api/v1/leave/employee/my-leaves
# @router.get("/employee/my-leaves", response_model=List[EmployeeLeaveLogResponse])
# def get_employee_own_leaves(emp_id: int, db: Session = Depends(get_db)):
#     my_leaves = db.query(LeaveRequest).filter(LeaveRequest.user_id == emp_id).order_by(LeaveRequest.leave_id.desc()).all()
    
#     response = []
#     for l in my_leaves:
#         response.append({
#             "leave_type": l.leave_type,
#             "dates": f"{l.start_date} to {l.end_date}",
#             "reason": l.reason or "",
#             "status": l.status
#         })
#     return response
@router.get("/all-requests")
async def get_all_leave_requests(db: Session = Depends(get_db)):
    leaves = db.query(LeaveRequest).order_by(LeaveRequest.leave_id.desc()).all()
    response = []
    
    for l in leaves:
        u = db.query(User).filter(User.user_id == l.user_id).first()
        
        first_name = u.first_name if u else f"Employee ID: {l.user_id}"
        last_name = u.last_name if (u and u.last_name) else ""
        
        response.append({
            "leave_id": l.leave_id,
            "first_name": first_name,
            "last_name": last_name,
            "department_name": u.department_name if u else "General",
            "leave_type": l.leave_type,
            "start_date": str(l.start_date),
            "end_date": str(l.end_date),
            "reason": l.reason or "",
            "status": l.status or "Pending"
        })
    return response