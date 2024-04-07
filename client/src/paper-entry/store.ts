import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { Paper } from '~/shared/utils/types';

export const paperAtom = atom<Paper | null>(null);

export const pdfModalOpen = atom(false);

export const pageStateAtom = atom<'loading' | 'ready' | 'error'>('loading');

export const fetchPaperAtom = atom(
  null,
  async (get, set, paperId) => {
    if (!paperId) {
      console.error("Paper id not provided", paperId);
      return;
    }
    set(pageStateAtom, 'loading');

    try {
      const response = await api.getPaperById(paperId);
      const paper = response.data;
      console.log('Paper fetched: ', {paper});

      if (!paper) {
        set(pageStateAtom, 'error');

        return;
      }

      set(paperAtom, paper);
      set(pageStateAtom, 'ready');
    } catch (error) {
      console.error(`Failed to fetch paper with id: ${paperId}`, error);
      set(pageStateAtom, 'error');
    }
  }
);
