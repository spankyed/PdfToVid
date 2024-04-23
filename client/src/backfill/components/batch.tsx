import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box, List, ListItem, ListItemButton, ListItemText, Button, Stack, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styled from '@emotion/styled';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const MockDatesTable = Array(21).fill('').map((_, i) => `04/${i}/2024`)

console.log('MockTable: ', MockDatesTable);

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
  );
};


export default BatchTable;
// Path: client/src/backfill/components/batch.tsx