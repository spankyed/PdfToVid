import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box, List, ListItem, ListItemButton, ListItemText, Button, Stack, IconButton, Tooltip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styled from '@emotion/styled';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MockDatesTable = Array(21).fill('').map((_, i) => `04/${i}/2024`)

const DualListContainer = styled(Box)({
  display: 'flex',
  border: '2px solid black',
  borderRadius: '8px',
  overflow: 'hidden',
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

const renderList = (items: string[], keyPrefix: string) => (
  <StyledList>
    {items.map((item, index) => (
      <StyledListItem disablePadding key={`${keyPrefix}-${index}`}>
        <ListItemText primary={item} />
      </StyledListItem>
    ))}
  </StyledList>
);

const BatchScrapeButton = () => {
  const info = `We recommend scraping papers in batches of 20 days. Then take the opportunity to review those papers, starring papers you find interesting.
  It is also good to occasionally unfavorite papers you find less interesting than the latest papers you might’ve seen.`
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure button and icon are aligned */}
    <Button variant="contained" color="warning" onClick={() => {}}>
      <Tooltip title={info}>
        <HelpOutlineIcon sx={{ mr: 1}}/>
      </Tooltip>
      Scrape Batch
    </Button>

  </div>
  );
};

const BatchTable: React.FC = () => {
  // Calculate the number of items per column dynamically
  const [pageIndex, setPageIndex] = useState(0);
  const sections = 5;
  const itemsPerColumn = Math.ceil(MockDatesTable.length / sections);

  const handlePrevious = () => {
    setPageIndex((current) => Math.max(current - 1, 0));
  };

  const handleNext = () => {
    setPageIndex((current) => Math.min(current + 1, itemsPerColumn - 1));
  };

  const splitList = MockDatesTable.reduce((acc, item, index) => {
    const sectionIndex = Math.floor(index / itemsPerColumn);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(item);
    return acc;
  }, [] as string[][]);

  return (
    <div style={{ width: '55%' }} className='flex flex-col'>
      <Box sx={{ display: 'flex', justifyContent: 'end', minWidth: 200, placeSelf: 'center', marginBottom: 2  }}>
        {/* <Box sx={{ display: 'flex', justifyContent: "space-between", minWidth: 420, placeSelf: 'center', marginTop: 2  }}> */}
        <BatchScrapeButton/>
        {/* <Button variant="contained" color="secondary">Clear Results</Button> */}
        {/* <Button variant="contained" color='success'>Scrape Batch</Button> */}
      </Box>

      <DualListContainer>
        <div className='flex flex-col'>
          <div className='flex'>
            {
              splitList.map((list, index) => renderList(list, `list-${index}`))
            }
          </div>
          <Stack direction="row" justifyContent="space-between" padding={0} className=' border border-t-2'>
            <IconButton onClick={()=>{}} disabled={pageIndex === 0}>
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
            <IconButton onClick={handlePrevious} disabled={pageIndex === 0}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton onClick={handleNext} disabled={pageIndex === sections - 1}>
              <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton onClick={()=>{}} disabled={pageIndex === sections - 1}>
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
          </Stack>
        </div>

      </DualListContainer>
    </div>
  );
};

export default BatchTable;