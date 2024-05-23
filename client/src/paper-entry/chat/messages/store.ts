import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { RefObject } from 'react';
import * as api from '~/shared/api/fetch';

export const inputRefAtom = atom<RefObject<HTMLInputElement> | null>(null);
export const promptPresetsOpenAtom = atom(false);
export const tokenUsageAtom = atom({ document: 0, total: 0, max: 128 });

export const inputAtom = atom('');

export const inputEnabledAtom = atom(true);

export const messagesAtom = atom<any[]>([
  // { id: 2, text: "Can you help me with my project?", timestamp: "2023-05-10T09:01:00Z", role: 'user' },
  // { id: 3, text: "Of course! What do you need help with?", timestamp: "2023-05-10T09:02:00Z", role: 'assistant' }
]);

export const responseStreamAtom = atom<string>('');

export const promptOptionsAtom = atomWithStorage<any[]>('promptPresets', [
{ id: 1, text: "Write me a very clear explanation of the core assertions, implications, and mechanics elucidated in this paper." },
{ id: 2, text: "Write an analogy or metaphor that will help explain this paper to a broad audience." },
{ id: 3, text: "Explain the value of this in basic terms like you're talking to a CEO. So what? What's the bottom line here?" },
]);

export const sendMessageAtom = atom(
  null,
  async (get, set, { paperId, threadId, text }: { paperId: string, threadId: string, text: string }) => {
    set(inputAtom, '');
    set(inputEnabledAtom, false);

    const newMessage = {
      threadId,
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      role: 'user'
    };

    set(messagesAtom, prev => [...prev, newMessage]);

    try {
      const response = await api.addMessage({ paperId, threadId, text });
      const messageId = response.data;

      set(messagesAtom, prev => prev.map(m => m.id === newMessage.id ? { ...m, id: messageId } : m));

      const streamResponse = await api.streamResponse({ paperId, threadId, text });
      const reader = streamResponse.body?.getReader();
      console.log('reader: ', reader);
      const decoder = new TextDecoder('utf-8');

      const responsePlaceholder = {
        threadId,
        id: 'temp',
        text: '',
        timestamp: new Date().toISOString(),
        role: 'assistant'
      };
  
      set(messagesAtom, prev => [...prev, responsePlaceholder]);

      if (reader){
        let result = '';
        while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            console.log('chunk: ', chunk);
            result += chunk;
            set(messagesAtom, prev => prev.map(m => m.id === 'temp' ? { ...m, text: result } : m))
        }
      }
      
      set(inputEnabledAtom, true);
      // set(responseStreamAtom, '');

      // setTimeout(() => {
      //   set(inputEnabledAtom, true);
      // }, 5000);

      // const { tokenUsage: newTokenUsage } = response.data;
      // tokenUsage.current = newTokenUsage;
    } catch (error) {
      console.error("Failed to send message", error);
    }
    // todo set loading state and disable button
  }
);



// export const fetchPaperAtom = atom(
//   null,
//   async (get, set, paperId) => {
//     if (!paperId) {
//       console.error("Paper id not provided", paperId);
//       return;
//     }
//     set(pageStateAtom, 'loading');

//     try {
//       const response = await api.getPaperById(paperId);
//       const paper = response.data;
//       console.log('Paper fetched: ', {paper});

//       if (!paper) {
//         set(pageStateAtom, 'error');

//         return;
//       }

//       set(paperAtom, paper);
//       set(pageStateAtom, 'ready');
//     } catch (error) {
//       console.error(`Failed to fetch paper with id: ${paperId}`, error);
//       set(pageStateAtom, 'error');
//     }
//   }
// );
