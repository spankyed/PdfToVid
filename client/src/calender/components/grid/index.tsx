import React, { useCallback, useState } from 'react';
import { useAtom } from 'jotai';
import { PapersList } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from './placeholder';
import { hasDatesAtom } from '~/calender/store';
import { papersListAtom } from '~/shared/store';
import { BackfillComponent } from './backfill';

function List({ papersList }: { papersList: PapersList[] }): React.ReactElement {
  return (
    <>
      {
        papersList.length === 0
          ? <DatesPlaceholder />
          : <DatesList papersList={papersList} />
      }
    </>
  );
}

function Grid(): React.ReactElement {
  const [papersList] = useAtom(papersListAtom);
  const [hasDates] = useAtom(hasDatesAtom);

  return (
    <>
      { !hasDates 
        ? <BackfillComponent />
        : <List papersList={papersList} />
      }
    </>
  );
}

export default Grid;
