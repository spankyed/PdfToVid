import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { Paper } from '~/shared/utils/types';

export const paperAtom = atom<Paper | null>(null);

export const pdfModalOpen = atom(false);

export const pageState = atom('loading');

export const fetchPaperAtom = atom(
  null,
  async (get, set, paperId) => {
    if (!paperId) {
      console.error("Paper id not provided", paperId);
      return;
    }
    set(pageState, 'loading');

    try {
      const response = await api.getPaperById(paperId);
      const paper = response.data;
      console.log('paper fetched: ', paper);
      set(paperAtom, paper);
      set(pageState, 'ready');
    } catch (error) {
      console.error(`Failed to fetch paper with id: ${paperId}`, error);
      set(pageState, 'error');
    }
  }
);
