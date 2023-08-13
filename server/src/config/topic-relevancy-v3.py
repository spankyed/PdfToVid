import json
import spacy

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/input/ref-papers.json', 'r') as file:
    ref_papers = json.load(file)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Extract main topics or keywords from each paper's title + abstract using spaCy
def extract_keywords(text):
    doc = nlp(text)
    return set([token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "ADJ"]])

# Jaccard similarity coefficient
def jaccard_similarity(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union

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
        score = jaccard_similarity(new_paper_keywords, keywords)
        if score > 0:  # You can adjust this threshold if needed
            paper = next(p for p in ref_papers if p["id"] == paper_id)
            paper["relevant_keywords"] = list(new_paper_keywords.intersection(keywords))
            paper["relevancy_score"] = score
            similar_papers.append(paper)
    
    # Sort papers by relevancy score
    similar_papers.sort(key=lambda x: x["relevancy_score"], reverse=True)
    
    return similar_papers

# Example usage:
new_paper = {
    "id": "2308.05567",
    "title": "C5: Towards Better Conversation Comprehension and Contextual Continuity for ChatGPT",
    "abstract": "Large language models (LLMs), such as ChatGPT, have demonstrated outstanding\nperformance in various fields, particularly in natural language understanding\nand generation tasks. In complex application scenarios, users tend to engage in\nmulti-turn conversations with ChatGPT to keep contextual information and obtain\ncomprehensive responses. However, human forgetting and model contextual\nforgetting remain prominent issues in multi-turn conversation scenarios, which\nchallenge the users' conversation comprehension and contextual continuity for\nChatGPT. To address these challenges, we propose an interactive conversation\nvisualization system called C5, which includes Global View, Topic View, and\nContext-associated Q\\&A View. The Global View uses the GitLog diagram metaphor\nto represent the conversation structure, presenting the trend of conversation\nevolution and supporting the exploration of locally salient features. The Topic\nView is designed to display all the question and answer nodes and their\nrelationships within a topic using the structure of a knowledge graph, thereby\ndisplay the relevance and evolution of conversations. The Context-associated\nQ\\&A View consists of three linked views, which allow users to explore\nindividual conversations deeply while providing specific contextual information\nwhen posing questions. The usefulness and effectiveness of C5 were evaluated\nthrough a case study and a user study.",
    "pdfLink": "https://arxiv.org/pdf/2308.05567.pdf"
}

new_paper_bad = {
    "id": "2308.05665",
    "title": "Exploring Deep Learning Approaches to Predict Person and Vehicle Trips: An Analysis of NHTS Data",
    "abstract": "Modern transportation planning relies heavily on accurate predictions of\nperson and vehicle trips. However, traditional planning models often fail to\naccount for the intricacies and dynamics of travel behavior, leading to\nless-than-optimal accuracy in these predictions. This study explores the\npotential of deep learning techniques to transform the way we approach trip\npredictions, and ultimately, transportation planning. Utilizing a comprehensive\ndataset from the National Household Travel Survey (NHTS), we developed and\ntrained a deep learning model for predicting person and vehicle trips. The\nproposed model leverages the vast amount of information in the NHTS data,\ncapturing complex, non-linear relationships that were previously overlooked by\ntraditional models. As a result, our deep learning model achieved an impressive\naccuracy of 98% for person trip prediction and 96% for vehicle trip estimation.\nThis represents a significant improvement over the performances of traditional\ntransportation planning models, thereby demonstrating the power of deep\nlearning in this domain. The implications of this study extend beyond just more\naccurate predictions. By enhancing the accuracy and reliability of trip\nprediction models, planners can formulate more effective, data-driven\ntransportation policies, infrastructure, and services. As such, our research\nunderscores the need for the transportation planning field to embrace advanced\ntechniques like deep learning. The detailed methodology, along with a thorough\ndiscussion of the results and their implications, are presented in the\nsubsequent sections of this paper.",
    "pdfLink": "https://arxiv.org/pdf/2308.05665.pdf"
  }

# similar_papers = find_similar_papers(new_paper)
similar_papers = find_similar_papers(new_paper_bad)

# Write the similar papers to a JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/similar_papers_output.json'
with open(output_path, 'w') as output_file:
    json.dump(similar_papers, output_file, indent=4)

print(f"Similar papers written to {output_path}")
