import * as repository from './repository';
import { route } from '~/shared/route';
import getPdfText from './scripts/get-pdf-text';
import initializeChat from './scripts/initialize-chat';

async function getChatData(request: any, h: any){
  const paperId = request.params.paperId;
  let threads = await repository.getAllThreads(paperId);
  
  let firstThread = threads[0];

  if (!threads.length) {
    firstThread = await repository.addThread({
      paperId,
      description: 'Main thread',
      viewMode: 0,
    });

    threads = [firstThread];
  }

  const messages = await repository.getMessages({ threadId: firstThread.id, includeHidden: true });

  setTimeout(() => {
    initializeChat(paperId);
  }, 10);

  return h.response({
    threads,
    messages
  });
}

async function sendMessage(request: any, h: any) {
  const { paperId, threadId, text } = request.payload;

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return h.response('Thread not found').code(404);
  }

  const viewMode = thread.viewMode || 0;

  const prevMessages = await repository.getMessages({
    threadId,
  });

  const pdfDoc = await repository.getPdfDocuments(paperId, viewMode);

  const conversation = [
    pdfDoc[0]?.content,
    ...prevMessages.map((message) => message.text),
    text
  ]

  console.log('conversation: ', conversation);

  repository.addMessage({
    paperId,
    threadId,
    text,
    hidden: false,
    sender: 'user',
  });

  // const completion = await getCompletion(conversation);

  console.log('message received');
  return h.response('');
}

// async function setDocumentViewMode(request: any, h: any) {
//   // todo update thread record with new view mode
// }

async function createThread(request: any, h: any) {
  const { paperId, description } = request.payload;

  let newThread = await repository.addThread({
    paperId,
    description,
    viewMode: 0,
  });

  return h.response(newThread.id);
}

async function branchThread(request: any, h: any) {
  const { paperId, threadId, messageId, description } = request.payload;

  let newThread = await repository.addThread({
    paperId,
    description,
    messageId,
    parentId: threadId,
  });

  let messages = await repository.getMessages({ threadId, messageId, includeHidden: true});
  let messageCopies = messages.map((message) => ({
    ...message,
    id: newThread.id,
  }));

  repository.addMessagesBulk(messageCopies);

  return h.response({
    threadId: newThread.id,
    messages,
  });
}

// async function addPromptPreset(request: any, h: any) {
//   const { prompt } = request.payload;

//   let newPrompt = await repository.addPromptPreset(prompt);

//   return h.response(newPrompt.id);
// }

export default [
  route.get('/getChatData/{paperId}', getChatData),
  route.post('/sendMessage', sendMessage),
  // route.post('/setDocumentViewMode', setDocumentViewMode),
  route.post('/createThread', createThread),
  route.post('/branchThread', branchThread),
  // route.post('/addPromptPreset', addPromptPreset),
]
