import json
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json', 'r') as file:
    ref_papers = json.load(file)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Define reference topics or keywords
reference_topics = set([
    "knowledge graphs", "chatgpt", "gpt", "generative agents", 
    "prompt engineering", "cognitive maps"
])

# Extract main topics or keywords from each paper's title + abstract
def extract_keywords(text):
    doc = nlp(text)
    return set([token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "ADJ"]])

relevant_papers = []

for paper in ref_papers:
    combined_text = paper['title'] + ". " + paper['abstract']
    paper_keywords = extract_keywords(combined_text)
    
    # Check for relevance
    common_keywords = paper_keywords.intersection(reference_topics)
    if common_keywords:
        relevant_papers.append({
            "id": paper["id"],
            "title": paper["title"],
            "abstract": paper["abstract"],
            "relevant_keywords": list(common_keywords)
        })

# Write the relevant papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/relevant_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(relevant_papers, output_file, indent=4)

print(f"Relevant papers written to {output_path}")
