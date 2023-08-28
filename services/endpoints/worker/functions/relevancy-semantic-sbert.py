import json
import argparse
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from multiprocessing import Pool, cpu_count
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="tokenizers")

# Load SBERT model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
# model = SentenceTransformer('paraphrase-distilroberta-base-v1')

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
    num_cores = cpu_count()
    batch_size = len(papers) // num_cores
    paper_batches = [papers[i:i + batch_size] for i in range(0, len(papers), batch_size)]

    with Pool(num_cores) as pool:
        results = pool.map(find_similar_papers_for_batch, paper_batches)

    # Flatten the results
    flattened_results = [item for sublist in results for item in sublist]

    try:
        print("###BEGIN_DATA###")
        print(json.dumps(flattened_results, default=lambda o: float(o) if isinstance(o, np.float32) else o))
        print("###END_DATA###")
        output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/similar_papers_output.json'
        with open(output_path, 'w') as output_file:
            json.dump(flattened_results, output_file, indent=4, default=lambda o: float(o) if isinstance(o, np.float32) else o)

        # print(json.dumps(flattened_results, default=lambda o: float(o) if isinstance(o, np.float32) else o))
    except Exception as e:
        print(f"Error: {e}")

    
# Example usage:
# if true: # testing
#     new_paper = {
#         "id": "2308.05567",
#         "title": "Simple is Better and Large is Not Enough: Towards Ensembling of Foundational Language Models",
#         "abstract": "Foundational Language Models (FLMs) have advanced natural language processing (NLP) research. Current researchers are developing larger FLMs (e.g., XLNet, T5) to enable contextualized language representation, classification, and generation. While developing larger FLMs has been of significant advantage, it is also a liability concerning hallucination and predictive uncertainty. Fundamentally, larger FLMs are built on the same foundations as smaller FLMs (e.g., BERT); hence, one must recognize the potential of smaller FLMs which can be realized through an ensemble. In the current research, we perform a reality check on FLMs and their ensemble on benchmark and real-world datasets. We hypothesize that the ensembling of FLMs can influence the individualistic attention of FLMs and unravel the strength of coordination and cooperation of different FLMs. We utilize BERT and define three other ensemble techniques: {Shallow, Semi, and Deep}, wherein the Deep-Ensemble introduces a knowledge-guided reinforcement learning approach. We discovered that the suggested Deep-Ensemble BERT outperforms its large variation i.e. BERTlarge, by a factor of many times using datasets that show the usefulness of NLP in sensitive fields, such as mental health.",
#         "pdfLink": "https://arxiv.org/pdf/2308.05567.pdf"
#     }

#     new_paper_bad = {
#         "id": "2308.05665",
#         "title": "Integrating the Wikidata Taxonomy into YAGO",
#         "abstract": "Wikidata is one of the largest public general-purpose Knowledge Bases (KBs). Yet, due to its collaborative nature, its schema and taxonomy have become convoluted. For the YAGO 4 KB, we combined Wikidata with the ontology from this http URL, which reduced and cleaned up the taxonomy and constraints and made it possible to run automated reasoners on the data. However, it also cut away large parts of the Wikidata taxonomy. In this paper, we present our effort to merge the entire Wikidata taxonomy into the YAGO KB as much as possible. We pay particular attention to logical constraints and a careful distinction of classes and instances. Our work creates YAGO 4.5, which adds a rich layer of informative classes to YAGO, while at the same time keeping the KB logically consistent."
#     }

#     # similar_papers = find_similar_papers(new_paper)
#     similar_papers = find_similar_papers(new_paper_bad)

#     def default(o):
#         if isinstance(o, np.float32):
#             return float(o)
#         raise TypeError

#     # Write the similar papers to a JSON file
#     output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/similar_papers_output.json'
#     with open(output_path, 'w') as output_file:
#         json.dump(similar_papers, output_file, indent=4, default=default)

#     print(f"Similar papers written to {output_path}")

