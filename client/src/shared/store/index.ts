import { Atom, atom } from 'jotai';
import { Paper } from '../utils/types';
// import * as api from '../api/fetch';

export const selectedDateAtom = atom<string>('');
export const emptyAtom = atom([]);

// interface ListItem {
//   id: number;
//   [key: string]: any;
// }

interface UpdateParams {
  papersListAtom: Atom<Paper[]>;
  id: string;
  property: string;
  newValue: any 
}

export const updatePaperInListAtom = atom(
  null,
  (get, set, { papersListAtom, id, property, newValue }: UpdateParams) => {
    const papersList = get(papersListAtom);
    const updatedItemList = papersList.map(item =>
      item.id === id ? { ...item, [property]: newValue } : item
    );

    set(papersListAtom as any, updatedItemList);
  }
);

