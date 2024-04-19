import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import DateRows from './dates-rows';
import DatesPlaceholder from './placeholder';
import { fetchCalendarModelAtom, calendarStateAtom, calendarLoadMonthAtom } from '~/calendar/store';
import { BackfillComponent } from '../../onboard/backfill';
import { openMonthAtom, datesRowsAtom } from '~/shared/components/layout/sidebar/dates/store';
import './main.css';
import { useNavigate } from 'react-router-dom';

function CalendarMain(): React.ReactElement {
  const [, fetchData] = useAtom(fetchCalendarModelAtom);
  const [, loadMonth] = useAtom(calendarLoadMonthAtom);
  const [datesRows] = useAtom(datesRowsAtom); // todo useMemo
  const [openMonth] = useAtom(openMonthAtom);
  const [calendarState] = useAtom(calendarStateAtom);
  const navigate = useNavigate();

  const showBackfill = calendarState === 'backfill';
  
  useEffect(() => {
    const date = datesRows.find(d => d.month === openMonth)?.dates[0]?.value;

    if (openMonth && date) {
      loadMonth(date)
    } else {
      fetchData();
    }
  }, [fetchData]);

    useEffect(() => {
      if (showBackfill) {
        navigate('/onboard');
      }
    }, [showBackfill]);

  return (
    <>
      <MainContent/>
    </>
  );
}

function MainContent(): React.ReactElement {
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
            : <DateRows />
        )
      }
    </>
  );
}

export default CalendarMain;
