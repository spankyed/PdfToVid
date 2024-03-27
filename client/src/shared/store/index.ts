import { atom } from 'jotai';
import * as api from '../api/fetch';
import { calendarModelAtom } from '~/calendar/components/main/store';

export const selectedDateAtom = atom<string>('');
