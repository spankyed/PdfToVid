import json
from gensim import corpora, models
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/services/files/generated/test_data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Extract abstracts from the data
abstracts = [paper['abstract'] for paper in data]

# Preprocess the data
stop_words = set(stopwords.words('english'))
domain_specific_stop_words = {"models", "ai", "data"}
stop_words = stop_words.union(domain_specific_stop_words)

def preprocess(text):
    return [word for word in word_tokenize(text.lower()) if word.isalpha() and word not in stop_words]

tokenized_data = [preprocess(abstract) for abstract in abstracts]

# Create bigrams and trigrams
bigram = models.Phrases(tokenized_data, min_count=5, threshold=100)
trigram = models.Phrases(bigram[tokenized_data], threshold=100)

bigram_mod = models.phrases.Phraser(bigram)
trigram_mod = models.phrases.Phraser(trigram)

def make_bigrams(texts):
    return [bigram_mod[doc] for doc in texts]

def make_trigrams(texts):
    return [trigram_mod[bigram_mod[doc]] for doc in texts]

tokenized_data = make_trigrams(tokenized_data)

# Create a dictionary and corpus
dictionary = corpora.Dictionary(tokenized_data)
corpus = [dictionary.doc2bow(text) for text in tokenized_data]

# Train the LDA model
num_topics = 5  # You can change this based on your requirements
lda_model = models.LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

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
output_path = '/Users/spankyed/Develop/Projects/PdfToVid/services/files/generated/test_data/topics_output_gensim.json'
with open(output_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print(f"Topics written to {output_path}")
