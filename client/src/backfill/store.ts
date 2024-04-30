import { atom } from 'jotai';
import * as api from '~/shared/api/fetch';
import config from '@config';

export const backfillStateAtom = atom<'ready' | 'loading'>('ready');
export const recommendButtonDisabledAtom = atom(false);
