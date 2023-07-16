import Hapi from '@hapi/hapi'
import prisma from './plugins/prisma'
import users from './plugins/users'
import posts from './plugins/posts'

import * as xml2js from 'xml2js';
// import { promisify } from 'util'
import { get } from 'lodash';
import { search } from 'arxiv-api';

// const parseXMLPromisified = promisify(parseXML);
const parseXMLPromisified = xml2js.parseStringPromise(parseXML);
	
// examples
// https://github.com/USA-RedDragon/RHM/tree/master/server
// https://github.com/LuckyOkoedion/rest-api-with-hapi-typescript-prisma-and-postgresql/tree/main/src
// https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-hapi/src


const date = new Date().toUTCString()
// console.log(new Date().toLocaleDateString('en-US', { weekday: 'long' }));		

const el = Array.from(document.body.querySelectorAll('a')).find(elm => elm.textContent.includes('searching text'));


// 'cat:cs.AI'; // search in the AI category
const papers = arxiv
	.search({
		searchQueryParams: [
			{
				include: [{name: 'AI'}],
				// exclude: [{name: 'LSTM'}],
			},
			// {
			// 	include: [{name: 'GAN'}],
			// },
		],
		start: 0,
		maxResults: 10,
	})
	// .then((papers) => console.log(papers))
	// .catch((error) => console.log(error));

// Opens the URL in the default browser.
await open('https://sindresorhus.com');

// Opens the URL in a specified browser.
await open('https://sindresorhus.com', {app: {name: 'firefox'}});

// Specify app arguments.
// await open('https://sindresorhus.com', {app: {name: 'google chrome', arguments: ['--incognito']}});




const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})

export async function start(): Promise<Hapi.Server> {
  await server.register([prisma, users, posts])
  await server.start()
  return server
}

process.on('unhandledRejection', async (err) => {
  await server.app.prisma.$disconnect()
  console.log(err)
  process.exit(1)
})

start().then((server) => {
  console.log(`
  🚀 Server ready at: ${server.info.uri}
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-hapi#3-using-the-rest-api
  `)
}).catch((err) => {
  console.log(err)
})


/**
 * Parse arXiv entry object.
 * @param {Object} entry.
 * @returns {Object} formatted arXiv entry object.
 */
function parseArxivObject(entry) {
	return {
		id: _.get(entry, 'id[0]', ''),
		title: _.get(entry, 'title[0]', ''),
		summary: _.get(entry, 'summary[0]', '').trim(),
		authors: _.get(entry, 'author', []).map(author => author.name),
		links: _.get(entry, 'link', []).map(link => link.$),
		published: _.get(entry, 'published[0]', ''),
		updated: _.get(entry, 'updated[0]', ''),
		categories: _.get(entry, 'category', []).map(category => category.$),
	};
}
