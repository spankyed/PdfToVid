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
import { throttle } from '~/shared/utils/throttle';
import { colors } from '~/shared/styles/theme';
import { featureDisabledAlertAtom } from '~/shared/components/notification/store';

const borderColor = '#787878';

const DualListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  border: `.0005rem solid ${borderColor}`,
  borderRadius: '8px',
  width: 'fit-content',
  midWidth: '20rem'
  // overflow: 'hidden',
}));

// Styled List with dividers between lists
const StyledList = styled(List)({
  padding: 0,
  flex: 1,
  '&:not(:last-child)': {
    borderRight: `.0005rem solid #78787875`, // Add divider except for the last list
  },
});

// Styled ListItem for underlining each element
const StyledListItem = styled(ListItem)<{ status: string }>(({ status }) => {
  const colorByStatus = {
    default: 'inherit',
    scraping: '#FFA500', // orange hex
    ranking: '#125EA8', // blue hex
    complete: '#008000', // green hex
    error: '#FF0000', // red hex
  };

  return ({
    backgroundColor: colorByStatus[status],
    borderBottom: `1px solid #78787875`,  // Apply bottom border to all items
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
  const itemsPerColumn = Math.ceil(20 / sections);
  // const itemsPerColumn = Math.ceil(dates.length / sections);

  const fetchDates = useSetAtom(getDatesAtom);
  const buttonsDisabled = useAtomValue(buttonsDisabledAtom);
  const featureDisabledAlert = useSetAtom(featureDisabledAlertAtom);

  const goTo = direction => () => {
    featureDisabledAlert();
  }

  // useEffect(() => {
  //   // Initial load: retrieves the most recent date records
  //   if (dates.length === 0 || state === 'idle') {
  //     fetchDates('rightEnd');
  //   }
  // } , []);

  const splitList = dates.reduce((acc, date, index) => {
    const sectionIndex = Math.floor(index / itemsPerColumn);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(date);
    return acc;
  }, [] as DateItem[][]);

  const populateEmptySections = (list) => {
    for (let i = 0; i < sections - 1; i++) {
      const currSection = list[i] ? list[i] : [];

      if (currSection.length === itemsPerColumn) {
        continue;
      }
      const amountToFill = itemsPerColumn - currSection.length;
      const emptyColumn = new Array(amountToFill).fill({ status: 'default' });
      
      if (currSection.length) {
        list[i] = currSection.concat(emptyColumn);
      } else {
        list.push(emptyColumn);
      }
    }
    return list;
  }

  const navBlocked = dates.length === 0 || state === 'loading';

  return (
    <Box sx={{
        alignItems: 'center',
        display: 'flex', justifyContent: "center",
        flexDirection: 'column',
        width: '100%'
      }}>
      <DualListContainer>
        <div className='flex flex-col'>
          <div className='flex'>
            {
              splitList.length > 0
              ? populateEmptySections(splitList).map((dates, index) => (
                <StyledList key={`list-${index}`}>
                  {dates.map((date, index) => (
                    <StyledListItem disablePadding key={`${date.value}-${index}`} status={date.status}
                      sx={{ height: '3em', maxHeight: '3em', width: '14rem' }}
                    >
                      <ListItemText
                        sx={{ font: 'inherit', textAlign: 'center', letterSpacing: '0px' }}
                        primary={date.value ? formatDate('MM/DD/YYYY')(date.value) : ''}
                      />
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
            sx={{ borderTop: `.0005rem solid ${borderColor}`, px: 2, py: 1 }}
            direction="row" justifyContent="space-between" padding={0} className=''>
            <IconButton onClick={goTo('leftEnd')} disabled={navBlocked || buttonsDisabled.leftEnd}>
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
            <IconButton onClick={goTo('left')} disabled={navBlocked || buttonsDisabled.left}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <span className='mx-4 text-center self-center mr-2' style={{ color: '#ffffff89' }}>
              Batch Size
              <strong
                className='px-3 py-1 ml-3'
                style={{
                  color: `${colors.palette.text.primary}`,
                  borderRadius: '8px',
                  backgroundColor: `rgba(0,0,0, 0.1)`,
                  // backgroundColor: `${colors.palette.background.default}`,
                  border: `.1rem solid ${borderColor}`
                }}
              >
                {dates.length}
              </strong>
            </span>
            <IconButton onClick={goTo('right')} disabled={navBlocked || buttonsDisabled.right}>
              <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton onClick={goTo('rightEnd')} disabled={navBlocked || buttonsDisabled.rightEnd}>
              <KeyboardDoubleArrowRightIcon />
            </IconButton>
          </Stack>
        </div>

      </DualListContainer>
      <BatchScrapeButton disabled={navBlocked} dates={dates}/>
      {/* <Button variant="contained" color='success'>Scrape Batch</Button> */}
    </Box>
  );
};

const BatchScrapeButton = ({ disabled, dates }) => {
  const state = useAtomValue(batchStateAtom);
  const scrapeBatch = useSetAtom(batchScrapeAtom);
  // const throttledScrapeBatch = throttle(scrapeBatch, 1000); // Adjust the delay (in milliseconds) as needed
  const featureDisabledAlert = useSetAtom(featureDisabledAlertAtom);

  // const navigate = useNavigate();
  const isComplete = state === 'complete';

  const onClick = () => {
    featureDisabledAlert();
  }

  const scrapeInfo = `Scrape and rank papers for dates in batch. This could take a few minutes. We recommend having less than 75 starred papers as it may reduce the time spent ranking papers.`
  const viewInfo = `After scraping a date batch take the opportunity to review the papers, starring the ones you find interesting. Occasionally un-star papers you no longer find interesting.`

  return (
  <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure button and icon are aligned */}
    <LoadingButton
        variant="contained"
        color={isComplete ? 'success' : 'primary'}
        disabled={disabled}
        onClick={onClick}
        loading={state === 'loading'}
        sx={{ mt: 4, mb: 2}}
      >
      <Tooltip title={isComplete ? viewInfo : scrapeInfo}>
        <HelpOutlineIcon sx={{ mr: 1}}/>
      </Tooltip>
      { isComplete ? 'View Batch' : 'Scrape batch'  }
    </LoadingButton>

  </div>
  );
};

const formatDate = (format) => (date: string) => dayjs(date).format(format);

export default BatchTable;