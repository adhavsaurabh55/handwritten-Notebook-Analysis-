from markdown_pdf import MarkdownPdf, Section

pdf = MarkdownPdf(toc_level=2)

with open(r"C:\Users\rites\.gemini\antigravity\brain\906e9be3-f3ea-4e4d-8e0c-571376fedb23\Project_Documentation.md", "r", encoding="utf-8") as f:
    text = f.read()

pdf.add_section(Section(text))

# Save directly to the B.tech Project folder so the user and their group can find it
output_path = r"C:\Users\rites\Downloads\B.tech Project\Project_Documentation.pdf"
pdf.save(output_path)
print(f"Successfully saved PDF to {output_path}")
