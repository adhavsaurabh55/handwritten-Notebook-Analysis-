import os
from pathlib import Path
from typing import Optional

import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


class AnswerEvaluator:
    def __init__(
        self,
        base_model_name: str = "google/flan-t5-small",
        adapter_path: Optional[str] = None,
        device: Optional[str] = None,
    ):
        self.base_model_name = base_model_name
        self.adapter_path = adapter_path or str(Path(__file__).resolve().parents[1] / "models" / "flan_t5_small")
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")

        self.tokenizer = AutoTokenizer.from_pretrained(self.base_model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.base_model_name)

        if os.path.isdir(self.adapter_path):
            adapter_config = PeftConfig.from_pretrained(self.adapter_path)
            self.model = PeftModel.from_pretrained(self.model, self.adapter_path, adapter_name=adapter_config.adapter_name)
            self.model.eval()
        else:
            self.model.eval()

        self.model.to(self.device)

    def evaluate(self, student_answer: str, question: str, subject: str, ncert_answer: str) -> str:
        prompt = (
            f"Subject: {subject}\n"
            f"Question: {question}\n"
            f"Expected Answer: {ncert_answer}\n"
            f"Student Answer: {student_answer}\n"
            "Evaluate the student's answer. Return only: marks out of 5, feedback"
        )
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).to(self.device)
        with torch.no_grad():
            outputs = self.model.generate(**inputs, max_new_tokens=80)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
