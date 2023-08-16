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

# User-defined keywords and their boost factor
user_keywords = {
    "education": .5,
    "learning": .5,
    "knowledge graph": 1.5,
    "generative agents": 1.8,
    # "3d": 1.5,
    # "causal": 1.5,
    # "graph": 1.5
}

output_data = []

for paper in data:
    combined_text = paper['title'] + ". " + paper['abstract']  # Concatenate title and abstract
    doc = nlp(combined_text)
    
    # Extract keywords and their scores
    key_terms = [(phrase.text, phrase.rank) for phrase in doc._.phrases]
    
    # Boost scores of user-defined keywords
    for i, (term, score) in enumerate(key_terms):
        if term in user_keywords:
            key_terms[i] = (term, score * user_keywords[term])
    
    # Re-rank keywords based on updated scores
    key_terms = sorted(key_terms, key=lambda x: x[1], reverse=True)[:15]
    
    paper_output = {
        "id": paper["id"],
        "title": paper["title"],
        "abstract": paper["abstract"],
        "pdfLink": paper["pdfLink"],
        "keywords": key_terms
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/keywords_scores_boosted_output_pytextrank_combined.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Boosted keywords with scores written to {output_path}")
