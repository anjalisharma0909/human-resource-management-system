from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.user import User, Department
from app.schemas.admin_panel import DepartmentResponse, DepartmentCreate

router = APIRouter(prefix="/admin/departments", tags=["Department Management"])

@router.get("", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    depts = db.query(Department).all()
    response = []
    for d in depts:
        count = db.query(User).filter(User.department_name == d.department_name, User.is_deleted == False).count()
        response.append({
            "department_id": d.department_id,
            "department_name": d.department_name,
            "annual_budget": float(d.annual_budget),
            "manager_name": d.manager_name,
            "members_count": count
        })
    return response

@router.post("", status_code=status.HTTP_201_CREATED)
def create_department(payload: DepartmentCreate, db: Session = Depends(get_db)):
    new_dept = Department(
        department_name=payload.department_name,
        annual_budget=payload.annual_budget,
        manager_name=payload.manager_name
    )
    db.add(new_dept)
    db.commit()
    return {"message": "Department added successfully!"}