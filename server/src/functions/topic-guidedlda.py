import json
import gensim
from gensim import corpora
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Extract abstracts from the data
abstracts = [paper['abstract'] for paper in data]

# Preprocess the data
stop_words = set(stopwords.words('english'))
def preprocess(text):
    return [word for word in word_tokenize(text.lower()) if word.isalpha() and word not in stop_words]

tokenized_data = [preprocess(abstract) for abstract in abstracts]

# Create a dictionary and corpus
dictionary = corpora.Dictionary(tokenized_data)
corpus = [dictionary.doc2bow(text) for text in tokenized_data]

# Seed synthetic documents
# These are just examples, you can modify them based on your domain knowledge
seeded_topics = {
    "autonomous_driving": ["autonomous", "driving", "vehicle", "car"],
    "world_models": ["world", "model", "predict", "future"],
    "anomaly_detection": ["anomaly", "detection", "outlier", "unexpected"],
    "reinforcement_learning": ["reinforcement", "learning", "agent", "reward"]
}

# Add synthetic documents to the corpus
for _, keywords in seeded_topics.items():
    synthetic_doc = keywords * 100  # Repeat keywords to strongly represent the topic
    corpus.append(dictionary.doc2bow(synthetic_doc))

# Train the LDA model
num_topics = len(seeded_topics)  # One topic per seeded topic
lda_model = gensim.models.LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

# Extract topics for each abstract
output_data = []
for paper, abstract_bow in zip(data, corpus):
    topic_distribution = lda_model[abstract_bow]
    dominant_topic = max(topic_distribution, key=lambda x: x[1])[0]
    topic_words = [(word, float(value)) for word, value in lda_model.show_topic(dominant_topic)]  # Convert float32 to float
    
    paper_output = {
        "id": paper["id"],
        "title": paper["title"],
        "abstract": paper["abstract"],
        "pdfLink": paper["pdfLink"],
        "dominant_topic": dominant_topic,
        "topic_words": topic_words
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/server/src/files/output/data/topics_output_gensim_guided.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Topics written to {output_path}")
