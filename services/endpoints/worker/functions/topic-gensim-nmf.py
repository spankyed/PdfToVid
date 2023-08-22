import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Extract abstracts from the data
abstracts = [paper['abstract'] for paper in data]

# Convert abstracts to TF-IDF representation
vectorizer = TfidfVectorizer(stop_words='english', max_df=0.95, min_df=2)
tfidf = vectorizer.fit_transform(abstracts)

# Apply NMF
num_topics = 5  # Adjust based on your requirements
nmf_model = NMF(n_components=num_topics, random_state=42).fit(tfidf)

# Extract topics for each abstract
output_data = []
for paper, abstract_tfidf in zip(data, tfidf):
    topic_distribution = nmf_model.transform(abstract_tfidf)
    dominant_topic = int(topic_distribution.argmax())  # Convert int64 to int
    topic_words = [(word, float(value)) for word, value in zip(vectorizer.get_feature_names_out(), nmf_model.components_[dominant_topic])]
    topic_words_sorted = sorted(topic_words, key=lambda x: x[1], reverse=True)[:10]  # Top 10 words for the topic
    
    paper_output = {
        "id": paper["id"],
        "title": paper["title"],
        "abstract": paper["abstract"],
        "pdfLink": paper["pdfLink"],
        "dominant_topic": dominant_topic,
        "topic_words": topic_words_sorted
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/topics_output_nmf.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Topics written to {output_path}")