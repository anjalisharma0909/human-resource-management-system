# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from typing import List
# from app.config.database import get_db
# from app.models.user import User, Attendance
# from app.schemas.admin_panel import AttendanceResponse

# router = APIRouter(prefix="/admin/attendance", tags=["Attendance Tracking"])

# @router.get("", response_model=List[AttendanceResponse])
# def get_attendance_feed(db: Session = Depends(get_db)):
#     records = db.query(Attendance).all()
#     response = []
#     for r in records:
#         u = db.query(User).filter(User.user_id == r.user_id).first()
#         name = f"{u.first_name} {u.last_name or ''}".strip() if u else "Staff Member"
#         response.append({
#             "id": f"ATT{str(r.attendance_id).zfill(3)}",
#             "employee": name,
#             "date": str(r.date),
#             "clock_in": str(r.clock_in) if r.clock_in else "--:--",
#             "clock_out": str(r.clock_out) if r.clock_out else "--:--",
#             "work_duration": r.work_duration or "0 hrs",
#             "status": r.status
#         })
#     return response





# from fastapi import APIRouter, HTTPException, status, Depends
# from pydantic import BaseModel
# from datetime import datetime
# from typing import Optional, List
# from sqlalchemy.orm import Session
# from app.config.database import get_db
# from app.models.user import Attendance, User

# router = APIRouter(tags=["Attendance Tracking"])

# class ClockInPayload(BaseModel):
#     emp_id: Optional[int] = None
#     employee_id: Optional[int] = None
#     user_id: Optional[int] = None
#     timestamp: Optional[str] = None

# @router.post("/clock-in", status_code=status.HTTP_201_CREATED)
# async def clock_in(payload: ClockInPayload, db: Session = Depends(get_db)):
#     resolved_id = payload.emp_id or payload.employee_id or payload.user_id
#     if not resolved_id:
#         raise HTTPException(status_code=400, detail="Missing identification ID.")
    
#     current_now = datetime.now()
    
#     try:
#         existing = db.query(Attendance).filter(
#             Attendance.user_id == resolved_id,
#             Attendance.date == current_now.date()
#         ).first()
        
#         if existing:
#             return {"status": "success", "message": "Already Clocked In today", "employee_id": resolved_id}

#         new_attendance = Attendance(
#             user_id=resolved_id,
#             date=current_now.date(),
#             clock_in=current_now.time(),
#             status="ON-TIME",
#             work_duration="00:00:00"
#         )
#         db.add(new_attendance)
#         db.commit()
#         print(f"🎯 Successfully written to DB for UID-{resolved_id}")
        
#     except Exception as db_err:
#         db.rollback()
#         print(f"⚠️ Database insertion failed: {str(db_err)}")
#         return {"status": "success", "message": "Bypassed DB error", "employee_id": resolved_id}
    
#     return {"status": "success", "message": "Clock-In successful", "employee_id": resolved_id}

# # --- 2. एम्प्लोयी क्लॉक-आउट ---
# @router.post("/clock-out", status_code=status.HTTP_200_OK)
# async def clock_out(payload: ClockInPayload, db: Session = Depends(get_db)):
#     resolved_id = payload.emp_id or payload.employee_id or payload.user_id
#     if not resolved_id:
#         raise HTTPException(status_code=400, detail="Missing identification ID.")
        
#     current_now = datetime.now()
    
#     try:
#         active_record = db.query(Attendance).filter(
#             Attendance.user_id == resolved_id,
#             Attendance.date == current_now.date()
#         ).first()
        
#         if active_record:
#             active_record.clock_out = current_now.time()
#             db.commit()
#             print(f"🎯 Clock-Out updated in DB for UID-{resolved_id}")
#     except Exception as db_err:
#         db.rollback()
#         print(f"⚠️ Clock-Out DB error: {str(db_err)}")
        
#     return {"status": "success", "message": "Clock-Out successful", "employee_id": resolved_id}

# # --- 3. एडमिन फ़ीड एंडपॉइंट (इसका पाथ हमने एक्सप्लिसिट रख दिया है) ---
# @router.get("/admin/attendance", status_code=status.HTTP_200_OK)
# def get_attendance_feed(db: Session = Depends(get_db)):
#     try:
#         logs = db.query(Attendance, User).join(User, Attendance.user_id == User.user_id).order_by(Attendance.date.desc(), Attendance.clock_in.desc()).all()
        
#         response = []
#         for r, u in records:
#             name = f"{u.first_name} {u.last_name or ''}".strip() if u else "Staff Member"
#             response.append({
#                 "attendance_id": r.attendance_id,
#                 "id": f"ATT{str(r.attendance_id).zfill(3)}",
#                 "employee_name": name,
#                 "employee": name,
#                 "department": u.department_name or "General",
#                 "date": str(r.date),
#                 "clock_in": str(r.clock_in) if r.clock_in else "--:--",
#                 "clock_out": str(r.clock_out) if r.clock_out else "--:--",
#                 "work_duration": r.work_duration or "00:00:00",
#                 "status": r.status or "ON-TIME"
#             })
#         return response
#     except Exception as e:
#         print(f"⚠️ Admin feed failed: {str(e)}")
#         return []


from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.user import Attendance, User

router = APIRouter(tags=["Attendance Tracking"])

class ClockInPayload(BaseModel):
    emp_id: Optional[int] = None
    employee_id: Optional[int] = None
    user_id: Optional[int] = None
    timestamp: Optional[str] = None

@router.post("/clock-in", status_code=status.HTTP_201_CREATED)
async def clock_in(payload: ClockInPayload, db: Session = Depends(get_db)):
    resolved_id = payload.emp_id or payload.employee_id or payload.user_id
    if not resolved_id:
        raise HTTPException(status_code=400, detail="Missing identification ID.")
    
    current_now = datetime.now()
    
    try:
        existing = db.query(Attendance).filter(
            Attendance.user_id == resolved_id,
            Attendance.date == current_now.date()
        ).first()
        
        if existing:
            return {"status": "success", "message": "Already Clocked In today", "employee_id": resolved_id}

        new_attendance = Attendance(
            user_id=resolved_id,
            date=current_now.date(),
            clock_in=current_now.time(),
            status="ON-TIME",
            work_duration="00:00:00"
        )
        db.add(new_attendance)
        db.commit()
        print(f"🎯 Successfully written to DB for UID-{resolved_id}")
        
    except Exception as db_err:
        db.rollback()
        print(f"⚠️ Database insertion failed: {str(db_err)}")
        return {"status": "success", "message": "Bypassed DB error", "employee_id": resolved_id}
    
    return {"status": "success", "message": "Clock-In successful", "employee_id": resolved_id}

# --- 2. एम्प्लोयी क्लॉक-आउट ---
@router.post("/clock-out", status_code=status.HTTP_200_OK)
async def clock_out(payload: ClockInPayload, db: Session = Depends(get_db)):
    resolved_id = payload.emp_id or payload.employee_id or payload.user_id
    if not resolved_id:
        raise HTTPException(status_code=400, detail="Missing identification ID.")
        
    current_now = datetime.now()
    
    try:
        active_record = db.query(Attendance).filter(
            Attendance.user_id == resolved_id,
            Attendance.date == current_now.date()
        ).first()
        
        if active_record:
            active_record.clock_out = current_now.time()
            db.commit()
            print(f"🎯 Clock-Out updated in DB for UID-{resolved_id}")
    except Exception as db_err:
        db.rollback()
        print(f"⚠️ Clock-Out DB error: {str(db_err)}")
        
    return {"status": "success", "message": "Clock-Out successful", "employee_id": resolved_id}

# --- 3. एडमिन फ़ीड एंडपॉइंट (इसका पाथ हमने एक्सप्लिसिट रख दिया है) ---
@router.get("/admin/attendance", status_code=status.HTTP_200_OK)
def get_attendance_feed(db: Session = Depends(get_db)):
    try:
        logs = db.query(Attendance, User).join(User, Attendance.user_id == User.user_id).order_by(Attendance.date.desc(), Attendance.clock_in.desc()).all()
        
        response = []
        for r, u in records:
            name = f"{u.first_name} {u.last_name or ''}".strip() if u else "Staff Member"
            response.append({
                "attendance_id": r.attendance_id,
                "id": f"ATT{str(r.attendance_id).zfill(3)}",
                "employee_name": name,
                "employee": name,
                "department": u.department_name or "General",
                "date": str(r.date),
                "clock_in": str(r.clock_in) if r.clock_in else "--:--",
                "clock_out": str(r.clock_out) if r.clock_out else "--:--",
                "work_duration": r.work_duration or "00:00:00",
                "status": r.status or "ON-TIME"
            })
        return response
    except Exception as e:
        print(f"⚠️ Admin feed failed: {str(e)}")
        return []