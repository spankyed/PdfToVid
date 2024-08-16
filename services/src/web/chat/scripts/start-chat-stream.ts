import * as repository from '../repository';
import { createChatStream } from '~/shared/completions';
import { Readable } from 'stream';
import type OpenAI from 'openai';
import { io } from '~/web/server';
import type { ChatCompletionStream } from 'openai/resources/beta/chat/completions';
import { debounce } from 'lodash-es';

export default async function startChatStream({
  paperId,
  thread,
  model,
}: {
  paperId: string;
  thread: any;
  model: OpenAI.Chat.ChatModel;
}): Promise<[string, Promise<ChatCompletionStream | undefined>]> {
  const [pdfDocs, messages] = await Promise.all([
    repository.getPdfDocuments(paperId, thread.viewMode || 0),
    repository.getMessages({ threadId: thread.id }),
  ]);

  const placeholderMessage = await repository.addMessage({
    paperId,
    threadId: thread.id,
    text: '...',
    hidden: false,
    status: 0,
    role: 'assistant',
  });
  
  const conversation = messages.map(({ role, text}) => ({
    role,
    content: text,
  }))

  const stream = createChatStream({
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
          status: 0,
          // data: delta,
          data: snapshot,
        });

        debounce(async () => {
          await repository.updateMessage(placeholderMessage.id, {
            text: snapshot,
          });
        }, 500)();
        
      },
      onCompletion: async (completion) => {
        const assistantResponse = completion.choices[0].message.content;
        io.emit('chat_status', {
          key: placeholderMessage.id,
          status: 1,
          data: assistantResponse,
          final: true,
        });

        await repository.updateMessage(placeholderMessage.id, {
          paperId,
          threadId: thread.id,
          text: assistantResponse,
          hidden: false,
          status: 1,
          role: 'assistant',
        });
      }
    }
  });

  return [placeholderMessage.id, stream];
}

