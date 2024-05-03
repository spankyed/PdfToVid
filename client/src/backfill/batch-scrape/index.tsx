import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FormControl, Box, List, ListItem, ListItemButton, ListItemText, Button, Stack, IconButton, Tooltip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styled from '@emotion/styled';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LoadingButton } from '@mui/lab';
import { DateItem, batchDatesAtom, batchScrapeAtom, batchStateAtom, buttonsDisabledAtom, getDatesAtom, updateStatusAtom } from './store';
import SocketListener from '~/shared/api/socket-listener';
import dayjs from 'dayjs';

const DualListContainer = styled(Box)({
  display: 'flex',
  border: '.0005rem solid rgb(54 59 61 / 30%)',
  borderRadius: '8px',
  width: 'fit-content',
  midWidth: '20rem'
  // overflow: 'hidden',
});

// Styled List with dividers between lists
const StyledList = styled(List)({
  padding: 0,
  flex: 1,
  '&:not(:last-child)': {
    borderRight: '1px solid #ccc', // Add divider except for the last list
  },
});

// Styled ListItem for underlining each element
const StyledListItem = styled(ListItem)<{ status: string }>(({ status }) => {
  const colorByStatus = {
    default: 'inherit',
    scraping: '#FFA500', // orange hex
    ranking: '#800080', // purple hex
    complete: '#008000', // green hex
    error: '#FF0000', // red hex
  };

  return ({
    backgroundColor: colorByStatus[status],
    borderBottom: '1px solid #ccc',  // Apply bottom border to all items
    padding: '2px 12px',
    '&:last-child': {
      borderBottom: 'none',  // Remove border for the last child
    },
    '.MuiTypography-root': { // Targeting the ListItemText directly
      letterSpacing: '3px', // Adding letter-spacing
    },
  });
});

const renderList = (dates: DateItem[], keyPrefix: string) => {
  return (
    <StyledList key={keyPrefix}>
      {dates.map((date, index) => (
        <StyledListItem disablePadding key={`${date.value}-${index}`} status={date.status}>
          <ListItemText primary={formatDate('MM/DD/YYYY')(date.value)} />
        </StyledListItem>
      ))}
    </StyledList>
  )
};

const BatchScrapeButton = () => {
  const state = useAtomValue(batchStateAtom);
  const scrapeBatch = useSetAtom(batchScrapeAtom);
  
  const info = `We recommend scraping papers in batches of 20 days. Then take the opportunity to review those papers, starring papers you find interesting.
  It is also good to occasionally unfavorite papers you find less interesting than the latest papers you might’ve seen.`
  return (
  <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure button and icon are aligned */}
    <LoadingButton
        variant="contained"
        color="warning"
        disabled={false} // todo - add logic to disable button if no dates to scrape
        onClick={scrapeBatch}
        loading={state === 'loading'}
        // sx={{ mr: 2 }}
      >
      <Tooltip title={info}>
        <HelpOutlineIcon sx={{ mr: 1}}/>
      </Tooltip>
      Scrape Batch
    </LoadingButton>

  </div>
  );
};

const BatchTable: React.FC = () => {
  // Calculate the number of items per column dynamically
  const [pageIndex, setPageIndex] = useState(0);
  const sections = 5;
  const dates = useAtomValue(batchDatesAtom);
  const itemsPerColumn = Math.ceil(dates.length / sections);

  const fetchDates = useSetAtom(getDatesAtom);
  const updateStatus = useSetAtom(updateStatusAtom);
  const buttonsDisabled = useAtomValue(buttonsDisabledAtom);

  const goTo = direction => () => {
    fetchDates(direction);
  }

  useEffect(() => {
    // Load the last page of data
    fetchDates('rightEnd');
  } , []);

  const splitList = dates.reduce((acc, date, index) => {
    const sectionIndex = Math.floor(index / itemsPerColumn);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(date);
    return acc;
  }, [] as DateItem[][]);

  const noDates = dates.length === 0;

  const handleDateStatusUpdate = ({ key, status: newStatus, data: papers }) => {
    console.log('key: ', {key, newStatus, papers});
    updateStatus({ date: key, status: newStatus, count: papers?.length });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: "center", marginBottom: 2  }}>
        <BatchScrapeButton/>
        {/* <Button variant="contained" color='success'>Scrape Batch</Button> */}
      </Box>

      <DualListContainer>
        <div className='flex flex-col'>
          <div className='flex'>
            {
              splitList.length > 0
              ? splitList.map((list, index) => renderList(list, `list-${index}`))
              : <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 420, height: 120, placeSelf: 'center', marginBottom: 2,
                  textAlign: 'center',
                }}>
                  No dates to scrape
                </Box>
            }
          </div>
          <Stack
            sx={{
              borderTop: '.0005rem solid rgb(54 59 61 / 30%)',
            }}
            direction="row" justifyContent="space-between" padding={0} className=''>
            <IconButton onClick={goTo('leftEnd')} disabled={noDates || buttonsDisabled.leftEnd}>
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
            <IconButton onClick={goTo('left')} disabled={noDates || buttonsDisabled.left}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton onClick={goTo('right')} disabled={noDates || buttonsDisabled.right}>
              <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton onClick={goTo('rightEnd')} disabled={noDates || buttonsDisabled.rightEnd}>
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
          </Stack>
        </div>

      </DualListContainer>
      <SocketListener eventName="date_status" handleEvent={handleDateStatusUpdate} />
    </>
  );
};

const formatDate = (format) => (date: string) => dayjs(date).format(format);

export default BatchTable;