from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, auth
from ..database import get_db

router = APIRouter(prefix="/teacher", tags=["teacher"])

def require_teacher(current_user: dict = Depends(auth.get_current_user)):
    if current_user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/dashboard")
def get_teacher_dashboard(current_user: dict = Depends(require_teacher), db: Session = Depends(get_db)):
    submissions = db.query(models.Submission).all()
    students = db.query(models.User).filter(models.User.role == "student").all()
    
    total_subs = len(submissions)
    total_students = len(students)
    completed = [s for s in submissions if s.status == "COMPLETED"]
    avg_score = sum([s.marks or 0 for s in completed]) / len(completed) if completed else 0
    
    return {
        "classStats": {
            "totalStudents": total_students,
            "totalSubmissions": total_subs,
            "averageScore": round(avg_score, 2),
            "pendingReviews": total_subs - len(completed)
        }
    }

@router.get("/class-results", response_model=List[schemas.SubmissionResponse])
def get_class_results(current_user: dict = Depends(require_teacher), db: Session = Depends(get_db)):
    submissions = db.query(models.Submission).all()
    return submissions

@router.get("/analytics")
def get_class_analytics(current_user: dict = Depends(require_teacher), db: Session = Depends(get_db)):
    submissions = db.query(models.Submission).filter(models.Submission.status == "COMPLETED").all()
    # Mocking analytics data format expected by frontend
    distribution = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    for sub in submissions:
        marks = sub.marks or 0
        if marks <= 20: distribution["0-20"] += 1
        elif marks <= 40: distribution["21-40"] += 1
        elif marks <= 60: distribution["41-60"] += 1
        elif marks <= 80: distribution["61-80"] += 1
        else: distribution["81-100"] += 1
        
    return {
        "distribution": distribution,
        "average": sum([s.marks or 0 for s in submissions]) / len(submissions) if submissions else 0
    }
