import json
from gensim.summarization import keywords

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

output_data = []

for paper in data:
    key_terms = keywords(paper['abstract'], words=5).split('\n')  # Extracting top 5 keywords
    paper_output = {
        "id": paper["id"],
        "title": paper["title"],
        "abstract": paper["abstract"],
        "pdfLink": paper["pdfLink"],
        "keywords": key_terms
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/keywords_output.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Keywords written to {output_path}")
