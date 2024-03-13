import React, { useState } from 'react';
import { useAtom } from 'jotai';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { backFillFetchAtom } from '../store'; // Adjust the import path to where your atoms are defined
import { Typography } from '@mui/material';
import { getDayPrior } from '~/shared/utils/dateFormatter';

export const BackfillComponent: React.FC = () => {
  const [value, setValue] = useState(dayjs(getDayPrior(5)));
  const [, backFillFetch] = useAtom(backFillFetchAtom);

  const handleSubmit = () => {
    console.log('handleSubmit: ', handleSubmit);
    if (value) {
      const formattedDate = value.format('YYYY-MM-DD');
      backFillFetch(formattedDate);
    }
  };

  // center content
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <Typography 
        style={{ marginBottom: '2rem'}}
        variant="h3">
        To Get Started
      </Typography>
      <Typography style={{ marginBottom: '2rem'}}>
        Select the earliest day that you may want to scrape and rank papers for.
      </Typography>
    
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <DatePicker
            label="Start Date"
            value={value}
            onChange={(newValue: any) => setValue(newValue)}
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Backfill Dates
          </Button>
        </div>
      </LocalizationProvider>
    </div>
  );
};
