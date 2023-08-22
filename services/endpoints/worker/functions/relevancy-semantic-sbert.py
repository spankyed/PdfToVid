import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# Load SBERT model
model = SentenceTransformer('paraphrase-distilroberta-base-v1')

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json', 'r') as file:
    ref_papers = json.load(file)

# Compute the cosine similarity between two embeddings
def compute_cosine_similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

# Extract main topics or keywords from each paper's title + abstract using spaCy
def extract_keywords(text):
    return set([token.lemma_ for token in nlp(text) if token.pos_ in ["NOUN", "PROPN", "ADJ"]])

# Function to find similar papers based on keywords and semantic similarity
def find_similar_papers(new_paper):
    new_paper_text = new_paper['title'] + ". " + new_paper['abstract']
    new_paper_embedding = model.encode(new_paper_text)
    
    similar_papers = []
    for ref_paper in ref_papers:
        ref_paper_text = ref_paper['title'] + ". " + ref_paper['abstract']
        ref_paper_embedding = model.encode(ref_paper_text)
        
        semantic_score = compute_cosine_similarity(new_paper_embedding, ref_paper_embedding)
        
        if semantic_score > 0.3:  # Adjust this threshold if needed
            ref_paper["semantic_relevancy_score"] = semantic_score
            similar_papers.append(ref_paper)
    
    # Sort papers by relevancy score
    similar_papers.sort(key=lambda x: x["semantic_relevancy_score"], reverse=True)
    
    return similar_papers

# Example usage:
new_paper = {
    "id": "2308.05567",
    "title": "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation Framework",
    "abstract": "This technical report presents AutoGen, a new framework that enables development of LLM applications using multiple agents that can converse with each other to solve tasks. AutoGen agents are customizable, conversable, and seamlessly allow human participation. They can operate in various modes that employ combinations of LLMs, human inputs, and tools. AutoGen's design offers multiple advantages: a) it gracefully navigates the strong but imperfect generation and reasoning abilities of these LLMs; b) it leverages human understanding and intelligence, while providing valuable automation through conversations between agents; c) it simplifies and unifies the implementation of complex LLM workflows as automated agent chats. We provide many diverse examples of how developers can easily use AutoGen to effectively solve tasks or build applications, ranging from coding, mathematics, operations research, entertainment, online decision-making, question answering, etc.",
    "pdfLink": "https://arxiv.org/pdf/2308.05567.pdf"
}

new_paper_bad = {
    "id": "2308.05665",
    "title": "More Than Meets the Eye: Analyzing Anesthesiologists' Visual Attention in the Operating Room Using Deep Learning Models",
    "abstract": "Patient's vital signs, which are displayed on monitors, make the anesthesiologist's visual attention (VA) a key component in the safe management of patients under general anesthesia; moreover, the distribution of said VA and the ability to acquire specific cues throughout the anesthetic, may have a direct impact on patient's outcome. Currently, most studies employ wearable eye-tracking technologies to analyze anesthesiologists' visual patterns. Albeit being able to produce meticulous data, wearable devices are not a sustainable solution for large-scale or long-term use for data collection in the operating room (OR). Thus, by utilizing a novel eye-tracking method in the form of deep learning models that process monitor-mounted webcams, we collected continuous behavioral data and gained insight into the anesthesiologist's VA distribution with minimal disturbance to their natural workflow. In this study, we collected OR video recordings using the proposed framework and compared different visual behavioral patterns. We distinguished between baseline VA distribution during uneventful periods to patterns associated with active phases or during critical, unanticipated incidents. In the future, such a platform may serve as a crucial component of context-aware assistive"
}

similar_papers = find_similar_papers(new_paper)

def default(o):
    if isinstance(o, np.float32):
        return float(o)
    raise TypeError

# Write the similar papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/similar_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(similar_papers, output_file, indent=4, default=default)

print(f"Similar papers written to {output_path}")
