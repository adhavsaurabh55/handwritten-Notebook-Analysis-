import re
from typing import Optional

import spacy
from spellchecker import SpellChecker


class NLPCleaner:
    def __init__(self, model_name: str = "en_core_web_sm"):
        try:
            self.nlp = spacy.load(model_name)
        except OSError:
            self.nlp = spacy.blank("en")
        self.spell = SpellChecker()

    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        doc = self.nlp(text)
        cleaned_tokens = []
        for token in doc:
            if not token.is_alpha or token.is_space or token.is_stop:
                continue
            lemma = token.lemma_.lower()
            cleaned_tokens.append(self.spell.correction(lemma) or lemma)
        return " ".join(cleaned_tokens)

    def normalize_whitespace(self, text: str) -> str:
        return re.sub(r"\s+", " ", text).strip()
