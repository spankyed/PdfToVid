// const fetch = require('node-fetch');
// const cheerio = require('cheerio');
import { load } from 'cheerio';
import fetch from 'node-fetch';

const fetchNumberOfEntries = async () => {
  try {
    const response = await fetch('https://arxiv.org/list/cs.AI/recent');
    const html = await response.text();
    const $ = load(html);
    const smallText = $('small').text();
    const match = smallText.match(/\[ total of (\d+) entries: /);
    if (match && match[1]) {
      console.log(`Number of paper entries: ${match[1]}`);
    } else {
      console.log('Could not find the number of paper entries');
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
};

fetchNumberOfEntries();