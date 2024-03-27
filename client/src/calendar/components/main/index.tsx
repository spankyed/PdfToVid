import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CalendarModel } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalendarModelAtom, calendarModelAtom, calendarStateAtom, calendarLoadMonthAtom } from '~/calendar/components/main/store';
import { BackfillComponent } from '../backfill';
import { openMonthAtom, datesListAtom } from '~/shared/components/layout/sidebar/dates/store';
import './main.css';

function CalendarMain(): React.ReactElement {
  const [calendarModel] = useAtom(calendarModelAtom);
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
        : <DateRows rows={calendarModel} />
      }
    </>
  );
}

function DateRows({ rows }: { rows: CalendarModel }): React.ReactElement {
  const [calendarState] = useAtom(calendarStateAtom);
  const isLoading = calendarState === 'loading';

  return (
    <>
      { isLoading
        ? <DatesPlaceholder />
        : <DatesList rows={rows} />
      }
    </>
  );
}

export default CalendarMain;
