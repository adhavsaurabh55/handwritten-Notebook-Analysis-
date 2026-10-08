# Handwritten Analysis Model

This project contains a Colab-friendly AI pipeline for handwritten answer analysis.

## Structure
- `notebooks/`: experiment notebooks for preprocessing, OCR, NLP, training, and plagiarism detection (includes `Colab_Training_FlanT5.ipynb` for GPU training)
- `src/`: reusable Python modules for preprocessing, OCR, NLP cleaning, segmentation, evaluation, and plagiarism
- `data/`: answer bank, ground truth, and training samples
- `api/`: FastAPI evaluation endpoint
- `scripts/`: utility scripts for dataset generation and OCR validation
- `tests/`: pytest test cases covering success and failure API endpoints and src modules

## Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

## Dataset Generation
To generate the 200 NCERT Class 5 questions and the 600-sample fine-tuning dataset:
```bash
python scripts/generate_answer_bank.py
```

## Running Tests
To run unit and API tests with code coverage analysis:
```bash
python -m pytest --cov=api --cov=src tests/ --cov-report=term-missing
```

## Running the API
To start the FastAPI evaluation service locally:
```bash
uvicorn api.evaluate_endpoint:app --reload
```
Once started, check out the interactive documentation at `http://127.0.0.1:8000/docs`.

## Model Training (Google Colab GPU)
For model fine-tuning, load the pre-configured notebook [notebooks/Colab_Training_FlanT5.ipynb](notebooks/Colab_Training_FlanT5.ipynb) into Google Colab. The notebook will guide you through training using a free T4 GPU, packing the fine-tuned LoRA weights, and downloading them back to your local `models/flan_t5_small` directory.

