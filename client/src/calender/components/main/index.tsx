import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CalenderModel } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalenderGridDataAtom, calenderModelAtom } from '~/calender/components/main/store';
import { BackfillComponent } from '../backfill';
import { hasDatesAtom } from '../backfill/store';

function CalenderMain(): React.ReactElement {
  const [calenderModel] = useAtom(calenderModelAtom);
  const [hasDates] = useAtom(hasDatesAtom);

  const [, fetchData] = useAtom(fetchCalenderGridDataAtom);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      { hasDates 
        ? <DateRows rows={calenderModel} />
        : <BackfillComponent />
      }
    </>
  );
}

function DateRows({ rows }: { rows: CalenderModel }): React.ReactElement {
  const isLoading = rows.length === 0; // until first fetch, assume no dates = is-loading
  return (
    <>
      { isLoading
        ? <DatesPlaceholder />
        : <DatesList rows={rows} />
      }
    </>
  );
}

export default CalenderMain;
