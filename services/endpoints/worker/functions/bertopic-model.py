import json
from bertopic import BERTopic

# Load the data from the JSON file
with open('/Users/spankyed/Develop/Projects/PdfToVid/services/files/generated/test_data/arxiv-papers.json', 'r') as file:
    data = json.load(file)

# Extract abstracts from the data
abstracts = [paper['abstract'] for paper in data]

# Initialize BERTopic
topic_model = BERTopic()

print('fitting the model...')

# Fit the model to the abstracts and retrieve topics
topics, _ = topic_model.fit_transform(abstracts)

# Print the topics
for abstract, topic in zip(abstracts, topics):
    print(f"Abstract: {abstract[:100]}... -> Topic: {topic}")

print('retrieving topic info...')

# If you want to see the most frequent topics and their representative words:
topic_freq = topic_model.get_topic_info()
print(topic_freq)

# Call the function and print the results as JSON
# result = get_organizations()
# print(json.dumps(result))