import json
import argparse
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from multiprocessing import Pool, cpu_count

# Load SBERT model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

pathRefPapers = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json'

with open(pathRefPapers, 'r') as file:
    ref_papers = json.load(file)

def compute_cosine_similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

def compute_relevancy_score(paper):
    paper_text = paper['title'] + ". " + paper['abstract']
    paper_embedding = model.encode(paper_text)

    similarity_scores = []

    for ref_paper in ref_papers:
        ref_paper_text = ref_paper['title'] + ". " + ref_paper['abstract']
        ref_paper_embedding = model.encode(ref_paper_text)
        
        similarity_scores.append(compute_cosine_similarity(paper_embedding, ref_paper_embedding))

    # Sort the scores and take the average of the top 5
    top_5_scores = sorted(similarity_scores, reverse=True)[:5]
    relevancy_score = sum(top_5_scores) / len(top_5_scores)

    # Add the relevancy score to the paper's metaData
    if 'metaData' not in paper:
        paper['metaData'] = {}
    paper['metaData']['relevancy'] = relevancy_score

    return paper

def compute_relevancy_for_batch(papers_batch):
    return [compute_relevancy_score(paper) for paper in papers_batch]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compute relevancy scores for a list of papers.')
    parser.add_argument('papers_list', type=str, help='List of papers in JSON format.')
    args = parser.parse_args()

    papers = json.loads(args.papers_list)

    # Split the papers into batches for parallel processing
    num_cores = cpu_count()
    batch_size = len(papers) // num_cores
    paper_batches = [papers[i:i + batch_size] for i in range(0, len(papers), batch_size)]

    with Pool(num_cores) as pool:
        results_batches = pool.map(compute_relevancy_for_batch, paper_batches)

    # Flatten the results
    flattened_results = [item for sublist in results_batches for item in sublist]

    try:
        print("###BEGIN_DATA###")
        print(json.dumps(flattened_results, default=lambda o: float(o) if isinstance(o, np.float32) else o))
        print("###END_DATA###")
        output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/papers_relevancy.json'
        with open(output_path, 'w') as output_file:
            json.dump(flattened_results, output_file, indent=4, default=lambda o: float(o) if isinstance(o, np.float32) else o)
    except Exception as e:
        print(f"Error: {e}")
