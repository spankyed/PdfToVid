import * as repository from './repository';
import { route } from '~/shared/route';
import axios from 'axios';
import getPdfText from './scripts/get-pdf-text';

async function getThreads(request: any, h: any){
  const paperId = request.params.paperId;
  const papers = await repository.getThreads(paperId);

  return h.response('');
}

async function sendMessage(request: any, h: any) {
  const { paperId, text } = request.payload;

  const pdfText = await getPdfText(paperId);
  console.log('pdfText: ', pdfText);
  // 1. pdf text or summary
    // 1.1. check for pdf text, if not found get pdf text from arxiv and save to PdfDocumentTable
  // 2. get completion from gpt or claude
  // 3. save message to db
  // 4. update estimated token usage
  console.log('message received');
  return h.response('');
}

async function setDocumentViewMode(request: any, h: any) {
  // todo update thread record with new view mode
}

async function createThread(request: any, h: any) {
  // todo create new thread record
}

async function addPromptPreset(request: any, h: any) {
  // todo add new prompt preset
}

export default [
  route.post('/getThreads', getThreads),
  route.post('/sendMessage', sendMessage),
  route.post('/setDocumentViewMode', setDocumentViewMode),
  route.post('/createThread', createThread),
  route.post('/addPromptPreset', addPromptPreset),
]
