import * as repository from './repository';
import { route } from '~/shared/route';
import getPdfText from './scripts/get-pdf-text';
import initializeChat from './scripts/initialize-chat';
import startChatStream from './scripts/start-chat-stream';
import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { ChatCompletionStream } from 'openai/resources/beta/chat/completions';

async function initChat(request: any, h: any){
  const paperId = request.params.paperId;
  try {
    let textLength = await initializeChat(paperId);
    let pdfTokenCount = textLength / 4;
  
    return h.response(pdfTokenCount);
  } catch (error) {
    console.error('Failed to initialize chat: ', error);
    return h.response('Failed to initialize chat').code(500);
  }
}

async function getMessages(request: any, h: any) {
  const threadId = request.params.threadId;
  const messages = await repository.getMessages({ threadId, includeHidden: true });
  // const messages = await repository.getMessages(paperId, selectedThread);

  return h.response(messages);
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

  let [messages, parentMessage] = await Promise.all([
    repository.getMessages({ threadId: parentThreadId, messageId, includeHidden: false }),
    repository.getSingleMessage(messageId),
  ]);

  if (parentMessage) {
    messages.push(parentMessage);
  }

  let messageCopies = messages.map((message) => ({
    parentId: message.id === messageId ? message.id : null,
    threadId: newThread.id,
    text: message.text,
    role: message.role,
    hidden: false,
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

async function deleteMessage(request: any, h: any) {
  const messageId = request.payload.messageId;

  await repository.deleteMessage(messageId);

  return h.response('');
}

async function sendMessage(request: any, h: any) {
  const { paperId, threadId, text } = request.payload;
  console.log('message received');

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return h.response('Thread not found').code(404);
  }

  const messageRecord = await repository.addMessage({
    paperId,
    threadId,
    text,
    hidden: false,
    role: 'user',
  });

  return h.response(messageRecord.id);
}

const threadStreams: { [key: string]: {
  stream: Promise<ChatCompletionStream | undefined>,
  messageId: string,
} } = {};

async function streamResponse(request: Request, h: ResponseToolkit) {
  const { paperId, threadId } = request.payload as any;
  console.log('paperId: ', paperId);
  console.log('streaming response');

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return h.response('Thread not found').code(404);
  }

  const model = 'gpt-4o';

  const [responseMessageId, stream] = await startChatStream({
    paperId,
    thread,
    model,
  })

  threadStreams[threadId] = {
    stream,
    messageId: responseMessageId,
  };

  return h.response(responseMessageId);
}

async function stopMessageStream(request: Request, h: ResponseToolkit) {
  const { threadId } = request.payload as any;

  const threadStream = threadStreams[threadId];

  if (threadStream) {
    const { stream, messageId } = threadStream;
    stream.then(async s => {
      s?.controller.abort();

      await repository.updateMessage(messageId, {
        status: 2,
      });

      // delete threadStreams[threadId]; // todo remove threadStreams on abort/completion
    });
  }

  return h.response('');
}

async function regenerateResponse(request: Request, h: ResponseToolkit) {
  const { paperId, threadId, messageId } = request.payload as any;

  const thread = await repository.getThread(threadId);

  if (!thread) {
    return h.response('Thread not found').code(404);
  }

  const model = 'gpt-4o';

  const [responseMessageId, stream] = await startChatStream({
    paperId,
    thread,
    model,
    messageId,
  })

  threadStreams[threadId] = {
    stream,
    messageId: responseMessageId,
  };

  return h.response(responseMessageId);
}



export default [
  route.get('/initializeChat/{paperId}', initChat),
  route.get('/getThreads/{paperId}', getThreads),
  route.get('/getMessages/{threadId}', getMessages),
  // route.post('/setDocumentViewMode', setDocumentViewMode),
  route.post('/createThread', createThread),
  route.post('/branchThread', branchThread),

  route.post('/toggleHideMessage', toggleHideMessage),
  route.post('/deleteMessage', deleteMessage),
  route.post('/sendMessage', sendMessage),
  route.post('/streamResponse', streamResponse),
  route.post('/stopMessageStream', stopMessageStream),
  route.post('/regenerateResponse', regenerateResponse),
]
