# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.config.database import engine, Base

# from app.routers import auth, dashboard, employees, departments, leave, attendance

# Base.metadata.create_all(bind=engine)

# app = FastAPI(
#     title="HRMS Backend API",
#     description="Scalable Backend for Human Resource Management System",
#     version="1.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], 
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# app.include_router(auth.router, prefix="/api/v1")
# app.include_router(dashboard.router, prefix="/api/v1")
# app.include_router(employees.router, prefix="/api/v1")
# app.include_router(departments.router, prefix="/api/v1")
# app.include_router(leave.router, prefix="/api/v1")

# app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])


# @app.get("/")
# def root():
#     return {"status": "HRMS Backend Running successfully"}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
from app.routers import auth, dashboard, employees, departments, leave, attendance

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Backend API",
    description="Scalable Backend for Human Resource Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(employees.router, prefix="/api/v1")
app.include_router(departments.router, prefix="/api/v1")
app.include_router(leave.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"status": "HRMS Backend Running successfully"}