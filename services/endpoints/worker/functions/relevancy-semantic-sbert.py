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
    "title": "Simple is Better and Large is Not Enough: Towards Ensembling of Foundational Language Models",
    "abstract": "Foundational Language Models (FLMs) have advanced natural language processing (NLP) research. Current researchers are developing larger FLMs (e.g., XLNet, T5) to enable contextualized language representation, classification, and generation. While developing larger FLMs has been of significant advantage, it is also a liability concerning hallucination and predictive uncertainty. Fundamentally, larger FLMs are built on the same foundations as smaller FLMs (e.g., BERT); hence, one must recognize the potential of smaller FLMs which can be realized through an ensemble. In the current research, we perform a reality check on FLMs and their ensemble on benchmark and real-world datasets. We hypothesize that the ensembling of FLMs can influence the individualistic attention of FLMs and unravel the strength of coordination and cooperation of different FLMs. We utilize BERT and define three other ensemble techniques: {Shallow, Semi, and Deep}, wherein the Deep-Ensemble introduces a knowledge-guided reinforcement learning approach. We discovered that the suggested Deep-Ensemble BERT outperforms its large variation i.e. BERTlarge, by a factor of many times using datasets that show the usefulness of NLP in sensitive fields, such as mental health.",
    "pdfLink": "https://arxiv.org/pdf/2308.05567.pdf"
}

new_paper_bad = {
    "id": "2308.05665",
    "title": "Integrating the Wikidata Taxonomy into YAGO",
    "abstract": "Wikidata is one of the largest public general-purpose Knowledge Bases (KBs). Yet, due to its collaborative nature, its schema and taxonomy have become convoluted. For the YAGO 4 KB, we combined Wikidata with the ontology from this http URL, which reduced and cleaned up the taxonomy and constraints and made it possible to run automated reasoners on the data. However, it also cut away large parts of the Wikidata taxonomy. In this paper, we present our effort to merge the entire Wikidata taxonomy into the YAGO KB as much as possible. We pay particular attention to logical constraints and a careful distinction of classes and instances. Our work creates YAGO 4.5, which adds a rich layer of informative classes to YAGO, while at the same time keeping the KB logically consistent."
}

# similar_papers = find_similar_papers(new_paper)
similar_papers = find_similar_papers(new_paper_bad)

def default(o):
    if isinstance(o, np.float32):
        return float(o)
    raise TypeError

# Write the similar papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/similar_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(similar_papers, output_file, indent=4, default=default)

print(f"Similar papers written to {output_path}")
