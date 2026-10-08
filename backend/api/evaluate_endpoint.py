from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.evaluator import AnswerEvaluator
from src.maths_evaluator import MathsEvaluator

app = FastAPI(title="Handwritten Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the evaluation model once at startup.
# If a trained adapter exists in the local models folder, it will be used automatically.
# Otherwise the app falls back to the base Flan-T5-small checkpoint.
evaluator = AnswerEvaluator()
maths_evaluator = MathsEvaluator()


class EvaluationRequest(BaseModel):
    student_answer: str
    question: str
    subject: str
    ncert_answer: str


@app.post("/evaluate")
def evaluate(req: EvaluationRequest):
    subject = req.subject.lower().strip()

    if subject == "maths":
        marks, feedback = maths_evaluator.evaluate(req.student_answer, req.ncert_answer)
        return {"marks": marks, "feedback": feedback}

    result = evaluator.evaluate(req.student_answer, req.question, subject, req.ncert_answer)
    return {"result": result, "model_source": "trained_adapter" if evaluator.adapter_path else "base_model"}
