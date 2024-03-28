import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import DatesList from './list/main-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalendarModelAtom, calendarStateAtom, calendarLoadMonthAtom } from '~/calendar/components/main/store';
import { BackfillComponent } from '../backfill';
import { openMonthAtom, datesListAtom } from '~/shared/components/layout/sidebar/dates/store';
import './main.css';

function CalendarMain(): React.ReactElement {
  const [, fetchData] = useAtom(fetchCalendarModelAtom);
  const [calendarState] = useAtom(calendarStateAtom);
  const showBackfill = calendarState === 'backfill';

  const [openMonth] = useAtom(openMonthAtom);
  const [datesList] = useAtom(datesListAtom); // todo useMemo
  const [, loadMonth] = useAtom(calendarLoadMonthAtom);
  
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
        : <DateRows/>
      }
    </>
  );
}

function DateRows(): React.ReactElement {
  const [calendarState] = useAtom(calendarStateAtom);
  const isLoading = calendarState === 'loading';
  const isError = calendarState === 'error';

  return (
    <>
      { isLoading
        ? <DatesPlaceholder />
        : (
          isError
            ? <div>Failed to fetch calendar data</div>
            : <DatesList />
        )
      }
    </>
  );
}

export default CalendarMain;
