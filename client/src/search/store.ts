import { atom } from 'jotai';
import { Paper } from '~/shared/utils/types';
import * as api from '~/shared/api/fetch';

export const searchStateAtom = atom<'pending' | 'loading'| 'complete' | 'empty' | 'error'>('pending');
export const tabValueAtom = atom<0 | 1>(0);

export const searchModelAtom = atom<{
  query: string;
  dateStart: string;
  relevancy: number;
  dateEnd: string;
  favorite: boolean;
  viewed: boolean;
}>({
  query: '',
  dateStart: '',
  dateEnd: '',
  relevancy: 0,
  favorite: false,
  viewed: false,
});

export const resultListAtom = atom<Paper[]>([]);

export const submitSearchAtom = atom(
  null,
  async (get, set) => {
    // const dateEntry = get(dateEntryModelAtom);
    const form = {

    };

    const papers = await api.searchPapers(form);

    // set(resultListAtom, papers);
  }
);
