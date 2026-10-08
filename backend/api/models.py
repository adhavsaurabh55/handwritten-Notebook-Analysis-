from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # 'student' or 'teacher'

    submissions = relationship("Submission", back_populates="student", foreign_keys='Submission.student_id')

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    pdf_path = Column(String)
    status = Column(String) # 'PROCESSING', 'COMPLETED', 'FAILED'
    subject = Column(String)
    question = Column(Text, nullable=True)
    ncert_answer = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    marks = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("User", back_populates="submissions")
    feedback = relationship("Feedback", back_populates="submission", cascade="all, delete")

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    criteria = Column(String)
    text = Column(Text)
    score = Column(Float, nullable=True)
    
    submission = relationship("Submission", back_populates="feedback")
