import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { PapersList } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalenderGridDataAtom, papersListAtom } from '~/calender/components/grid/store';
import { BackfillComponent } from '../backfill';
import { hasDatesAtom } from '../backfill/store';

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

  const [, fetchData] = useAtom(fetchCalenderGridDataAtom);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


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
