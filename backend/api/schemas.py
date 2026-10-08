from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    
    model_config = {"from_attributes": True}

class Token(BaseModel):
    token: str
    user: UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str

class FeedbackBase(BaseModel):
    criteria: str
    text: str
    score: Optional[float] = None

class FeedbackResponse(FeedbackBase):
    id: int
    
    model_config = {"from_attributes": True}

class SubmissionBase(BaseModel):
    subject: str
    question: Optional[str] = None
    ncert_answer: Optional[str] = None

class SubmissionResponse(SubmissionBase):
    id: int
    student_id: int
    status: str
    marks: Optional[float] = None
    created_at: datetime
    feedback: List[FeedbackResponse] = []
    
    model_config = {"from_attributes": True}

class StatusResponse(BaseModel):
    status: str

class ClassStats(BaseModel):
    total_students: int
    total_submissions: int
    average_score: float

class StudentSummary(BaseModel):
    id: int
    name: str
    submissions_count: int
    average_score: float
