import json
import spacy
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load spaCy model with vectors
nlp = spacy.load("en_core_web_md")

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/services/files/assets/ref-papers.json', 'r') as file:
    ref_papers = json.load(file)

# Define keyword weights
keyword_weights = {
    "knowledge graph": 2,
    "chatgpt": 1.5,
    "generative agents": 2,
    "prompt engineering": 1.5,
    "cognitive maps": 1.5
}

# Modified Jaccard similarity with keyword boosting
def weighted_jaccard_similarity(set1, set2):
    intersection = sum([keyword_weights.get(keyword, 1) for keyword in set1.intersection(set2)])
    total_weights = sum([keyword_weights.get(keyword, 1) for keyword in set1.union(set2)])
    return intersection / total_weights

# Compute the cosine similarity between two embeddings
def compute_cosine_similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

# Compute the semantic similarity between two texts
def compute_semantic_similarity(text1, text2):
    embedding1 = nlp(text1).vector
    embedding2 = nlp(text2).vector
    return compute_cosine_similarity(embedding1, embedding2)

# Extract main topics or keywords from each paper's title + abstract using spaCy
def extract_keywords(text):
    doc = nlp(text)
    return set([token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "ADJ"]])

# Function to find similar papers based on keywords and semantic similarity
def find_similar_papers(new_paper):
    new_paper_keywords = extract_keywords(new_paper['title'] + ". " + new_paper['abstract'])
    new_paper_text = new_paper['title'] + ". " + new_paper['abstract']
    
    similar_papers = []
    for ref_paper in ref_papers:
        ref_paper_keywords = extract_keywords(ref_paper['title'] + ". " + ref_paper['abstract'])
        ref_paper_text = ref_paper['title'] + ". " + ref_paper['abstract']
        
        jaccard_score = weighted_jaccard_similarity(new_paper_keywords, ref_paper_keywords)
        semantic_score = compute_semantic_similarity(new_paper_text, ref_paper_text)
        
        combined_score = ((0.9 * jaccard_score) * 10) + 0.1 * semantic_score
        
        if combined_score > 0.1:  # Adjust this threshold if needed
            ref_paper["relevant_keywords"] = list(new_paper_keywords.intersection(ref_paper_keywords))
            ref_paper["jaccard_relevancy_score"] = jaccard_score
            ref_paper["semantic_relevancy_score"] = semantic_score
            ref_paper["combined_relevancy_score"] = combined_score
            similar_papers.append(ref_paper)
    
    # Sort papers by combined relevancy score
    similar_papers.sort(key=lambda x: x["combined_relevancy_score"], reverse=True)
    
    return similar_papers

# Example usage:
new_paper = {
    "id": "2308.05567",
    "title": "C5: Towards Better Conversation Comprehension and Contextual Continuity for ChatGPT",
    "abstract": "Large language models (LLMs), such as ChatGPT, have demonstrated outstanding..."
}

new_paper_bad = {
    "id": "2308.05665",
    "title": "Automatic Extraction of Relevant Road Infrastructure using Connected vehicle data and Deep Learning Model",
    "abstract": "In today's rapidly evolving urban landscapes, efficient and accurate mapping of road infrastructure is critical for optimizing transportation systems, enhancing road safety, and improving the overall mobility experience for drivers and commuters. Yet, a formidable bottleneck obstructs progress - the laborious and time-intensive manual identification of intersections. Simply considering the shear number of intersections that need to be identified, and the labor hours required per intersection, the need for an automated solution becomes undeniable. To address this challenge, we propose a novel approach that leverages connected vehicle data and cutting-edge deep learning techniques. By employing geohashing to segment vehicle trajectories and then generating image representations of road segments, we utilize the YOLOv5 (You Only Look Once version 5) algorithm for accurate classification of both straight road segments and intersections. Experimental results demonstrate an impressive overall classification accuracy of 95%, with straight roads achieving a remarkable 97% F1 score and intersections reaching a 90% F1 score. This approach not only saves time and resources but also enables more frequent updates and a comprehensive understanding of the road network. Our research showcases the potential impact on traffic management, urban planning, and autonomous vehicle navigation systems. The fusion of connected vehicle data and deep learning models holds promise for a transformative shift in road infrastructure mapping, propelling us towards a smarter, safer, and more connected transportation ecosystem."
}

similar_papers = find_similar_papers(new_paper_bad)

def default(o):
    if isinstance(o, np.float32):
        return float(o)
    raise TypeError

# Write the similar papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/services/files/generated/test_data/similar_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(similar_papers, output_file, indent=4, default=default)

print(f"Similar papers written to {output_path}")
