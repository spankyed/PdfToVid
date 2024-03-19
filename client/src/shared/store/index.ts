import { atom } from 'jotai';
import * as api from '../api/fetch';
import { papersListAtom } from '~/calender/components/main/store';

export const selectedDayAtom = atom<string>('');
