import { atom } from 'jotai';
import { Paper } from '~/shared/utils/types';
import * as api from '~/shared/api/fetch';
import type dayjs from 'dayjs'; // Import dayjs if you haven't already

export const searchStateAtom = atom<'pending' | 'loading'| 'complete' | 'empty' | 'error'>('pending');
export const tabValueAtom = atom<0 | 1>(0);
export const resultListAtom = atom<Paper[]>([]);


type Day = dayjs.Dayjs | null;
