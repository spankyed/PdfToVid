import { atom } from 'jotai';
import * as api from '../api/fetch';
import { calendarModelAtom } from '~/calendar/store';

export const selectedDateAtom = atom<string>('');

export const modalOpen = atom<string>('');
