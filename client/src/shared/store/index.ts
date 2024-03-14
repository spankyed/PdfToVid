import { atom } from 'jotai';
import * as api from '../api/fetch';
import { papersListAtom } from '~/calender/components/grid/store';

export const selectedDayAtom = atom<string>('');
