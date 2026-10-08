import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Union

import fitz
import torch
from PIL import Image, ImageOps
from transformers import AutoProcessor, VisionEncoderDecoderModel

DEFAULT_MODEL_NAME = "microsoft/trocr-base-handwritten"
DEFAULT_CACHE_DIR = Path(__file__).resolve().parents[1] / "models" / "trocr"


def normalize_text(text: str) -> str:
    return " ".join(text.lower().split())


def load_trocr_model(
    model_name: str = DEFAULT_MODEL_NAME,
    cache_dir: Optional[Union[str, Path]] = None,
    device: Optional[str] = None,
) -> tuple[VisionEncoderDecoderModel, AutoProcessor, str]:
    if cache_dir is None:
        cache_dir = DEFAULT_CACHE_DIR

    cache_dir = Path(cache_dir)
    cache_dir.mkdir(parents=True, exist_ok=True)

    if device is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

    processor = AutoProcessor.from_pretrained(str(model_name), cache_dir=str(cache_dir), use_fast=False)
    model = VisionEncoderDecoderModel.from_pretrained(str(model_name), cache_dir=str(cache_dir))
    model.to(device)
    model.eval()

    return model, processor, device


class TrOCRExtractor:
    def __init__(
        self,
        model_name: str = DEFAULT_MODEL_NAME,
        cache_dir: Optional[Union[str, Path]] = None,
        device: Optional[str] = None,
    ):
        self.model, self.processor, self.device = load_trocr_model(
            model_name=model_name, cache_dir=cache_dir, device=device
        )

    def _prepare_image(self, image: Union[Image.Image, str, Path]) -> Image.Image:
        if isinstance(image, (str, Path)):
            pil_image = Image.open(image).convert("RGB")
        else:
            pil_image = image.convert("RGB")
        return ImageOps.exif_transpose(pil_image)

    def _run_model(self, image: Union[Image.Image, str, Path]) -> str:
        prepared_image = self._prepare_image(image)
        pixel_values = self.processor(images=[prepared_image], return_tensors="pt").pixel_values.to(self.device)

        with torch.no_grad():
            generated_ids = self.model.generate(pixel_values, max_new_tokens=128)

        generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        return generated_text.strip()

    def extract_text_from_image(self, image: Union[Image.Image, str, Path]) -> str:
        return self._run_model(image)

    def extract_text_from_images(self, images: Sequence[Union[Image.Image, str, Path]]) -> List[str]:
        return [self.extract_text_from_image(image) for image in images]

    def pdf_to_images(self, pdf_path: Union[str, Path], dpi: int = 200) -> List[Image.Image]:
        doc = fitz.open(str(pdf_path))
        images: List[Image.Image] = []
        for page in doc:
            pix = page.get_pixmap(matrix=fitz.Matrix(dpi / 72, dpi / 72))
            image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(image)
        return images

    def extract_text_from_pdf(self, pdf_path: Union[str, Path], dpi: int = 200) -> List[str]:
        images = self.pdf_to_images(pdf_path, dpi=dpi)
        return self.extract_text_from_images(images)


def extract_text_from_image(
    image: Union[Image.Image, str, Path],
    model_name: str = DEFAULT_MODEL_NAME,
    cache_dir: Optional[Union[str, Path]] = None,
    device: Optional[str] = None,
) -> str:
    extractor = TrOCRExtractor(model_name=model_name, cache_dir=cache_dir, device=device)
    return extractor.extract_text_from_image(image)


def extract_text_from_directory(
    image_dir: Union[str, Path],
    model_name: str = DEFAULT_MODEL_NAME,
    cache_dir: Optional[Union[str, Path]] = None,
    device: Optional[str] = None,
    output_json: Optional[Union[str, Path]] = None,
) -> List[Dict[str, str]]:
    image_dir = Path(image_dir)
    image_extensions = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".webp"}
    image_paths = sorted(
        [path for path in image_dir.iterdir() if path.is_file() and path.suffix.lower() in image_extensions]
    )

    if not image_paths:
        raise FileNotFoundError(f"No images were found in {image_dir}")

    extractor = TrOCRExtractor(model_name=model_name, cache_dir=cache_dir, device=device)
    results: List[Dict[str, str]] = []
    for path in image_paths:
        text = extractor.extract_text_from_image(path)
        results.append({"image": path.name, "text": text})

    if output_json is not None:
        output_path = Path(output_json)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(results, indent=2), encoding="utf-8")

    return results


def evaluate_accuracy(predictions: List[Dict[str, str]], ground_truth: Dict[str, str]) -> Dict[str, float]:
    matched = 0
    total = 0

    for item in predictions:
        image_name = item["image"]
        if image_name not in ground_truth:
            continue
        total += 1
        predicted = normalize_text(item["text"])
        expected = normalize_text(ground_truth[image_name])
        if predicted == expected:
            matched += 1

    if total == 0:
        return {"accuracy": 0.0, "matched": 0, "total": 0}

    return {"accuracy": round(matched / total, 4), "matched": matched, "total": total}
