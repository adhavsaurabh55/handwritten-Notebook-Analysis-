import re


class MathsEvaluator:
    def evaluate(self, student_answer: str, ncert_answer: str) -> tuple:
        if not student_answer or not student_answer.strip():
            return 0, "No answer provided. Score: 0/5."

        student_clean = student_answer.strip().lower()
        dont_know = ["don't know", "dont know", "do not know", "idk", "wrong", "blank", "नहीं पता"]
        if any(p in student_clean for p in dont_know) and len(student_clean) < 40:
            return 0, f"Incorrect answer (0/5 marks). Expected Solution: {ncert_answer}"

        student_num = self._extract_number(student_answer)
        expected_num = self._extract_number(ncert_answer)

        if student_num is not None and expected_num is not None:
            if abs(student_num - expected_num) < 1e-5:
                return 5, f"Correct numerical answer (5/5 marks). Matches {expected_num}."
            return 0, f"Incorrect numerical answer (0/5 marks). You wrote {student_num}, but expected {expected_num}."

        if student_clean == ncert_answer.strip().lower():
            return 5, "Correct answer (5/5 marks)."

        return 0, f"Incorrect answer (0/5 marks). Expected Solution: {ncert_answer}"

    def _extract_number(self, text: str):
        if not text:
            return None
        numbers = re.findall(r"[-+]?\d+(?:\.\d+)?", text)
        if numbers:
            return float(numbers[-1])
        return None
