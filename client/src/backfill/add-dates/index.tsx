import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FormControl, Box, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom, backfillStateAtom } from './store';
import LoadingButton from '@mui/lab/LoadingButton';
import { addDatesAtom } from './store';
import dayjs from 'dayjs';
import { featureDisabledAlertAtom } from '~/shared/components/notification/store';

const DateRangeControl: React.FC<{}> = () => {
  const [startDate, setStartDate] = useAtom(dateStartAtom);
  const [endDate, setEndDate] = useAtom(dateEndAtom);
  const state = useAtomValue(backfillStateAtom);
  const addDates = useSetAtom(addDatesAtom);
  const featureDisabledAlert = useSetAtom(featureDisabledAlertAtom);

  const handleSubmit = () => {
    if (startDate && endDate) {
      featureDisabledAlert();
      // todo if new dates are prior to dates in current batch, update batch to start at new earliest date
    }
  };

  const handleStartDateChange = (newDate) => {
    const twentyDaysLater = dayjs(newDate.add(20, 'days'));
    const today = dayjs();
    const isAfterToday = twentyDaysLater.isAfter(today);
    setStartDate(newDate);
    setEndDate(isAfterToday ? dayjs().add(-1, 'day') : twentyDaysLater)
  };

  // const handleEndDateChange = (newDate) => {
  //   if (newDate.isBefore(startDate)) {
  //     setEndDate(startDate);
  //   }
  //   setEndDate(newDate);
  // };

  return (
      <FormControl
        required
        error={false}
        component="fieldset"
        variant="standard"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5
        }}
      >
        <LoadingButton
          variant="contained"
          color="secondary"
          disabled={!startDate || !endDate}
          onClick={handleSubmit}
          loading={state === 'loading'}
          sx={{ marginBottom: 4 }}
        >
          Load Dates
        </LoadingButton>

        {/* <FormLabel component="legend">By Date</FormLabel> */}
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={<span style={{ color: '#9e9e9e' }}>Start Date</span>}
              value={startDate}
              disableHighlightToday={true}
              disableFuture={true}
              maxDate={dayjs().add(-1, 'day')}
              onChange={handleStartDateChange}
            />
            <DatePicker
              disabled={true}
              sx={{ marginLeft: 4 }}
              label={<span style={{ color: '#9e9e9e' }}>End Date</span>}
              value={endDate}
              disableFuture={true}
              minDate={startDate ? startDate : null}
              // onChange={handleEndDateChange}
            />
          </LocalizationProvider>
        </Box>

        {/* <FormHelperText>You can display an error</FormHelperText> */}
      </FormControl>
  );
}

export default DateRangeControl;
