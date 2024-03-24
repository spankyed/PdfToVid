import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CalenderModel } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalenderModelAtom, calenderModelAtom, calenderStateAtom, calenderLoadMonthAtom } from '~/calender/components/main/store';
import { BackfillComponent } from '../backfill';
import { openMonthAtom, datesListAtom } from '~/shared/components/layout/sidebar/dates/store';
import './main.css';

function CalenderMain(): React.ReactElement {
  const [calenderModel] = useAtom(calenderModelAtom);
  const [, fetchData] = useAtom(fetchCalenderModelAtom);
  const [calenderState] = useAtom(calenderStateAtom);
  const showBackfill = calenderState === 'backfill';

  const [openMonth] = useAtom(openMonthAtom);
  const [datesList] = useAtom(datesListAtom); // todo useMemo
  const [, loadMonth] = useAtom(calenderLoadMonthAtom);

  
  useEffect(() => {
    const date = datesList.find(d => d.month === openMonth)?.dates[0]?.value;

    if (openMonth && date) {
      loadMonth(date)
    } else {
      fetchData();
    }
  }, [fetchData]);

  return (
    <>
      { showBackfill 
        ? <BackfillComponent />
        : <DateRows rows={calenderModel} />
      }
    </>
  );
}

function DateRows({ rows }: { rows: CalenderModel }): React.ReactElement {
  const [calenderState] = useAtom(calenderStateAtom);
  const isLoading = calenderState === 'loading';

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
