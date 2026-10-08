import re
from typing import List, Dict


class QuestionSegmenter:
    def segment_questions_answers(self, text: str) -> List[Dict[str, str]]:
        normalized = re.sub(r"\s+", " ", text).strip()
        chunks = re.split(r"(?=(?:Q|Question)\s*\d+)", normalized)
        qa_pairs = []

        for chunk in chunks:
            chunk = chunk.strip()
            if not chunk:
                continue

            match = re.match(r"(?:(?:Q|Question)\s*(\d+))\s*(.*)", chunk, re.I)
            if not match:
                continue

            q_no = match.group(1)
            q_body = match.group(2).strip()
            answer_match = re.search(r"(?:A|Answer)\s*[:.-]?\s*(.*)$", chunk, re.I)
            answer_body = answer_match.group(1).strip() if answer_match else ""
            qa_pairs.append({"q_no": q_no, "question": q_body, "answer": answer_body})

        return qa_pairs
