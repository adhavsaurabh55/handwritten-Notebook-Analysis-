from typing import Dict, List, Optional

import torch
from sentence_transformers import SentenceTransformer


class PlagiarismDetector:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def similarity(self, answer_a: str, answer_b: str) -> float:
        if not answer_a or not answer_b:
            return 0.0
        embedding_a = self.model.encode(answer_a, convert_to_tensor=True)
        embedding_b = self.model.encode(answer_b, convert_to_tensor=True)
        similarity = torch.nn.functional.cosine_similarity(embedding_a.unsqueeze(0), embedding_b.unsqueeze(0)).item()
        return round(max(0.0, similarity), 4)

    def flag_pairs(self, answers: List[Dict[str, str]]) -> List[Dict[str, object]]:
        flagged = []
        for i in range(len(answers)):
            for j in range(i + 1, len(answers)):
                score = self.similarity(answers[i]["answer"], answers[j]["answer"])
                percent = round(score * 100, 2)
                if percent >= 92:
                    flagged.append({
                        "student_a": answers[i].get("student_name", f"student_{i + 1}"),
                        "student_b": answers[j].get("student_name", f"student_{j + 1}"),
                        "score": percent,
                        "risk": "HIGH_RISK" if percent >= 96 else "SUSPICIOUS",
                    })
        return flagged
