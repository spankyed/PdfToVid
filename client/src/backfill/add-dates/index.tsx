import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom } from '../store';

const DateRangeControl: React.FC<{}> = () => {
  const [startDate, setStartDate] = useAtom(dateStartAtom);
  const [endDate, setEndDate] = useAtom(dateEndAtom);

  const handleStartDateChange = (newDate) => {
    if (newDate.isAfter(endDate)) {
      setStartDate(endDate);
    }
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate) => {
    if (newDate.isBefore(startDate)) {
      setEndDate(startDate);
    }
    setEndDate(newDate);
  };

  return (
    <div style={{ width: '25%' }}>
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
              onChange={handleStartDateChange}
            />
            <DatePicker
              sx={{ marginTop: 2 }}
              label="Before Date"
              value={endDate}
              disableFuture={true}
              minDate={startDate ? startDate : null}
              onChange={handleEndDateChange}
            />
          </LocalizationProvider>
        </Box>

        {/* <FormHelperText>You can display an error</FormHelperText> */}
      </FormControl>
      <Button variant="contained" color="success" onClick={()=>{}}>Add Dates</Button>
    </div>
  );
}

export default DateRangeControl;
