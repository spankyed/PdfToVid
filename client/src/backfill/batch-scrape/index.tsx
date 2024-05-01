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
import { batchDatesAtom, batchScrapeAtom, batchStateAtom, buttonsDisabledAtom, getDatesAtom } from './store';


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
  flex: 1,
  '&:not(:last-child)': {
    borderRight: '1px solid #ccc', // Add divider except for the last list
  },
});

// Styled ListItem for underlining each element
const StyledListItem = styled(ListItem)({
  borderBottom: '1px solid #ccc',  // Apply bottom border to all items
  padding: '2px 12px',
  '&:last-child': {
    borderBottom: 'none',  // Remove border for the last child
  },
  '.MuiTypography-root': { // Targeting the ListItemText directly
    letterSpacing: '3px', // Adding letter-spacing
  },
});

const renderList = (items: string[], keyPrefix: string) => {
  console.log('items: ', items);
  return (
    <StyledList>
      {items.map((item, index) => (
        <StyledListItem disablePadding key={`${keyPrefix}-${index}`}>
          <ListItemText primary={item} />
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

  const getDates = useSetAtom(getDatesAtom);
  const buttonsDisabled = useAtomValue(buttonsDisabledAtom);

  const goTo = direction => () => {
    getDates(direction);
  }

  useEffect(() => {
    // Load the first page of data
    getDates('rightEnd');
  } , []);

  const splitList = dates.reduce((acc, item, index) => {
    const sectionIndex = Math.floor(index / itemsPerColumn);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(item);
    return acc;
  }, [] as string[][]);

  const noDates = dates.length === 0;

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
    </>
  );
};

export default BatchTable;