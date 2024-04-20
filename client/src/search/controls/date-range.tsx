import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom } from '../store';

const DateRangeControl: React.FC<{}> = () => {
  const [startDate, setStartDate] = useAtom(dateStartAtom);
  const [endDate, setEndDate] = useAtom(dateEndAtom);

  return (
    <FormControl
      required
      error={false}
      component="fieldset"
      variant="standard"
    >
      {/* <FormLabel component="legend">By Date</FormLabel> */}
      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="After Date"
            value={startDate}
            disableHighlightToday={true}
            disableFuture={true}
            maxDate={endDate ? endDate : null}
            onChange={newValue => setStartDate(newValue)}
          />
          <DatePicker
            sx={{ marginTop: 2 }}
            label="Before Date"
            value={endDate}
            disableFuture={true}
            minDate={startDate ? startDate : null}
            onChange={newValue => setEndDate(newValue)}
          />
        </LocalizationProvider>
      </Box>

      {/* <FormHelperText>You can display an error</FormHelperText> */}
    </FormControl>
  );
}

export default DateRangeControl;
