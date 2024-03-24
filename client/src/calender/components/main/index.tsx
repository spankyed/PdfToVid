import React, { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { CalenderModel } from '~/shared/utils/types';
import DatesList from './dates-list';
import DatesPlaceholder from '../placeholder';
import { fetchCalenderModelAtom, calenderModelAtom, calenderStateAtom } from '~/calender/components/main/store';
import { BackfillComponent } from '../backfill';
import './main.css';

function CalenderMain(): React.ReactElement {
  const [calenderModel] = useAtom(calenderModelAtom);
  const [, fetchData] = useAtom(fetchCalenderModelAtom);
  const [calenderState] = useAtom(calenderStateAtom);
  const showBackfill = calenderState === 'backfill';

  useEffect(() => {
    fetchData();
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
