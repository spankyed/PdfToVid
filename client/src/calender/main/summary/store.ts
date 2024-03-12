import { atom } from 'jotai';
import { Paper } from '../../../shared/utils/types';

type HoveredPaper = Paper | null;
type AnchorEl = HTMLElement | null;

export const popoverTargetAtom = atom<HoveredPaper>(null);
export const isOpenAtom = atom(false);
export const anchorElAtom = atom<AnchorEl>(null);
export const popoverRefAtom = atom<HTMLDivElement | null>(null);
