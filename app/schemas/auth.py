# from pydantic import BaseModel, EmailStr, Field
# from typing import Optional
# from datetime import datetime

# # Signup Request Schema
# class SignupSchema(BaseModel):
#     first_name: str = Field(..., max_length=50)
#     last_name: Optional[str] = Field(None, max_length=50)
#     department_name: Optional[str] = Field(None, max_length=100)
#     email: EmailStr
#     password: str = Field(..., min_length=6)
#     role: str = Field(..., description="Must be 'Admin' or 'Employee'")

#     class Config:
#         from_attributes = True

# # Login Request 
# class LoginSchema(BaseModel):
#     email: EmailStr
#     password: str

# # Token Response 
# class TokenResponse(BaseModel):
#     access_token: str
#     refresh_token: str
#     token_type: str = "bearer"
#     role: str
#     message: str


from pydantic import BaseModel, EmailStr
from typing import Optional

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    department_name: str
    email: EmailStr
    password: str
    role: str # 'Admin' ya 'Employee'

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    user_id: int
    first_name: str
    role: str
    email: str

    class Config:
        from_attributes = True