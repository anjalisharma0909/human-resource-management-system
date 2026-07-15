from pydantic import BaseModel
from typing import List, Optional

class DashboardStatsResponse(BaseModel):
    total_employees: int
    total_departments: int
    pending_leaves: int
    today_attendance_present: int
    today_attendance_total: int
    admin_name: str

class EmployeeListResponse(BaseModel):
    employee_id: str
    name: str
    email: str
    department: Optional[str]
    role: str
    status: str
    salary: float

class DepartmentCreate(BaseModel):
    department_name: str
    annual_budget: float
    manager_name: str

class DepartmentResponse(BaseModel):
    department_id: int
    department_name: str
    annual_budget: float
    manager_name: Optional[str]
    members_count: int

class LeaveStatusUpdate(BaseModel):
    status: str
    reviewer: str

class LeaveResponse(BaseModel):
    leave_id: int
    employee_name: str
    leave_type: str
    dates: str
    reason: Optional[str]
    reviewer: Optional[str]
    status: str

class AttendanceResponse(BaseModel):
    id: str
    employee: str
    date: str
    clock_in: Optional[str]
    clock_out: Optional[str]
    work_duration: Optional[str]
    status: str