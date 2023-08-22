import json
import spacy

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json', 'r') as file:
    ref_papers = json.load(file)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Extract main topics or keywords from each paper's title + abstract using spaCy
def extract_keywords(text):
    doc = nlp(text)
    return set([token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "ADJ"]])

# Extract keywords from reference papers
reference_keywords = {}
for paper in ref_papers:
    combined_text = paper['title'] + ". " + paper['abstract']
    reference_keywords[paper['id']] = extract_keywords(combined_text)

# Function to find similar papers based on keywords
def find_similar_papers(new_paper):
    new_paper_keywords = extract_keywords(new_paper['title'] + ". " + new_paper['abstract'])
    
    similar_papers = []
    for paper_id, keywords in reference_keywords.items():
        common_keywords = new_paper_keywords.intersection(keywords)
        if common_keywords:
            paper = next(p for p in ref_papers if p["id"] == paper_id)
            paper["relevant_keywords"] = list(common_keywords)
            similar_papers.append(paper)
    
    return similar_papers

# Example usage:
new_paper = {
    "id": "2308.05567",
    "title": "C5: Towards Better Conversation Comprehension and Contextual Continuity for ChatGPT",
    "abstract": "Large language models (LLMs), such as ChatGPT, have demonstrated outstanding\nperformance in various fields, particularly in natural language understanding\nand generation tasks. In complex application scenarios, users tend to engage in\nmulti-turn conversations with ChatGPT to keep contextual information and obtain\ncomprehensive responses. However, human forgetting and model contextual\nforgetting remain prominent issues in multi-turn conversation scenarios, which\nchallenge the users' conversation comprehension and contextual continuity for\nChatGPT. To address these challenges, we propose an interactive conversation\nvisualization system called C5, which includes Global View, Topic View, and\nContext-associated Q\\&A View. The Global View uses the GitLog diagram metaphor\nto represent the conversation structure, presenting the trend of conversation\nevolution and supporting the exploration of locally salient features. The Topic\nView is designed to display all the question and answer nodes and their\nrelationships within a topic using the structure of a knowledge graph, thereby\ndisplay the relevance and evolution of conversations. The Context-associated\nQ\\&A View consists of three linked views, which allow users to explore\nindividual conversations deeply while providing specific contextual information\nwhen posing questions. The usefulness and effectiveness of C5 were evaluated\nthrough a case study and a user study.",
    "pdfLink": "https://arxiv.org/pdf/2308.05567.pdf"
}

similar_papers = find_similar_papers(new_paper)

# Write the similar papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/similar_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(similar_papers, output_file, indent=4)

print(f"Similar papers written to {output_path}")
