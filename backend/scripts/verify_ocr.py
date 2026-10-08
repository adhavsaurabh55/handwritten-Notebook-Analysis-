import sys
from pathlib import Path
import json

# Add repository root to python path
REPO_ROOT = Path(__file__).resolve().parents[1]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from src.ocr import TrOCRExtractor, evaluate_accuracy

def main():
    print("Initializing Microsoft TrOCR model validation...")
    
    # Paths
    image_path = REPO_ROOT / "data" / "preprocessed_images" / "page_1.png"
    ground_truth_path = REPO_ROOT / "data" / "ground_truth.json"
    
    if not image_path.exists():
        print(f"Error: Sample image not found at {image_path}. Please run setup_test_data.py first.")
        sys.exit(1)
        
    if not ground_truth_path.exists():
        print(f"Error: Ground truth file not found at {ground_truth_path}.")
        sys.exit(1)
        
    # Read ground truth
    ground_truth = json.loads(ground_truth_path.read_text(encoding="utf-8"))
    expected_text = ground_truth.get(image_path.name, "")
    print(f"Expected Text: '{expected_text}'")
    
    # Initialize Extractor
    # Note: On CPU this may take some time to download and run.
    print("Loading TrOCR model (microsoft/trocr-base-handwritten)...")
    try:
        extractor = TrOCRExtractor()
    except Exception as e:
        print(f"Failed to load TrOCR model: {e}")
        print("Please check your internet connection and PyTorch installation.")
        sys.exit(1)
        
    print("Extracting text from mock image...")
    extracted_text = extractor.extract_text_from_image(image_path)
    print(f"Extracted Text: '{extracted_text}'")
    
    # Evaluate
    results = [{"image": image_path.name, "text": extracted_text}]
    metrics = evaluate_accuracy(results, ground_truth)
    print("\n--- Evaluation Metrics ---")
    print(f"Exact Match Accuracy: {metrics['accuracy'] * 100}%")
    print(f"Matched pages: {metrics['matched']} / {metrics['total']}")
    
    print("\nTrOCR model is working properly!")

if __name__ == "__main__":
    main()
