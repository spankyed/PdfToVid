import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { messagesAtom } from './messages/store';

export const selectedThreadAtom = atom<string | null>(null);
export const threadOptionsAtom = atom<any[]>([
  // { description: 'Main thread', id: `1` },
]);

export const modelAtom = atom('Claude');

export const chatStateAtom = atom<'loading' | 'ready' | 'error'>('loading');

export const docAtom = atom({
  title: "Chain of Thoughtlessness: An Analysis of CoT in Planning",
  description: "Large language model (LLM) performance on reasoning problems typically does not generalize out of distribution. Previous work has claimed that this can be mitigated by modifying prompts to include examples with chains of thought--demonstrations of solution procedures--with the intuition that it is possible to in-context teach an LLM an algorithm for solving the problem.",
  viewMode: "full"
});

export const loadChatDataAtom = atom(
  null,
  async (get, set, paperId) => {
    try {
      const response = await api.getChatData(paperId);
      const { messages, threads } = response.data;

      set(messagesAtom, messages);
      set(threadOptionsAtom, threads);
      set(selectedThreadAtom, threads[0].id);

      console.log('chat data: ', response.data);
    } catch (error) {
      console.error(`Failed to load chat data: ${paperId}`, error);
    }
  }
);

export const addNewThreadAtom = atom(
  null,
  async (get, set, paperId) => {
    const threadOptions = get(threadOptionsAtom);
    const newThread = {
      paperId,
      description: `Thread ${threadOptions.length + 1}`,
      id: `${threadOptions.length + 1}`,
    };

    set(threadOptionsAtom, prev => ([...prev, newThread]));
    set(selectedThreadAtom, newThread.id);

    set(chatStateAtom, 'loading')

    try {
      const response = await api.createThread(newThread);
      const newThreadId = response.data;

      console.log('newThreadId: ', newThreadId);

      set(threadOptionsAtom, prev => (prev.map(thread => {
        if (thread.id === newThread.id) {
          return { ...thread, id: newThreadId };
        }
        return thread;
      })));

      set(selectedThreadAtom, newThreadId);
  
      set(chatStateAtom, 'ready');

      console.log('new thread id: ', {newThreadId});
    } catch (error) {
      // set(threadOptionsAtom, prev => {
      //   return prev.filter(thread => thread.id !== newThread.id);
      // })
      // set(selectedThreadAtom, '1');
      console.error(`Failed to create new thread`, error);
    }
  }
);