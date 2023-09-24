import json
import argparse
import numpy as np
import chromadb
from sentence_transformers import SentenceTransformer

# Constants
MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2'
COLLECTION_NAME = "paper-embeddings"
pathRefPapers = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/assets/ref-papers.json'

# Load SBERT model
model = SentenceTransformer(MODEL_NAME)

def store_paper_embeddings_in_chroma(papers, collection_name=COLLECTION_NAME):
    client = chromadb.Client()
    
    # Check if the collection already exists, if not, create it
    if collection_name not in client.list_collections():
        client.create_collection(collection_name)

    embeddings = [model.encode(paper['title'] + ". " + paper['abstract']) for paper in papers]

    client.get_collection(collection_name).add(
        documents=embeddings,
        metadatas=papers,
        ids=[paper['id'] for paper in papers]
    )

def get_relevancy_scores(papers, n_results=5):
    client = chromadb.Client()
    # Assume if collection doesn't exist, embeddings need to be stored
    if COLLECTION_NAME not in chromadb.Client().list_collections():
        with open(pathRefPapers, 'r') as file:
            ref_papers = json.load(file)
        store_paper_embeddings_in_chroma(ref_papers)

    collection = client.get_collection(COLLECTION_NAME)

    for paper in papers:
        query_embedding = model.encode(paper['title'] + ". " + paper['abstract'])
        results = collection.query(query_texts=[query_embedding], n_results=n_results)
        
        relevancy_scores = [res['score'] for res in results[0]]
        avg_relevancy = sum(relevancy_scores) / len(relevancy_scores)

        # Add the relevancy score to the paper's metaData
        if 'metaData' not in paper:
            paper['metaData'] = {}
        paper['metaData']['relevancy'] = avg_relevancy

    return papers
