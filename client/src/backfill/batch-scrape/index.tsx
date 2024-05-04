import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FormControl, Box, List, ListItem, ListItemButton, ListItemText, Button, Stack, IconButton, Tooltip } from '@mui/material';
import styled from '@emotion/styled';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { LoadingButton } from '@mui/lab';
import { DateItem, batchDatesAtom, batchScrapeAtom, batchStateAtom, buttonsDisabledAtom, getDatesAtom } from './store';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

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

const BatchTable: React.FC = () => {
  // Calculate the number of items per column dynamically
  const [pageIndex, setPageIndex] = useState(0);
  const sections = 5;
  const dates = useAtomValue(batchDatesAtom);
  const state = useAtomValue(batchStateAtom);
  const itemsPerColumn = Math.ceil(dates.length / sections);

  const fetchDates = useSetAtom(getDatesAtom);
  const buttonsDisabled = useAtomValue(buttonsDisabledAtom);

  const goTo = direction => () => {
    fetchDates(direction);
  }

  useEffect(() => {
    // Initial load: retrieves the most recent date records
    if (dates.length === 0 || state === 'idle') {
      fetchDates('rightEnd');
    }
  } , []);

  const splitList = dates.reduce((acc, date, index) => {
    const sectionIndex = Math.floor(index / itemsPerColumn);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(date);
    return acc;
  }, [] as DateItem[][]);

  const navBlocked = dates.length === 0 || state === 'loading';

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: "center", marginBottom: 2  }}>
        <BatchScrapeButton disabled={navBlocked}/>
        {/* <Button variant="contained" color='success'>Scrape Batch</Button> */}
      </Box>

      <DualListContainer>
        <div className='flex flex-col'>
          <div className='flex'>
            {
              splitList.length > 0
              ? splitList.map((dates, index) => (
                <StyledList key={`list-${index}`}>
                  {dates.map((date, index) => (
                    <StyledListItem disablePadding key={`${date.value}-${index}`} status={date.status}>
                      <ListItemText primary={formatDate('MM/DD/YYYY')(date.value)} />
                    </StyledListItem>
                  ))}
                </StyledList>
              ))
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
            <IconButton onClick={goTo('leftEnd')} disabled={navBlocked || buttonsDisabled.leftEnd}>
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
            <IconButton onClick={goTo('left')} disabled={navBlocked || buttonsDisabled.left}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton onClick={goTo('right')} disabled={navBlocked || buttonsDisabled.right}>
              <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton onClick={goTo('rightEnd')} disabled={navBlocked || buttonsDisabled.rightEnd}>
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
          </Stack>
        </div>

      </DualListContainer>
    </>
  );
};

const BatchScrapeButton = ({ disabled }) => {
  const state = useAtomValue(batchStateAtom);
  const scrapeBatch = useSetAtom(batchScrapeAtom);
  const navigate = useNavigate();
  const isComplete = state === 'complete';

  const onClick = () => {
    if (isComplete) {
      const startDate = '2024-04-01';
      const endDate = '2024-04-30';
      const queryParams = new URLSearchParams({ startDate, endDate });
      const searchParamsString = queryParams.toString();
      const newUrl = `/search?${searchParamsString}`;
      navigate(newUrl);
    } else {  
      scrapeBatch();
    }
  }

  const scrapeInfo = `Scrape papers for dates in batch. This could take a few minutes.`
  const viewInfo = `After scraping a date batch take the opportunity to review the papers, starring the ones you find interesting. Occasionally un-star papers you no longer find interesting.`

  return (
  <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure button and icon are aligned */}
    <LoadingButton
        variant="contained"
        color={isComplete ? 'primary' : 'warning'}
        disabled={disabled}
        onClick={onClick}
        loading={state === 'loading'}
        // sx={{ mr: 2 }}
      >
      <Tooltip title={isComplete ? viewInfo : scrapeInfo}>
        <HelpOutlineIcon sx={{ mr: 1}}/>
      </Tooltip>
      { isComplete ? 'View Batch' : 'Scrape Batch'  }
    </LoadingButton>

  </div>
  );
};

const formatDate = (format) => (date: string) => dayjs(date).format(format);

export default BatchTable;