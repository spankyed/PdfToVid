import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CalenderModel } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalenderModelAtom, calenderModelAtom } from '~/calender/components/main/store';
import { BackfillComponent } from '../backfill';
import { hasDatesAtom } from '../backfill/store';

function CalenderMain(): React.ReactElement {
  const [hasDates] = useAtom(hasDatesAtom);
  const [calenderModel] = useAtom(calenderModelAtom);
  const [, fetchData] = useAtom(fetchCalenderModelAtom);

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
  const isLoading = rows.length === 0; // until first fetch, assume no dates = data-is-loading
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
