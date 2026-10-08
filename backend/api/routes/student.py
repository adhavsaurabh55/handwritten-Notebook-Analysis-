from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Form
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from pathlib import Path

from .. import schemas, models, auth
from ..database import get_db

from src.evaluator import AnswerEvaluator
from src.maths_evaluator import MathsEvaluator
from src.ocr import TrOCRExtractor

router = APIRouter(prefix="/student", tags=["student"])

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

_evaluator = None
_maths_evaluator = None
_ocr_extractor = None

def get_evaluator():
    global _evaluator
    if _evaluator is None:
        _evaluator = AnswerEvaluator()
    return _evaluator

def get_maths_evaluator():
    global _maths_evaluator
    if _maths_evaluator is None:
        _maths_evaluator = MathsEvaluator()
    return _maths_evaluator

def get_ocr_extractor():
    global _ocr_extractor
    if _ocr_extractor is None:
        _ocr_extractor = TrOCRExtractor()
    return _ocr_extractor

def process_submission_task(submission_id: int, pdf_path: str, subject: str, question: str, ncert_answer: str):
    from ..database import SessionLocal
    db = SessionLocal()
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        db.close()
        return

    try:
        ocr = get_ocr_extractor()
        # Convert PDF to images and extract text
        extracted_texts = ocr.extract_text_from_pdf(pdf_path)
        full_text = " ".join(extracted_texts)
        
        submission.extracted_text = full_text
        
        # Evaluate
        if subject.lower().strip() == "maths":
            maths_ev = get_maths_evaluator()
            marks, feedback_text = maths_ev.evaluate(full_text, ncert_answer)
            submission.marks = marks
            feedback = models.Feedback(submission_id=submission.id, criteria="Overall", text=feedback_text, score=marks)
            db.add(feedback)
        else:
            ev = get_evaluator()
            result = ev.evaluate(full_text, question, subject, ncert_answer)
            submission.marks = result.get('score', 0)
            
            # Assuming result contains feedback details
            feedback_text = str(result.get('feedback', result))
            feedback = models.Feedback(submission_id=submission.id, criteria="Overall", text=feedback_text, score=submission.marks)
            db.add(feedback)
            
        submission.status = "COMPLETED"
        db.commit()
    except Exception as e:
        print(f"Error processing submission {submission_id}: {e}")
        submission.status = "FAILED"
        db.commit()
    finally:
        db.close()

def require_student(current_user: dict = Depends(auth.get_current_user)):
    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.post("/upload")
def upload_notebook(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    subject: str = Form(...),
    question: str = Form(""),
    ncert_answer: str = Form(""),
    current_user: dict = Depends(require_student),
    db: Session = Depends(get_db)
):
    user_id = int(current_user.get("sub"))
    
    file_path = UPLOAD_DIR / f"{user_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    submission = models.Submission(
        student_id=user_id,
        pdf_path=str(file_path),
        status="PROCESSING",
        subject=subject,
        question=question,
        ncert_answer=ncert_answer
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    background_tasks.add_task(process_submission_task, submission.id, str(file_path), subject, question, ncert_answer)
    
    return {"message": "Upload successful, processing started", "submission_id": submission.id}

@router.get("/submissions/{submission_id}/status", response_model=schemas.StatusResponse)
def get_submission_status(submission_id: int, current_user: dict = Depends(require_student), db: Session = Depends(get_db)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"status": submission.status}

@router.get("/marks", response_model=List[schemas.SubmissionResponse])
def get_student_marks(current_user: dict = Depends(require_student), db: Session = Depends(get_db)):
    user_id = int(current_user.get("sub"))
    submissions = db.query(models.Submission).filter(models.Submission.student_id == user_id).all()
    return submissions

@router.get("/feedback/{submission_id}", response_model=schemas.SubmissionResponse)
def get_student_feedback(submission_id: int, current_user: dict = Depends(require_student), db: Session = Depends(get_db)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.get("/dashboard")
def get_student_dashboard(current_user: dict = Depends(require_student), db: Session = Depends(get_db)):
    user_id = int(current_user.get("sub"))
    submissions = db.query(models.Submission).filter(models.Submission.student_id == user_id).all()
    total_subs = len(submissions)
    completed = [s for s in submissions if s.status == "COMPLETED"]
    avg_score = sum([s.marks or 0 for s in completed]) / len(completed) if completed else 0
    pending = total_subs - len(completed)
    
    return {
        "totalSubmissions": total_subs,
        "averageScore": round(avg_score, 2),
        "pendingReviews": pending
    }
