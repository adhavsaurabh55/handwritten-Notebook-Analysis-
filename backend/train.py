from pathlib import Path
import json
import random
import argparse

import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSeq2SeqLM,
    DataCollatorForSeq2Seq,
    Seq2SeqTrainingArguments,
    Seq2SeqTrainer,
)
from peft import LoraConfig, TaskType, get_peft_model


def load_answer_bank(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Answer bank not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def flatten_answer_bank(answer_bank):
    rows = []
    for subject, chapters in answer_bank.items():
        for chapter_name, questions in chapters.items():
            for question_key, payload in questions.items():
                rows.append(
                    {
                        "subject": subject,
                        "chapter": chapter_name,
                        "question_key": question_key,
                        "question": payload.get("question", ""),
                        "answer": payload.get("answer", ""),
                        "marks": payload.get("marks", 5),
                    }
                )
    return rows


def build_examples(rows, max_examples: int):
    examples = []

    for row in rows[:max_examples]:
        subject = row["subject"]
        question = row["question"]
        expected = row["answer"]
        marks = row["marks"]

        variants = [
            (expected, marks, "Excellent answer. You explained the main idea clearly."),
            (
                expected.split()[0] if expected.split() else expected,
                max(1, marks - 2),
                "You gave a partial answer. Add a few more details to improve your score.",
            ),
            ("I do not know", 0, "This answer needs more effort and a clearer understanding of the topic."),
        ]

        for student_answer, sample_marks, feedback in variants:
            prompt = (
                f"Subject: {subject}\n"
                f"Question: {question}\n"
                f"Expected Answer: {expected}\n"
                f"Student Answer: {student_answer}\n"
                "Evaluate the student's answer. Return only: marks out of 5, feedback"
            )
            response = f"{sample_marks}/5 | {feedback}"
            examples.append((prompt, response))

    random.shuffle(examples)
    return examples


def build_dataset(tokenizer, samples):
    prompts = [prompt for prompt, _ in samples]
    responses = [response for _, response in samples]

    tokenized_inputs = tokenizer(prompts, truncation=True, max_length=384)
    tokenized_outputs = tokenizer(text_target=responses, truncation=True, max_length=128)

    dataset = Dataset.from_dict(
        {
            "input_ids": tokenized_inputs["input_ids"],
            "attention_mask": tokenized_inputs["attention_mask"],
            "labels": tokenized_outputs["input_ids"],
        }
    )
    return dataset



def main():
    parser = argparse.ArgumentParser(description="Train a Flan-T5 model using LoRA on the NCERT answer bank.")
    parser.add_argument("--answer-bank", type=Path, default=Path("data/answer_bank/ncert_answers.json"))
    parser.add_argument("--model-name", type=str, default="google/flan-t5-small")
    parser.add_argument("--output-dir", type=Path, default=Path("models/flan_t5_small"))
    parser.add_argument("--max-examples", type=int, default=240)
    parser.add_argument("--num-epochs", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=2)
    parser.add_argument("--accum-steps", type=int, default=4)
    parser.add_argument("--learning-rate", type=float, default=1e-4)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    random.seed(args.seed)

    answer_bank = load_answer_bank(args.answer_bank)
    rows = flatten_answer_bank(answer_bank)
    examples = build_examples(rows, args.max_examples)
    print(f"Prepared {len(examples)} training examples")

    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token

    train_dataset = build_dataset(tokenizer, examples)
    print(train_dataset)

    model = AutoModelForSeq2SeqLM.from_pretrained(args.model_name)
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q", "v"],
        lora_dropout=0.1,
        bias="none",
        task_type=TaskType.SEQ_2_SEQ_LM,
    )
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)
    training_args = Seq2SeqTrainingArguments(
        output_dir=str(args.output_dir),
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.accum_steps,
        learning_rate=args.learning_rate,
        num_train_epochs=args.num_epochs,
        logging_steps=10,
        save_steps=50,
        save_total_limit=2,
        fp16=False,
        report_to="none",
        remove_unused_columns=False,
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        data_collator=data_collator,
    )

    trainer.train()
    model.save_pretrained(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    print(f"Saved fine-tuned model to {args.output_dir}")


if __name__ == "__main__":
    main()
