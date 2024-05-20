import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { messagesAtom, tokenUsageAtom } from './messages/store';
import { atomWithStorage } from 'jotai/utils';

type SelectedThreads = { [ key: string ]: string };
export const selectedThreadsAtom = atomWithStorage<SelectedThreads>('selectedThread', {});
export const threadOptionsAtom = atom<any[]>([
  // { description: 'Main thread', id: `1` },
]);

export const modelAtom = atom('Claude');

export const chatStateAtom = atom<'loading' | 'ready' | 'error'>('loading');

export const selectAndLoadMessagesAtom = atom(
  null,
  async (get, set, paperId: string, selectedId: string) => {
    try {
      set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: selectedId }));
      set(chatStateAtom, 'loading');
      const response = await api.getMessages(selectedId);
      const messages = response.data;

      set(chatStateAtom, 'ready');

      set(messagesAtom, messages);
    } catch (error) {
      set(chatStateAtom, 'error');
      console.error(`Failed to load chat data: ${paperId}`, error);
    }
  }
);

export const loadChatDataAtom = atom(
  null,
  async (get, set, paperId: string) => {
    try {
      const selectedThread = get(selectedThreadsAtom)[paperId];
      const noSelectedThread = selectedThread === undefined || selectedThread === null;
      const threadsResponse = await api.getThreads(paperId);
      const threads = threadsResponse.data;
      const thread = !noSelectedThread ? selectedThread : threads[0]?.id;
      const messagesResponse = await api.getMessages(thread);
      const messages = messagesResponse.data;
      const noMatchingThread = threads.find(thread => thread.id === selectedThread) === undefined;

      set(messagesAtom, messages);
      set(threadOptionsAtom, threads);

      if (noSelectedThread || noMatchingThread) {
        set(selectedThreadsAtom, {
          [paperId]: threads[0]?.id 
        });
      }

      const initializeChatResponse = await api.initializeChat(paperId);
      const pdfTokenCount = initializeChatResponse.data;

      set(tokenUsageAtom, prev => ({ ...prev, document: pdfTokenCount }));

      set(chatStateAtom, 'ready');

      console.log('chat data: ', {messages, threads, thread});
    } catch (error) {
      set(chatStateAtom, 'error');
      console.error(`Failed to load chat data: ${paperId}`, error);
    }
  }
);

export const addNewThreadAtom = atom(
  null,
  async (get, set, paperId: string) => {
    const threadOptions = get(threadOptionsAtom);
    const newThread = {
      paperId,
      description: `Thread ${threadOptions.length + 1}`,
      id: `${threadOptions.length + 1}`,
    };

    set(threadOptionsAtom, prev => ([...prev, newThread]));
    set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: newThread.id }));
    set(messagesAtom, []);

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

      set(selectedThreadsAtom, prev => ({ ...prev, [paperId]: newThreadId }));
  
      set(chatStateAtom, 'ready');

      console.log('new thread id: ', {newThreadId});
    } catch (error) {
      // set(threadOptionsAtom, prev => {
      //   return prev.filter(thread => thread.id !== newThread.id);
      // })
      // set(selectedThreadsAtom, {});
      console.error(`Failed to create new thread`, error);
    }
  }
);