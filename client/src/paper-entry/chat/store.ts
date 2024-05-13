import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { Paper } from '~/shared/utils/types';

export const threadAtom = atom('Thread 1');
export const modelAtom = atom('Claude');
export const tokenUsageAtom = atom({ current: 19000, max: 180000 });

export const docAtom = atom({
  title: "Chain of Thoughtlessness: An Analysis of CoT in Planning",
  description: "Large language model (LLM) performance on reasoning problems typically does not generalize out of distribution. Previous work has claimed that this can be mitigated by modifying prompts to include examples with chains of thought--demonstrations of solution procedures--with the intuition that it is possible to in-context teach an LLM an algorithm for solving the problem.",
  viewMode: "full"
});

// export const messagesAtom = atom<any>([]);

export const messagesAtom = atom([
  { id: 2, text: "Can you help me with my project?", timestamp: "2023-05-10T09:01:00Z", sender: 'you' },
  { id: 3, text: "Of course! What do you need help with?", timestamp: "2023-05-10T09:02:00Z", sender: 'assistant' }
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