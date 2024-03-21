import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Pagination, Typography } from '@mui/material';
import { CalenderModel } from '~/shared/utils/types';
import { useAtom } from 'jotai';
import SummaryPopover from '~/calender/components/summary/summary';
import Scraping from '~/shared/components/scraping';
import Ranking from '~/shared/components/ranking';
import { selectedDateAtom } from '~/shared/store';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '~/shared/utils/dateFormatter';
import DatesPlaceholder from '../placeholder';
import List from './papers-list';
import EmptyState from '~/shared/components/empty/empty';
import { calenderLoadMoreAtom } from './store';

function DatesList({ rows }: { rows: CalenderModel }): React.ReactElement {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const navigate = useNavigate();
  const lastElementRef = useRef(null); // Step 1: Create the ref

  const reformatDateMemo = useCallback((inputDate: string): string => {
    return formatDate(inputDate, {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });
  }, []);

  useEffect(() => {
    if (lastElementRef.current) {
      (lastElementRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [rows]);
  
  const onDateClick = date => e => {
    const is = tag => e.target.tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    navigate(`/date/${date.value}`);
  }

  return (
    <>
      <SummaryPopover/>

      {rows.map(({ date, papers }, index) => {
        const { value, status } = date;
        const calenderPageSize = 5
        const isFocalElement = index === calenderPageSize + 1;

        const contentByStatus = {
          pending: <Empty date={value} />,
          scraping: <Scraping />,
          ranking: <Ranking />,
          complete: <List papers={papers} />,
          noData: <DatesPlaceholder />,
        };
        
        return (
          <Box 
            key={'date-' + value} 
            ref={isFocalElement ? lastElementRef : null} // Step 2: Attach the ref to the last element
            // onMouseEnter={() => setSelectedDate(value)}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
              paddingTop: 2,  
              paddingBottom: 2,
              backgroundColor: selectedDate === value ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              margin: '.5rem 2rem',
            }}
            onClick={onDateClick(date)}
          >
          <Typography variant="h5" 
            sx={{ 
              textDecoration: 'none', 
              marginBottom: '4px',
              marginTop: '.5em',
              background: '#FE6B8B', // Adjust the gradient colors as needed
              webkitBackgroundClip: 'text',
              webkitTextFillColor: 'transparent',
              padding: '.25em 1em .25em 1em',
              borderRadius: '5px',
              fontWeight: 'bold',
              transform: 'skewX(-5deg)', // Adds a slant to the text
              display: 'inline-block', // Necessary for transform
              boxShadow: '2px 2px 10px rgba(106, 48, 147, 0.4)', // Soft shadow with a color that matches the gradient
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '0.01em',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // subtle text shadow for depth
              cursor: 'pointer',
            }}
          >
            {reformatDateMemo(value)}
          </Typography>

            {
              contentByStatus[status]
            }
          </Box>
        );
      })}

      <LoadMoreButton dbCursor={rows[rows.length - 1]?.date.value} />
    </>
  );
}

function Empty({ date }: { date: string }): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <EmptyState date={date}/>
    </Box>
  );
}


const LoadMoreButton = ({ dbCursor }) => {
  console.log('dbCursor: ', dbCursor);
  const [, loadNextPage] = useAtom(calenderLoadMoreAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!isLoading) {
      setIsLoading(true);

      await loadNextPage(dbCursor);

      setIsLoading(false);

      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 2000);
    }
  };
  
  return (
    <div className="flex justify-center mt-8 mb-8">
      <Button
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={handleClick} // Pass the function directly
        className="text-white bg-red-500 hover:bg-red-700 ... your tailwind classes here ..."
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Load More ...'}
      </Button>
    </div>
  );
};


export default DatesList;
