import Hapi from '@hapi/hapi';
import NeDB from 'nedb';

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
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

startServer();
