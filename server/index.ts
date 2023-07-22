const Hapi = require('@hapi/hapi');
const NeDB = require('nedb');

// Initialize NeDB
const db = new NeDB({ filename: 'papers.db', autoload: true });

// Initialize Hapi server
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Route to fetch all papers
server.route({
    method: 'GET',
    path: '/papers',
    handler: (request, h) => {
        return new Promise((resolve, reject) => {
            db.find({}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }
});

// Route to fetch papers for a specific day
server.route({
    method: 'GET',
    path: '/papers/{date}',
    handler: (request, h) => {
        return new Promise((resolve, reject) => {
            db.find({ date: request.params.date }, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }
});

// Route to fetch paper by id
server.route({
    method: 'GET',
    path: '/paper/{id}',
    handler: (request, h) => {
        return new Promise((resolve, reject) => {
            db.findOne({ id: request.params.id }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }
});

// Start the server
const start = async () => {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
