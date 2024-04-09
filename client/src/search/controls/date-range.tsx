import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const DateRangeControl: React.FC<{}> = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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
            label="From Date"
            value={fromDate}
            onChange={(newValue: any) => setFromDate(newValue)}
          />
          <DatePicker
            sx={{ marginTop: 2 }}
            label="To Date"
            value={toDate}
            onChange={(newValue: any) => setToDate(newValue)}
          />
        </LocalizationProvider>
      </Box>

      {/* <FormHelperText>You can display an error</FormHelperText> */}
    </FormControl>
  );
}

export default DateRangeControl;
