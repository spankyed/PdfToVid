import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { Paper } from '~/shared/utils/types';

export const threadAtom = atom('1');
export const modelAtom = atom('Claude');

export const docAtom = atom({
  title: "Chain of Thoughtlessness: An Analysis of CoT in Planning",
  description: "Large language model (LLM) performance on reasoning problems typically does not generalize out of distribution. Previous work has claimed that this can be mitigated by modifying prompts to include examples with chains of thought--demonstrations of solution procedures--with the intuition that it is possible to in-context teach an LLM an algorithm for solving the problem.",
  viewMode: "full"
});

// export const messagesAtom = atom<any>([]);

