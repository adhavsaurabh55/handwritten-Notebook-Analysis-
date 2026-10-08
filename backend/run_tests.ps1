# Run pytest suite with code coverage reporting
python -m pytest --cov=api --cov=src tests/ --cov-report=term-missing
