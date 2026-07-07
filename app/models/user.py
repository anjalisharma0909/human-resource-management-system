from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, Date, Time, Numeric
from sqlalchemy.sql import func
from app.config.database import Base

class User(Base):
    __tablename__ = "signupforboth"
    __table_args__ = {"schema": "public"}

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    department_name = Column(String(100), nullable=True)
    email = Column(String(150), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    is_deleted = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class Department(Base):
    __tablename__ = "departments"
    __table_args__ = {"schema": "public"}
    
    department_id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), nullable=False, unique=True)
    annual_budget = Column(Numeric(12, 2), default=0.00)
    manager_name = Column(String(100), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = {"schema": "public"}
    
    attendance_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("public.signupforboth.user_id", ondelete="CASCADE"))
    date = Column(Date, server_default=func.current_date())
    clock_in = Column(Time, nullable=True)
    clock_out = Column(Time, nullable=True)
    work_duration = Column(String(20), nullable=True)
    status = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    __table_args__ = {"schema": "public"}
    
    leave_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("public.signupforboth.user_id", ondelete="CASCADE"))
    leave_type = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String, nullable=True)
    reviewer = Column(String(100), nullable=True)
    status = Column(String(20), default="Pending")
    created_at = Column(TIMESTAMP, server_default=func.now())