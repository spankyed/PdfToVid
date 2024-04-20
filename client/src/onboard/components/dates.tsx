import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import { getDatePrior } from '~/shared/utils/dateFormatter';
import { canGoNextAtom } from '../store';


const todaysDate = dayjs().format('MMMM D, YYYY');

export const BackfillComponent: React.FC = () => {
  const [value, setValue] = useState(dayjs(getDatePrior(30)));
  const setCanGoNext = useSetAtom(canGoNextAtom);

  useEffect(() => {
    if (value) {
      setCanGoNext(value.isValid());
    } else {
      setCanGoNext(false);
    }
  }, [value]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem', marginBottom: '2.5rem' }}>
      <Typography 
        style={{ color: '#a1a1a1', marginBottom: '2rem'}}
        variant="h3">
        Add Dates
      </Typography>
      <Typography>
        To get started, choose the earliest date for which you'd like to scrape papers.
      </Typography>
      <Typography>
        Don't worry, more dates can be added later!
      </Typography>
    
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DatePicker
            label="Start Date"
            value={value}
            format="MMMM D, YYYY"
            disableFuture={true}
            onChange={(newValue: any) => setValue(newValue)}
          />
        </div>
      </LocalizationProvider>

      <div style={{
          height: '3rem',
          width: '1px',
          backgroundColor: 'gray',
          margin: '1.2rem auto'
        }}></div>

      {/* <span style={{ color: 'gray', fontSize: '14px' }}>Today</span> */}
      <span style={{ color: 'gray', fontSize: '14px' }}>{todaysDate}</span>
    </div>
  );
};
