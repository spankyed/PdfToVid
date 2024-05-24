import * as repository from '../repository';
import { createChatStream } from '~/shared/completions';
import { Readable } from 'stream';
import OpenAI from 'openai';
import { io } from '~/web/server';

export default async function startChatStream({
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

  const placeholderMessage = await repository.addMessage({
    paperId,
    threadId: thread.id,
    text: '...',
    hidden: false,
    // state: 'error',
    role: 'assistant',
  });
  
  const conversation = messages.map(({ role, text}) => ({
    role,
    content: text,
  }))

  createChatStream({
    model,
    pdf: pdfDocs[0]?.content,
    messages: conversation as any,
    handlers: {
      onError: () => {
        // todo error state for when insufficient provider credits

        console.error("Error in completion stream");
      },
      onChunk: (delta, snapshot) => {
        io.emit('chat_status', {
          key: placeholderMessage.id,
          status: 'streaming',
          // data: delta,
          data: snapshot,
        });

        // console.log('delta: ', delta);
      },
      onCompletion: async (completion) => {
        const assistantResponse = completion.choices[0].message.content;
        io.emit('chat_status', {
          key: placeholderMessage.id,
          status: 'complete',
          data: assistantResponse,
          final: true,
        });

        await repository.updateMessage(placeholderMessage.id, {
          paperId,
          threadId: thread.id,
          text: assistantResponse,
          hidden: false,
          // state: 'error',
          role: 'assistant',
        });
      }
    }
  });

  return placeholderMessage.id;
}

