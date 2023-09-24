import json
import chromadb
from sentence_transformers import SentenceTransformer

# Load SBERT model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

pathRefPapers = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json'
COLLECTION_NAME = "paper-embeddings"

def get_collection_or_create(collection_name=COLLECTION_NAME):
    client = chromadb.Client()
    
    # Check if the collection already exists, if not, create it
    if collection_name not in client.list_collections():
        try:
            client.create_collection(collection_name)
        except Exception as e:
            if "already exists" not in str(e):
                raise e

    return client.get_collection(collection_name)

def log_field_types_to_json(paper, output_file_path):
    """
    Logs the type of each field in the given paper to a JSON file.
    
    Args:
    - paper (dict): Dictionary containing paper fields.
    - output_file_path (str): Path to the output JSON file.
    """
    field_types = {}

    for key, value in paper.items():
        field_types[key] = str(type(value))

    with open(output_file_path, 'w') as file:
        json.dump(field_types, file, indent=4)

def store_paper_embeddings_in_chroma(papers, collection_name=COLLECTION_NAME):
    log_field_types_to_json(papers[0], '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/paper_field_types.json')
    collection = get_collection_or_create(collection_name)

    embeddings = [model.encode(paper['title'] + ". " + paper['abstract']) for paper in papers]

    collection.add(
        documents=embeddings,
        metadatas=papers,
        ids=[paper['id'] for paper in papers]
    )

def compute_relevancy_scores(papers):
    collection = get_collection_or_create(COLLECTION_NAME)

    # Try querying the collection to see if it's populated
    try:
        sample_paper_text = papers[0]['title'] + ". " + papers[0]['abstract']
        sample_query_embedding = model.encode(sample_paper_text)
        collection.query(query_texts=[sample_query_embedding], n_results=1)
    except Exception as e:
        # If an error occurs, assume the collection is empty and populate it
        with open(pathRefPapers, 'r') as file:
            ref_papers = json.load(file)
        store_paper_embeddings_in_chroma(ref_papers)

    for paper in papers:
        paper_text = paper['title'] + ". " + paper['abstract']
        query_embedding = model.encode(paper_text)
        results = collection.query(query_texts=[query_embedding], n_results=5)
        
        # Get the average of top 5 similarity scores
        relevancy_scores = [res['score'] for res in results[0]]
        avg_relevancy = sum(relevancy_scores) / len(relevancy_scores)

        # Add the relevancy score to the paper's metaData
        paper['metaData'] = paper.get('metaData', {})
        paper['metaData']['relevancy'] = avg_relevancy

    try:
        output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/papers_relevancy.json'
        with open(output_path, 'w') as output_file:
            json.dump(papers, output_file, indent=4, default=lambda o: float(o) if isinstance(o, np.float32) else o)
    except Exception as e:
        print(f"Error: {e}")

    return papers

