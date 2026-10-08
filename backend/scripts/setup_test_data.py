import os
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def create_mock_image(file_path: Path, text: str):
    # Create a blank white image (800x150)
    image = Image.new("RGB", (800, 150), "white")
    draw = ImageDraw.Draw(image)
    
    # Try to load a font, otherwise use default
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
        
    # Draw a border to simulate a cropped scanned page
    draw.rectangle([10, 10, 790, 140], outline="gray", width=2)
    
    # Draw simple ruled lines to simulate lined notebook paper
    for y in range(40, 140, 30):
        draw.line([20, y, 780, y], fill="lightblue", width=1)
        
    # Draw the text on the page
    draw.text((30, 50), text, fill="black", font=font)
    
    # Save the image
    file_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(file_path)
    print(f"Created mock handwritten page: {file_path}")

def main():
    print("Setting up test directory structure and mock data...")
    
    # Paths
    data_dir = Path("data")
    preprocessed_dir = data_dir / "preprocessed_images"
    preprocessed_dir.mkdir(parents=True, exist_ok=True)
    
    # 4 sample handwritten answer pages
    samples = {
        "page_1.png": "Question 1 Answer Ice-cream is popular in hot summer season.",
        "page_2.png": "Question 2 Answer Children feel joyful on seeing the Ice-cream Man.",
        "page_3.png": "Question 1 Answer It will take 5 hours to travel 20 km because 20 divided by 4 is 5.",
        "page_4.png": "Question 1 Answer Dogs and ants have an exceptionally strong sense of smell to track food."
    }
    
    for filename, text in samples.items():
        create_mock_image(preprocessed_dir / filename, text)
        
    # Ground truth file for accuracy evaluation
    ground_truth = {
        "page_1.png": "Question 1 Answer Ice-cream is popular in hot summer season.",
        "page_2.png": "Question 2 Answer Children feel joyful on seeing the Ice-cream Man.",
        "page_3.png": "Question 1 Answer It will take 5 hours to travel 20 km because 20 divided by 4 is 5.",
        "page_4.png": "Question 1 Answer Dogs and ants have an exceptionally strong sense of smell to track food."
    }
    
    gt_path = data_dir / "ground_truth.json"
    gt_path.write_text(json.dumps(ground_truth, indent=2), encoding="utf-8")
    print(f"Saved ground truth JSON to {gt_path}")

if __name__ == "__main__":
    main()
