from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz

from .database import engine, Base
from .routes import auth, student, teacher
from . import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Handwritten Analysis API v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(student.router)
app.include_router(teacher.router)

# Mount with /api prefix for frontend compatibility
app.include_router(auth.router, prefix="/api")
app.include_router(student.router, prefix="/api")
app.include_router(teacher.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Handwritten Analysis API"}

@app.post("/api/ocr")
@app.post("/ocr")
async def extract_pdf_ocr(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        extracted_text = []
        for page in doc:
            t = page.get_text("text").strip()
            if t:
                extracted_text.append(t)
        
        full_text = "\n\n".join(extracted_text).strip()
        return {"status": "success", "extracted_text": full_text}
    except Exception as e:
        return {"status": "error", "extracted_text": "", "error": str(e)}

