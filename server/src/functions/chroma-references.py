import chromadb
import json

# Initialize Chroma DB client
client = chromadb.Client()

# Create or get a collection for reference papers
collection = client.get_or_create_collection(
    name="reference-papers",
    metadata={"hnsw:space": "cosine"} # l2 is the default
)

# Load reference papers from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/input/ref-papers.json', 'r') as file:
    ref_papers = json.load(file)

# Extract titles and abstracts from the reference papers
documents = [paper['title'] + ". " + paper['abstract'] for paper in ref_papers]
ids = [paper['id'] for paper in ref_papers]

# Add reference papers to the Chroma DB collection
collection.add(
    documents=documents,
    metadatas=[{"source": "reference"}] * len(ref_papers),
    ids=ids
)

# Function to query the database for similarity with new papers
def find_similar_papers(new_paper):
    results = collection.query(
        query_texts=[new_paper['title'] + ". " + new_paper['abstract']],
        n_results=5,  # Adjust this to retrieve the desired number of similar papers
    )
    return results

# Example usage:
new_paper_good =   {
    "id": "2308.05567",
    "title": "C5: Towards Better Conversation Comprehension and Contextual Continuity for ChatGPT",
    "abstract": "Large language models (LLMs), such as ChatGPT, have demonstrated outstanding\nperformance in various fields, particularly in natural language understanding\nand generation tasks. In complex application scenarios, users tend to engage in\nmulti-turn conversations with ChatGPT to keep contextual information and obtain\ncomprehensive responses. However, human forgetting and model contextual\nforgetting remain prominent issues in multi-turn conversation scenarios, which\nchallenge the users' conversation comprehension and contextual continuity for\nChatGPT. To address these challenges, we propose an interactive conversation\nvisualization system called C5, which includes Global View, Topic View, and\nContext-associated Q\\&A View. The Global View uses the GitLog diagram metaphor\nto represent the conversation structure, presenting the trend of conversation\nevolution and supporting the exploration of locally salient features. The Topic\nView is designed to display all the question and answer nodes and their\nrelationships within a topic using the structure of a knowledge graph, thereby\ndisplay the relevance and evolution of conversations. The Context-associated\nQ\\&A View consists of three linked views, which allow users to explore\nindividual conversations deeply while providing specific contextual information\nwhen posing questions. The usefulness and effectiveness of C5 were evaluated\nthrough a case study and a user study.",
    "pdfLink": "https://arxiv.org/pdf/2308.05567.pdf"
}
new_paper_bad =     {
    "id": "2308.05713",
    "title": "Testing GPT-4 with Wolfram Alpha and Code Interpreter plug-ins on math and science problems",
    "abstract": "This report describes a test of the large language model GPT-4 with the\nWolfram Alpha and the Code Interpreter plug-ins on 105 original problems in\nscience and math, at the high school and college levels, carried out in\nJune-August 2023. Our tests suggest that the plug-ins significantly enhance\nGPT's ability to solve these problems. Having said that, there are still often\n\"interface\" failures; that is, GPT often has trouble formulating problems in a\nway that elicits useful answers from the plug-ins. Fixing these interface\nfailures seems like a central challenge in making GPT a reliable tool for\ncollege-level calculation problems.",
    "pdfLink": "https://arxiv.org/pdf/2308.05713.pdf"
}

similar_papers = find_similar_papers(new_paper_good)
# similar_papers = find_similar_papers(new_paper_bad)

# print(similar_papers)

# Write the similar papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/similar_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(similar_papers, output_file, indent=4)

print(f"Similar papers written to {output_path}")

# todo consider using keyword/topic similarity search instead
