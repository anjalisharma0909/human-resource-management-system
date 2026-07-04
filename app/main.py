from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base
from app.routers import auth  
# Automatically database mein tables banane ke liye
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Backend API",
    description="Scalable Backend for Human Resource Management System",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"status": "HRMS Backend Running successfully"}