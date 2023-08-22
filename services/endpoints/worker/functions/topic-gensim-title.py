import json
import gensim
from gensim import corpora
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download stopwords and tokenizer from nltk

# import nltk
# nltk.download('stopwords')
# nltk.download('punkt')

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Extract titles from the data
titles = [paper['title'] for paper in data]

# Preprocess the data
stop_words = set(stopwords.words('english'))
def preprocess(text):
    return [word for word in word_tokenize(text.lower()) if word.isalpha() and word not in stop_words]

tokenized_data = [preprocess(title) for title in titles]

# Create a dictionary and corpus
dictionary = corpora.Dictionary(tokenized_data)
corpus = [dictionary.doc2bow(text) for text in tokenized_data]

# Train the LDA model
num_topics = 15  # You can change this based on your requirements
lda_model = gensim.models.LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=500)


# Extract topics for each title
output_data = []
for paper, title_bow in zip(data, corpus):
    topic_distribution = lda_model[title_bow]
    dominant_topic = max(topic_distribution, key=lambda x: x[1])[0]
    topic_words = [(word, float(value)) for word, value in lda_model.show_topic(dominant_topic)]  # Convert float32 to float
    
    paper_output = {
        "id": paper["id"],
        # "title": paper["title"],
        "title": paper["title"],
        "pdfLink": paper["pdfLink"],
        "dominant_topic": dominant_topic,
        "topic_words": topic_words
    }
    output_data.append(paper_output)

# Write the output data to a new JSON file
output_path = '/Users/spankyed/Develop/Projects/CurateGPT/services/files/generated/test_data/topics_output_gensim.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Topics written to {output_path}")
