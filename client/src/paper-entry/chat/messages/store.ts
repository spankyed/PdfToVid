import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { RefObject } from 'react';
import * as api from '~/shared/api/fetch';
import { Paper } from '~/shared/utils/types';

export const promptPresetsOpenAtom = atom(false);
export const tokenUsageAtom = atom({ current: 19000, max: 180000 });

export const inputAtom = atom('');

export const messagesAtom = atom<any[]>([
  // { id: 2, text: "Can you help me with my project?", timestamp: "2023-05-10T09:01:00Z", sender: 'you' },
  // { id: 3, text: "Of course! What do you need help with?", timestamp: "2023-05-10T09:02:00Z", sender: 'assistant' }
]);

export const addMessageAtom = atom(
  null, // no read function, as this atom is write-only
  (get, set, newMessage: any) => {
    set(messagesAtom, [
      ...get(messagesAtom),
      newMessage
    ]);
  }
);

export const promptOptionsAtom = atomWithStorage<any[]>('promptPresets', [
{ id: 1, text: "Write me a very clear explanation of the core assertions, implications, and mechanics elucidated in this paper." },
{ id: 2, text: "Write an analogy or metaphor that will help explain this paper to a broad audience." },
{ id: 3, text: "Explain the value of this in basic terms like you're talking to a CEO. So what? What's the bottom line here?" },
]);

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
