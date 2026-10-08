import numpy as np
import torch
import cv2
import os
from PIL import Image
from unittest.mock import MagicMock, patch

from src.nlp_cleaner import NLPCleaner
from src.segmenter import QuestionSegmenter
from src.plagiarism import PlagiarismDetector
from src.preprocessing import remove_ruled_lines, deskew_image, preprocess_for_ocr
from src.maths_evaluator import MathsEvaluator

def test_nlp_cleaner():
    cleaner = NLPCleaner()
    # Test whitespace normalization
    assert cleaner.normalize_whitespace("  hello   world  ") == "hello world"
    
    # Test cleaning text (removes stopwords, punctuation, spelling corrections if any)
    cleaned = cleaner.clean_text("The ice-cream is very cold and sweet!")
    assert "ice-cream" in cleaned or "icecream" in cleaned or "cold" in cleaned

def test_question_segmenter():
    segmenter = QuestionSegmenter()
    text = "Question 1: What is summer? Answer: Summer is hot. Q2: What is winter? Answer: Winter is cold."
    pairs = segmenter.segment_questions_answers(text)
    assert len(pairs) == 2
    assert pairs[0]["q_no"] == "1"
    assert "summer" in pairs[0]["question"].lower()
    assert "hot" in pairs[0]["answer"].lower()
    assert pairs[1]["q_no"] == "2"

def test_plagiarism_detector():
    detector = PlagiarismDetector()
    ans_a = "Ice-cream is popular in hot summer season."
    ans_b = "Ice-cream is popular in hot summer season."
    ans_c = "Dogs bark at night."
    
    # Test similarity
    sim_same = detector.similarity(ans_a, ans_b)
    sim_diff = detector.similarity(ans_a, ans_c)
    assert sim_same > 0.9
    assert sim_diff < 0.5
    
    # Test flag_pairs
    answers = [
        {"student_name": "Alice", "answer": ans_a},
        {"student_name": "Bob", "answer": ans_b},
        {"student_name": "Charlie", "answer": ans_c}
    ]
    flagged = detector.flag_pairs(answers)
    assert len(flagged) >= 1
    assert flagged[0]["student_a"] == "Alice"
    assert flagged[0]["student_b"] == "Bob"
    assert flagged[0]["risk"] == "HIGH_RISK"

def test_maths_evaluator():
    evaluator = MathsEvaluator()
    marks, feedback = evaluator.evaluate("The answer is 45 cm", "45")
    assert marks == 5
    
    marks, feedback = evaluator.evaluate("The answer is 50", "45")
    assert marks == 2
    
    marks, feedback = evaluator.evaluate("unknown text", "45")
    assert marks == 1

def test_preprocessing():
    # Create a dummy white RGB image
    img_np = np.ones((100, 100, 3), dtype=np.uint8) * 255
    
    # Draw a line to test remove_ruled_lines with lines present
    cv2.line(img_np, (10, 50), (90, 50), (0, 0, 0), 2)
    no_lines = remove_ruled_lines(img_np)
    assert no_lines.shape == img_np.shape
    
    # Create a skewed black rectangle on a white canvas to test deskew_image angle calculation
    skewed_img = np.ones((100, 100, 3), dtype=np.uint8) * 255
    rect = np.array([[20, 30], [80, 20], [90, 70], [30, 80]], dtype=np.int32)
    cv2.fillPoly(skewed_img, [rect], (0, 0, 0))
    deskewed = deskew_image(skewed_img)
    assert deskewed.shape == skewed_img.shape
    
    # Test empty coordinate check in deskew
    empty_img = np.ones((100, 100, 3), dtype=np.uint8) * 255
    assert deskew_image(empty_img).shape == empty_img.shape
    
    # Test preprocess_for_ocr
    img_pil = Image.fromarray(img_np)
    preprocessed = preprocess_for_ocr(img_pil)
    assert isinstance(preprocessed, Image.Image)

@patch('src.ocr.load_trocr_model')
def test_ocr_module(mock_load_model):
    mock_model = MagicMock()
    mock_processor = MagicMock()
    mock_load_model.return_value = (mock_model, mock_processor, "cpu")
    
    # Setup mock methods
    mock_pixel_values = MagicMock()
    mock_pixel_values.to.return_value = mock_pixel_values
    mock_processor.return_value = MagicMock(pixel_values=mock_pixel_values)
    
    mock_model.generate.return_value = [1, 2, 3]
    mock_processor.batch_decode.return_value = ["Extracted Text"]
    
    from src.ocr import TrOCRExtractor, extract_text_from_image, extract_text_from_directory, evaluate_accuracy
    
    extractor = TrOCRExtractor()
    img = Image.new("RGB", (100, 100), "white")
    text = extractor.extract_text_from_image(img)
    assert text == "Extracted Text"
    
    texts = extractor.extract_text_from_images([img])
    assert texts == ["Extracted Text"]
    
    # Test PyMuPDF fitz.open mocking
    with patch('fitz.open') as mock_fitz_open:
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_pix = MagicMock(width=100, height=100, samples=b"\xff" * 30000)
        mock_page.get_pixmap.return_value = mock_pix
        mock_doc.__iter__.return_value = [mock_page]
        mock_fitz_open.return_value = mock_doc
        
        pdf_texts = extractor.extract_text_from_pdf("dummy.pdf")
        assert pdf_texts == ["Extracted Text"]

    # Test extract_text_from_directory
    with patch('pathlib.Path.iterdir') as mock_iterdir:
        mock_file = MagicMock()
        mock_file.is_file.return_value = True
        mock_file.suffix = ".png"
        mock_file.name = "page_1.png"
        mock_iterdir.return_value = [mock_file]
        
        with patch('src.ocr.TrOCRExtractor.extract_text_from_image', return_value="Mock Text"):
            with patch('pathlib.Path.write_text') as mock_write_text:
                results = extract_text_from_directory("dummy_dir", output_json="out.json")
                assert len(results) == 1
                assert results[0]["image"] == "page_1.png"
                assert results[0]["text"] == "Mock Text"
                
    # Test evaluate_accuracy
    predictions = [{"image": "page_1.png", "text": "Hello"}]
    ground_truth = {"page_1.png": "Hello"}
    metrics = evaluate_accuracy(predictions, ground_truth)
    assert metrics["accuracy"] == 1.0
    assert metrics["matched"] == 1
    
    # Test empty evaluate_accuracy
    assert evaluate_accuracy([], {})["accuracy"] == 0.0

@patch('transformers.AutoTokenizer.from_pretrained')
@patch('transformers.AutoModelForSeq2SeqLM.from_pretrained')
@patch('os.path.isdir')
@patch('peft.PeftConfig.from_pretrained')
@patch('peft.PeftModel.from_pretrained')
def test_answer_evaluator(mock_peft_from_pretrained, mock_peft_config, mock_isdir, mock_model_from_pretrained, mock_tokenizer_from_pretrained):
    # Setup tokenizer mock
    mock_tokenizer = MagicMock()
    mock_tokenizer.return_value = {"input_ids": torch.tensor([[1, 2, 3]]), "attention_mask": torch.tensor([[1, 1, 1]])}
    mock_tokenizer.decode.return_value = "5/5 | Excellent"
    mock_tokenizer_from_pretrained.return_value = mock_tokenizer
    
    # Setup model mock
    mock_model = MagicMock()
    mock_model.generate.return_value = [[1, 2, 3]]
    mock_model_from_pretrained.return_value = mock_model
    
    # Peft mocks
    mock_isdir.return_value = True
    mock_peft_config.return_value = MagicMock(adapter_name="default")
    mock_peft_model = MagicMock()
    mock_peft_model.generate.return_value = [[1, 2, 3]]
    mock_peft_from_pretrained.return_value = mock_peft_model
    
    from src.evaluator import AnswerEvaluator
    
    evaluator = AnswerEvaluator(device="cpu")
    assert evaluator.device == "cpu"
    
    res = evaluator.evaluate("student", "question", "english", "expected")
    assert "5/5" in res
    
    # Test without adapter path
    mock_isdir.return_value = False
    evaluator_no_adapter = AnswerEvaluator(device="cpu")
    res_no_adapter = evaluator_no_adapter.evaluate("student", "question", "english", "expected")
    assert "5/5" in res_no_adapter
