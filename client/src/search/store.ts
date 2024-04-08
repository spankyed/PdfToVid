import { atom } from 'jotai';
import { Paper } from '~/shared/utils/types';
// import * as api from '../api/fetch';

// export const selectedDateAtom = atom<string>('');

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