import sys
import os
import json
from pathlib import Path

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.ocr import extract_text_from_directory, evaluate_accuracy

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Check OCR text extraction accuracy")
    parser.add_argument("--image-dir", required=True, help="Directory containing images")
    parser.add_argument("--ground-truth", required=True, help="JSON file containing ground truth text mapping")
    parser.add_argument("--output", default="ocr_results.json", help="Output JSON for predictions")
    args = parser.parse_args()

    print(f"Loading ground truth from {args.ground_truth}...")
    with open(args.ground_truth, 'r', encoding='utf-8') as f:
        ground_truth = json.load(f)

    print(f"Extracting text from images in {args.image_dir}...")
    predictions = extract_text_from_directory(
        image_dir=args.image_dir,
        output_json=args.output
    )

    print(f"Evaluating accuracy...")
    results = evaluate_accuracy(predictions, ground_truth)
    
    print("\n--- Results ---")
    print(f"Total evaluated: {results['total']}")
    print(f"Total matched: {results['matched']}")
    print(f"Accuracy: {results['accuracy'] * 100:.2f}%")

if __name__ == "__main__":
    main()
