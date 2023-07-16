// find the last page for the current day
// get all documents IDs for that day
// filter documents by keywords, or vector similarity
// construct pdf download urls from IDs
// ingest pdf, extract text, clean text using LaTex parser
// chunk by sentences, or best strategy
// cosign or KNN to find similar sentences
// feed similar sentences to GPT-4 as context along with summary prompts
// todo: use claude v2 to avoid the need for chunking context, as this causes info loss






const axios = require('axios');
const xml2js = require('xml2js');
// import pdf from 'pdf-parse';
// Base api query url
const base_url = 'http://export.arxiv.org/api/query?';

// Search parameters
const search_query = 'cat:cs.AI'; // search in the AI category
const start = 0;                  // start at the first result
const total_results = 10;         // want 10 total results
const sort_by = 'submittedDate';  // sort by submission date
const sort_order = 'descending';  // want results sorted in descending order

const query = `search_query=${search_query}&start=${start}&max_results=${total_results}&sortBy=${sort_by}&sortOrder=${sort_order}`;

// Perform a GET request using the base_url and query
axios.get(base_url + query)
  .then(response => {
    // Parse the response using xml2js
    xml2js.parseStringPromise(response.data).then(result => {
      // Print out the entries
      const entries = result.feed.entry;
      for (const entry of entries) {
        console.log('Title: ', entry.title[0]);
        console.log('Published: ', entry.published[0]);
        console.log('Summary: ', entry.summary[0]);
        console.log('Link: ', entry.link[1].$.href);
        console.log('\n');
      }
    });
  })
  .catch(error => {
    console.log(error);
  });
