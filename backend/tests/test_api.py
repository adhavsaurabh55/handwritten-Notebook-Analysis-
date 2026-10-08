import unittest.mock as mock

def dummy_init(self, *args, **kwargs):
    self.adapter_path = "models/flan_t5_small"
    self.device = "cpu"

def dummy_evaluate(self, student_answer, question, subject, ncert_answer):
    return "5/5 | Excellent answer. You explained the main idea clearly."

# Patch AnswerEvaluator before importing the app to avoid downloading heavy models
patch_init = mock.patch('src.evaluator.AnswerEvaluator.__init__', dummy_init)
patch_eval = mock.patch('src.evaluator.AnswerEvaluator.evaluate', dummy_evaluate)

patch_init.start()
patch_eval.start()

# Now import the app and test client
from fastapi.testclient import TestClient
from api.evaluate_endpoint import app

client = TestClient(app)

def test_evaluate_maths_correct():
    payload = {
        "student_answer": "The answer is 5 hours.",
        "question": "A log boat travels 4 km in 1 hour. How long will it take to go 20 km?",
        "subject": "maths",
        "ncert_answer": "It will take 5 hours to travel 20 km because 20 divided by 4 is 5."
    }
    response = client.post("/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["marks"] == 5
    assert "Correct numerical answer" in data["feedback"]

def test_evaluate_maths_incorrect():
    payload = {
        "student_answer": "The answer is 10 hours.",
        "question": "A log boat travels 4 km in 1 hour. How long will it take to go 20 km?",
        "subject": "maths",
        "ncert_answer": "It will take 5 hours to travel 20 km because 20 divided by 4 is 5."
    }
    response = client.post("/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["marks"] == 2
    assert "Numerical mismatch" in data["feedback"]

def test_evaluate_maths_needs_review():
    payload = {
        "student_answer": "I don't know the math.",
        "question": "A log boat travels 4 km in 1 hour. How long will it take to go 20 km?",
        "subject": "maths",
        "ncert_answer": "It will take 5 hours to travel 20 km because 20 divided by 4 is 5."
    }
    response = client.post("/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["marks"] == 1
    assert "Needs review" in data["feedback"]

def test_evaluate_english():
    payload = {
        "student_answer": "Ice-cream is popular in summer.",
        "question": "In which season is ice-cream popular?",
        "subject": "english",
        "ncert_answer": "Ice-cream is popular in the hot summer season."
    }
    response = client.post("/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert "model_source" in data
    assert data["result"] == "5/5 | Excellent answer. You explained the main idea clearly."
    assert data["model_source"] == "trained_adapter"

def test_evaluate_evs():
    payload = {
        "student_answer": "Dogs and ants have strong smell.",
        "question": "Name two animals that have a very strong sense of smell.",
        "subject": "evs",
        "ncert_answer": "Dogs and ants have an exceptionally strong sense of smell to track food and paths."
    }
    response = client.post("/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert data["result"] == "5/5 | Excellent answer. You explained the main idea clearly."

def test_evaluate_invalid_request():
    payload = {
        "student_answer": "Ice-cream is popular in summer.",
        "question": "In which season is ice-cream popular?",
        # Missing subject
        "ncert_answer": "Ice-cream is popular in the hot summer season."
    }
    response = client.post("/evaluate", json=payload)
    assert response.status_code == 422  # Validation Error
