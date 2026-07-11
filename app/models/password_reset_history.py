from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.config.database import Base

class PasswordResetHistory(Base):
    __tablename__ = "password_reset_history"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("public.signupforboth.user_id", ondelete="CASCADE"), nullable=False)
    email = Column(String(150), nullable=False)
    reset_token = Column(String(255), nullable=False, index=True)
    requested_at = Column(TIMESTAMP, server_default=func.now())
    expires_at = Column(TIMESTAMP, nullable=False)
    used_at = Column(TIMESTAMP, nullable=True)
    status = Column(String(20), default="PENDING")
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(255), nullable=True)

    def __repr__(self):
        return f"<PasswordResetHistory(id={self.id}, email={self.email}, status={self.status})>"