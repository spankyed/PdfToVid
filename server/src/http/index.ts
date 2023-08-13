import Hapi from '@hapi/hapi';
import NeDB from 'nedb';
// import Cors from '@hapi/cors';

// Initialize NeDB
const db = new NeDB({ filename: 'papers.db', autoload: true });

// Initialize Hapi server
const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['http://localhost:5173'], // your allowed origin
      additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
});

// Route to fetch all papers
server.route({
  method: 'GET',
  path: '/scrape/{date}',
  handler: (request, h) => {
    return new Promise((resolve, reject) => {
      console.log('request.params.date: ', request.params.date);
      // h.response('Hello World');
      resolve('Hello World')
    });
  }
});


// Start the server
const startServer = async () => {
  try {
    // await server.register(Cors);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

startServer();

// get all previously stored dates
// get date of last run
// get all dates between last run and today

// for pagination show last 5 days of papers

// scrape all dates between last run and today
// store all scraped data



// database mockup
const days = [ "2021-10-06", "2021-10-07", "2021-10-08" ]
const papers = [ 
  {
    id: '1',
    date: '2021-10-06',
    // ...
  },
  {
    // ? initial data upon scrape & filter/rank
    "id": "2308.05713",
    date: '2021-10-06',
    "title": "Testing GPT-4 with Wolfram Alpha and Code Interpreter plug-ins on math and science problems",
    "abstract": "This report describes a test of the large language model GPT-4 with the\nWolfram Alpha and the Code Interpreter plug-ins on 105 original problems in\nscience and math, at the high school and college levels, carried out in\nJune-August 2023. Our tests suggest that the plug-ins significantly enhance\nGPT's ability to solve these problems. Having said that, there are still often\n\"interface\" failures; that is, GPT often has trouble formulating problems in a\nway that elicits useful answers from the plug-ins. Fixing these interface\nfailures seems like a central challenge in making GPT a reliable tool for\ncollege-level calculation problems.",
    "pdfLink": "https://arxiv.org/pdf/2308.05713.pdf",
    "authors": [],
    metaData: {
      "relevancy": .9,
      "keywords": ['cat'],
    },
    // ? below separately generated
    "video": {
      "title": "A video of a cat",
      "description": "A video of a cat on a ledge. Then jumps'",
      "thumbnailPrompt": "A picture of a cat",
      "scriptPrompt": "A picture of a cat on a ledge. Then jumps'",
      videoUrl: 'videos/230805713', 
      thumbnailUrl: 'thumbnails/230805713', 
    }
  },
]

// dashboard data mockup
const dateList = {
  'July 2023': ['Mon, Jul 01', 'Tue, Jul 02', 'Wed, Jul 03'],
  'August 2023': ['Mon, Aug 01', 'Tue, Aug 02', 'Wed, Aug 03'],
  'September 2023': ['Mon, Sep 01', 'Tue, Sep 02', 'Wed, Sep 03', 'Thu, Sep 04', 'Fri, Sep 05', 'Sat, Sep 06', 'Sun, Sep 07', 'Mon, Sep 08', 'Tue, Sep 09', 'Wed, Sep 10', 'Thu, Sep 11', 'Fri, Sep 12', 'Sat, Sep 13', 'Sun, Sep 14', 'Mon, Sep 15', 'Tue, Sep 16', 'Wed, Sep 17', 'Thu, Sep 18', 'Fri, Sep 19', 'Sat, Sep 20', 'Sun, Sep 21', 'Mon, Sep 22', 'Tue, Sep 23', 'Wed, Sep 24', 'Thu, Sep 25', 'Fri, Sep 26', 'Sat, Sep 27', 'Sun, Sep 28', 'Mon, Sep 29', 'Tue, Sep 30'],
}
const dashboardData = {
  // initialPapersCount: 5,
  dateList,
  papersByDay: {
    "2021-10-04": [],
    "2021-10-05": [
      {
        id: '1',
        imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
      },
      {
        id: '1',
        imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
        author: '@bkristastucchio',
      },
    ],
  },
}

