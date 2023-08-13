# import spacy.cli
# spacy.cli.download("en_core_web_sm")
import json
import spacy
import pytextrank

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Add pytextrank to the spaCy pipeline
nlp.add_pipe("textrank")

output_data = []

for paper in data:
    combined_text = paper['title'] + ". " + paper['abstract']  # Concatenate title and abstract
    doc = nlp(combined_text)
    key_terms = [(phrase.text, phrase.rank) for phrase in doc._.phrases[:10]]  # Extracting top 5 keywords with their relevancy scores
    paper_output = {
        "id": paper["id"],
        "title": paper["title"],
        "abstract": paper["abstract"],
        "pdfLink": paper["pdfLink"],
        "keywords": key_terms
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/keywords_scores_output_pytextrank_combined.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Keywords with scores written to {output_path}")
