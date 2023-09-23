import json
import argparse
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import warnings
from joblib import Parallel, delayed
warnings.filterwarnings("ignore", category=UserWarning, module="tokenizers")

# Load SBERT model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

pathRefPapers = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json'

with open(pathRefPapers, 'r') as file:
    ref_papers = json.load(file)

def compute_cosine_similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

def extract_keywords(text):
    return set([token.lemma_ for token in nlp(text) if token.pos_ in ["NOUN", "PROPN", "ADJ"]])

def find_similar_papers_for_batch(papers_batch):
    papers_texts = [paper['title'] + ". " + paper['abstract'] for paper in papers_batch]
    papers_embeddings = model.encode(papers_texts)

    all_similar_papers = []

    for idx, new_paper_embedding in enumerate(papers_embeddings):
        similar_papers = []
        semantic_scores = cosine_similarity([new_paper_embedding], ref_papers_embeddings)[0]

        for j, score in enumerate(semantic_scores):
            if score > 0.3:
                ref_paper = ref_papers[j].copy()
                ref_paper["semantic_relevancy_score"] = score
                similar_papers.append(ref_paper)

        similar_papers.sort(key=lambda x: x["semantic_relevancy_score"], reverse=True)
        all_similar_papers.append(similar_papers)

    return all_similar_papers

# Pre-compute reference papers embeddings
ref_papers_texts = [paper['title'] + ". " + paper['abstract'] for paper in ref_papers]
ref_papers_embeddings = model.encode(ref_papers_texts)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Find similar papers for a list of papers.')
    parser.add_argument('papers_list', type=str, help='List of papers in JSON format.')
    args = parser.parse_args()

    papers = json.loads(args.papers_list)

    # Split the papers into batches for parallel processing
    num_cores = -1  # use all available cores
    batch_size = len(papers) // num_cores
    paper_batches = [papers[i:i + batch_size] for i in range(0, len(papers), batch_size)]

    results = Parallel(n_jobs=num_cores)(delayed(find_similar_papers_for_batch)(batch) for batch in paper_batches)

    # Flatten the results
    flattened_results = [item for sublist in results for item in sublist]

    try:
        print("###BEGIN_DATA###")
        print(json.dumps(flattened_results, default=lambda o: float(o) if isinstance(o, np.float32) else o))
        print("###END_DATA###")
        output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/similar_papers_output.json'
        with open(output_path, 'w') as output_file:
            json.dump(flattened_results, output_file, indent=4, default=lambda o: float(o) if isinstance(o, np.float32) else o)
    except Exception as e:
        print(f"Error: {e}")
