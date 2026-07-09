# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app.config.database import get_db
# from app.models.user import User
# from app.schemas.auth import SignupSchema, LoginSchema, TokenResponse
# from app.utils.security import hash_password, verify_password, create_tokens

# router = APIRouter(prefix="/auth", tags=["Authentication"])


# @router.post("/signup", status_code=status.HTTP_201_CREATED)
# def signup(payload: SignupSchema, db: Session = Depends(get_db)):

#     existing_user = db.query(User).filter(User.email == payload.email).first()

#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Email already registered"
#         )
#     role = payload.role.strip().capitalize()

#     # Validate 
#     if role not in ["Admin", "Employee"]:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Invalid role. Allowed roles are 'Admin' or 'Employee'"
#         )

#     # Createuser
#     new_user = User(
#         first_name=payload.first_name,
#         last_name=payload.last_name,
#         department_name=payload.department_name,
#         email=payload.email,
#         password_hash=hash_password(payload.password),
#         role=role
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     return {
#         "message": f"{role} registered successfully",
#         "user_id": new_user.user_id
#     }


# @router.post("/login", response_model=TokenResponse)
# def login(payload: LoginSchema, db: Session = Depends(get_db)):
#     # For email
#     user = db.query(User).filter(
#         User.email == payload.email,
#         User.is_deleted == False
#     ).first()

#     # Validate
#     if not user or not verify_password(payload.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid email or password"
#         )

#     #  tokens
#     access_token, refresh_token = create_tokens(
#         user_id=user.user_id,
#         role=user.role
#     )

#     return {
#         "access_token": access_token,
#         "refresh_token": refresh_token,
#         "token_type": "bearer",
#         "role": user.role,
#         "message": "Login successful"
#     }

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db  # Hum main.py ki tarah standard dependency use karenge
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest

# FIX: Humne prefix ko sirf "/auth" kar diya hai, kyunki main.py iske aage "/api/v1" automatically laga dega.
# Ab iska sahi URL banega: http://127.0.0.1:8000/api/v1/auth/signup
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
async def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # 2. Creating fresh user instance matching your database structure
    new_user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        department_name=payload.department_name,
        email=payload.email,
        password_hash=payload.password,  # standard string storage fallback
        role=payload.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Account created successfully", "user_id": new_user.user_id}

@router.post("/login")
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    
    if not user or user.password_hash != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )
    
    return {
        "message": "Login successful",
        "user_id": user.user_id,
        "role": user.role,  # Returns 'Admin' or 'Employee'
        "first_name": user.first_name
    }