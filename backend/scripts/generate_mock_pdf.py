import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def draw_handwriting_page(title: str, qa_pairs: list) -> Image.Image:
    # Standard A4 page size at 150 DPI (approx 1240 x 1754)
    width, height = 1240, 1754
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)
    
    # Try to load default font
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
        
    # Draw paper margins and margins lines (ruled paper look)
    draw.line([150, 0, 150, height], fill="lightpink", width=3) # left vertical margin
    for y in range(100, height, 40):
        draw.line([0, y, width, y], fill="lightblue", width=1) # horizontal lines
        
    # Write Title/Header
    draw.text((180, 60), f"Student Name: Ravi Sharma | Class 5 | {title}", fill="blue", font=font)
    
    # Draw Q&A pairs
    y_offset = 140
    for q, a in qa_pairs:
        draw.text((180, y_offset), q, fill="darkblue", font=font)
        y_offset += 40
        draw.text((180, y_offset), a, fill="black", font=font)
        y_offset += 80 # space between questions
        
    return image

def main():
    print("Generating mock student answer sheets...")
    
    # Page 1: English
    english_qa = [
        ("Q1: In which season is ice-cream popular?", "Answer: Ice-cream is popular in hot summer season."),
        ("Q2: Who feels joyful on seeing the Ice-cream Man?", "Answer: Children feel joyful on seeing the Ice-cream Man.")
    ]
    img1 = draw_handwriting_page("English Test", english_qa)
    
    # Page 2: Maths
    maths_qa = [
        ("Q1: A log boat travels 4 km in 1 hour. How long will it take to go 20 km?", "Answer: It will take 5 hours to travel 20 km because 20 divided by 4 is 5.")
    ]
    img2 = draw_handwriting_page("Maths Test", maths_qa)
    
    # Page 3: EVS
    evs_qa = [
        ("Q1: Name two animals that have a very strong sense of smell.", "Answer: Dogs and ants have an exceptionally strong sense of smell to track food.")
    ]
    img3 = draw_handwriting_page("EVS Test", evs_qa)
    
    # Save as PDF
    output_dir = Path("data")
    output_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = output_dir / "mock_student_answers.pdf"
    
    # Convert PIL Images to PDF
    img1.save(pdf_path, save_all=True, append_images=[img2, img3])
    print(f"Successfully generated mock student PDF at: {pdf_path}")

if __name__ == "__main__":
    main()
