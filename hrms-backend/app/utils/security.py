# from datetime import datetime, timedelta
# from jose import JWTError, jwt
# from passlib.context import CryptContext

# SECRET_KEY = "SUPER_SECRET_KEY_DONT_SHARE"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30
# REFRESH_TOKEN_EXPIRE_DAYS = 7

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# def create_tokens(user_id: int, role: str):
#     # Access Token
#     access_expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_payload = {"sub": str(user_id), "role": role, "exp": access_expire, "type": "access"}
#     access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
    
#     # Refresh Token
#     refresh_expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
#     refresh_payload = {"sub": str(user_id), "exp": refresh_expire, "type": "refresh"}
#     refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)
    
#     return access_token, refresh_token



import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 7

def hash_password(password: str) -> str:
    # bcrypt has a 72-byte limit – truncate if needed
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate plain password to 72 bytes before verifying
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))

def create_tokens(user_id: int, role: str):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    access_payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + access_token_expires
    }
    refresh_payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + refresh_token_expires
    }

    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)
    return access_token, refresh_token

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None