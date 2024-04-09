import { atom } from 'jotai';
import { Paper } from '~/shared/utils/types';
import * as api from '~/shared/api/fetch';

export const searchStateAtom = atom<'pending' | 'loading'| 'complete' | 'empty' | 'error'>('pending');
export const tabValueAtom = atom<0 | 1>(0);
export const resultListAtom = atom<Paper[]>([]);

export const queryAtom = atom('');
export const favoriteAtom = atom(false);
export const viewedAtom = atom(false);
export const relevancyAtom = atom(0);
export const dateStartAtom = atom(null);
export const dateEndAtom = atom(null);
export const initialStateAtom = atom(false);
export const approvedStateAtom = atom(false);
export const generatedStateAtom = atom(false);
export const publishedStateAtom = atom(false);

export const submitSearchAtom = atom(
  null,
  async (get, set) => {
    set(searchStateAtom, 'loading');

    const form = {
      query: get(queryAtom),
      favorite: get(favoriteAtom),
      viewed: get(viewedAtom),
      relevancy: get(relevancyAtom),
      dateStart: get(dateStartAtom),
      dateEnd: get(dateEndAtom),
      initialState: get(initialStateAtom),
      approvedState: get(approvedStateAtom),
      generatedState: get(generatedStateAtom),
      publishedState: get(publishedStateAtom),
    };
    try {
      const result = await api.searchPapers(form) as unknown as any[];

      if (result.length === 0) {
        set(searchStateAtom, 'empty');
      } else {
        set(searchStateAtom, 'complete');
      }

      set(resultListAtom, (result as any));
    } catch (error) {
      console.error("Failed to search papers:", error);
      set(searchStateAtom, 'error');
    }
  }
);

export const resetFieldsAtom = atom(
  null,
  (get, set) => {
    set(queryAtom, '');
    set(favoriteAtom, false);
    set(viewedAtom, false);
    set(relevancyAtom, 0);
    set(dateStartAtom, null);
    set(dateEndAtom, null);
    set(initialStateAtom, false);
    set(approvedStateAtom, false);
    set(generatedStateAtom, false);
    set(publishedStateAtom, false);
  }
);
