// @ts-ignore
import Claude from 'claude-ai';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';

const sessionKey = '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' 

async function getOrganizations() {
  // console.log('fetching orgs' );

  const headers = {
    common: { Accept: 'application/json, text/plain, */*' },
    cookie: `sessionKey=${sessionKey}`,
    'content-type': 'application/json',
    Accept: 'application/json',
    Connection: 'close',
    'User-Agent': 'RapidAPI/4.2.0 (Macintosh; OS X/13.0.1) GCDHTTPRequest',
  }

  // console.log('headers: ', headers);

  const response = await fetch("https://claude.ai/api/organizations", {
    method: "GET",
    headers
  });

  const data = await response.json().catch(console.error);
  
  console.log('response: ', data);

  return data;
}

getOrganizations() 
// const claude = new Claude({
//   fetch,
//   sessionKey,
// });

// const root = '/Users/spankyed/Develop/Projects/PdfToVid/src/files';

// const paperName = 'ai-idea-testing';

// const pdfFile = readFileSync(`${root}/input/${paperName}.pdf`);

// async function main() {

//   await claude.init();
//   console.log('initialized');

//   const file = new File([pdfFile], paperName, {type: 'application/pdf'});

//   const uploadedFile = await claude.uploadFile(file);
//   console.log('uploaded');

//   const response = await claude.sendMessage(`Can you give me a very clear explanation of the core assertions, implications, and mechanics elucidated in this paper?`, {
//     attachments: [uploadedFile]
//   });
//   console.log('message sent');

//   console.log(response.completion);
// }

// main();