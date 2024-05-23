import * as repository from '../repository';
import { getChatStream } from '~/shared/completions';
import { Readable } from 'stream';
import OpenAI from 'openai';

export default async function streamChatResponse({
  paperId,
  thread,
  model,
}: {
  paperId: string;
  thread: any;
  model: OpenAI.Chat.ChatModel;
}){
  const [pdfDocs, messages] = await Promise.all([
    repository.getPdfDocuments(paperId, thread.viewMode || 0),
    repository.getMessages({ threadId: thread.id }),
  ]);

  const conversation = messages.map(({ role, text}) => ({
    role,
    content: text,
  }))

  const responseStream = new Readable({ read() {} });

  await getChatStream({
    model,
    pdf: pdfDocs[0]?.content,
    messages: conversation as any,
    handlers: {
      onError: () => {
        console.error("Error in completion stream");
      },
      onChunk: (delta, snapshot) => {
        responseStream.push(delta);
        // console.log('delta: ', delta);
      },
      onCompletion: async (completion) => {
        responseStream.push(null); 

        // const response = completion.choices[0].message;
        // console.log({ completion: response });
        // await repository.addMessage({
        //   paperId,
        //   threadId: thread.id,
        //   text: response,
        //   hidden: false,
        //   // state: 'error',
        //   role: 'assistant',
        // });
      }
    }
  });

  return responseStream;
}

