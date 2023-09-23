import axios from 'axios';

const ARXIV_API_ENDPOINT = 'http://export.arxiv.org/api/query?';

async function fetchPapersForDate(date: string): Promise<any> {
    // Convert the date into the format 'YYYY-MM-DD' to ensure it's valid
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Define the start and end date for the search
    const startDate = `${formattedDate}T00:00:00Z`;
    const endDate = `${formattedDate}T23:59:59Z`;

    // Construct the query
    const query = `search_query=submittedDate:[${startDate}+TO+${endDate}]&start=0&max_results=100`;

    try {
        const response = await axios.get(ARXIV_API_ENDPOINT + query);
        if (response.status === 200) {
            // Parse the data and return
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, 'text/xml');
            const entries = Array.from(xmlDoc.querySelectorAll('entry'));

            return entries.map(entry => {
                return {
                    title: entry.querySelector('title')?.textContent,
                    summary: entry.querySelector('summary')?.textContent,
                    link: entry.querySelector('link[title="pdf"]')?.getAttribute('href'),
                    authors: Array.from(entry.querySelectorAll('author')).map(author => author.querySelector('name')?.textContent)
                };
            });
        } else {
            throw new Error('Error fetching data from ArXiv');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Example usage
fetchPapersForDate('2023-09-22').then(papers => {
    console.log(papers);
}).catch(error => {
    console.error('Error fetching papers:', error);
});
