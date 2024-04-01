import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import { Paper } from '~/shared/utils/types';

export const paperAtom = atom<Paper | null>(null);

export const pdfModalOpen = atom(false);

// export const fetchPaperAtom = atom(
//   null,
//   async (get, set, dateId) => {
//     if (!dateId) {
//       console.error("Date not found", dateId);
//       return;
//     }

//     try {
//       const response = await api.getPapersByDate(dateId);
//       const papers = response.data;
//       set(paperAtom, { papers, state: 'complete' });
//     } catch (error) {
//       console.error("Failed to fetch papers for date", error);
//       set(paperAtom, prev => ({ ...prev, state: 'error' }));
//     }
//   }
// );
