import * as repository from './repository';
import { route } from '~/shared/route';
import getPdfText from './scripts/get-pdf-text';
import initializeChat from './scripts/initialize-chat';

async function getChatData(request: any, h: any){
  const paperId = request.params.paperId;
  let threads = await repository.getThreads(paperId);
  
  let firstThread = threads[0];

  if (!threads.length) {
    firstThread = await repository.addThread({
      paperId,
      description: 'Main thread',
    });

    threads = [firstThread];
  }

  const [promptPresets, messages] = await Promise.all([
    repository.getPromptPresets(),
    repository.getMessages(firstThread.id)
  ]);

  // setTimeout(() => {
  //   initializeChat(paperId);
  // }, 10);

  return h.response({
    threads,
    promptPresets,
    messages
  });
}

async function sendMessage(request: any, h: any) {
  const { paperId, text } = request.payload;

  // 2. get completion from gpt or claude
  // 3. save message to db
  // 4. update estimated token usage
  console.log('message received');
  return h.response('');
}

// async function setDocumentViewMode(request: any, h: any) {
//   // todo update thread record with new view mode
// }

async function createThread(request: any, h: any) {
  // const { paperId, description } = request.payload;

  // let newThread = await repository.addThread({
  //   paperId,
  //   description,
  // });

  // return h.response(newThread.id);
}

async function branchThread(request: any, h: any) {
  // const { paperId, threadId, messageId, description } = request.payload;

  // let newThread = await repository.addThread({
  //   paperId,
  //   description,
  //   messageId,
  //   parentId: threadId,
  // });

  // let messages = await repository.getMessages(threadId, messageId);
  // let messageCopies = messages.map((message) => ({
  //   ...message,
  //   id: newThread.id,
  // }));

  // repository.addMessagesBulk(messageCopies);

  // return h.response({
  //   threadId: newThread.id,
  //   messages,
  // });
}

async function addPromptPreset(request: any, h: any) {
  // todo add new prompt preset
}

export default [
  route.get('/getChatData/{paperId}', getChatData),
  route.post('/sendMessage', sendMessage),
  // route.post('/setDocumentViewMode', setDocumentViewMode),
  route.post('/createThread', createThread),
  route.post('/branchThread', branchThread),
  route.post('/addPromptPreset', addPromptPreset),
]
