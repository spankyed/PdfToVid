import * as repository from './repository';
import { route } from '~/shared/route';
import getPdfText from './scripts/get-pdf-text';
import initializeChat from './scripts/initialize-chat';

async function deleteMessage(request: any, h: any) {
  const messageId = request.payload.messageId;

  await repository.deleteMessage(messageId);

  return h.response('');
}

async function getMessages(request: any, h: any) {
  const threadId = request.params.threadId;
  const messages = await repository.getMessages({ threadId, includeHidden: true });
  // const messages = await repository.getMessages(paperId, selectedThread);

  return h.response(messages);
}

async function initChat(request: any, h: any){
  const paperId = request.params.paperId;
  let textLength = await initializeChat(paperId);
  let pdfTokenCount = textLength / 4;

  return h.response(pdfTokenCount);
}
async function getThreads(request: any, h: any){
  const paperId = request.params.paperId;
  let threads = await repository.getAllThreads(paperId);
  
  let thread;

  if (!threads.length) {
    thread = await repository.addThread({
      paperId,
      description: 'Main thread',
      viewMode: 0,
    });

    threads = [thread];
  }


  setTimeout(() => {
    initializeChat(paperId);
  }, 10);

  return h.response(threads);
}

async function sendMessage(request: any, h: any) {
  const { paperId, threadId, text } = request.payload;

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return h.response('Thread not found').code(404);
  }

  const messageRecord = await repository.addMessage({
    paperId,
    threadId,
    text,
    hidden: false,
    sender: 'user',
  });

  // todo move this to a separate async function and update status with websockets
  const [pdfDoc, messages] = await Promise.all([
    repository.getPdfDocuments(paperId, thread.viewMode || 0),
    repository.getMessages({ threadId }),
  ]);

  const conversation = [
    pdfDoc[0]?.content,
    ...messages.map((message) => message.text),
  ]

  console.log('conversation: ', conversation);

  // const completion = await getCompletion(conversation);

  console.log('message received');
  return h.response(messageRecord.id);
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

  return h.response(newThread);
}

async function branchThread(request: any, h: any) {
  const { paperId, parentThreadId, messageId, description } = request.payload;

  const duplicateThreadDescriptions = await repository.findDuplicateDescriptions(paperId, description);
  const newDescription = description;
  const duplicateNumber = duplicateThreadDescriptions?.length ? duplicateThreadDescriptions?.length + 1 : null;

  let newThread = await repository.addThread({
    paperId,
    duplicateNumber,
    description: newDescription,
    messageId,
  });

  let messages = await repository.getMessages({ threadId: parentThreadId, messageId, includeHidden: false });
  let messageCopies = messages.map((message) => ({
    parentId: message.id === messageId ? message.id : null,
    threadId: newThread.id,
    text: message.text,
    sender: message.sender,
    hidden: message.hidden,
  }));

  const newMessages = await repository.addMessagesBulk(messageCopies);

  return h.response({
    thread: newThread,
    messages: newMessages,
  });
}

async function toggleHideMessage(request: any, h: any) {
  const { messageId, state } = request.payload;

  await repository.toggleHideMessage(messageId, state);

  return h.response('');
}

export default [
  route.get('/initializeChat/{paperId}', initChat),
  route.get('/getThreads/{paperId}', getThreads),
  route.get('/getMessages/{threadId}', getMessages),
  route.post('/sendMessage', sendMessage),
  // route.post('/setDocumentViewMode', setDocumentViewMode),
  route.post('/createThread', createThread),
  route.post('/branchThread', branchThread),
  route.post('/toggleHideMessage', toggleHideMessage),
  route.post('/deleteMessage', deleteMessage),
]
