import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Pagination, Typography } from '@mui/material';
import { CalendarModel, DateRow } from '~/shared/utils/types';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import Scraping from '~/shared/components/scraping';
import Ranking from '~/shared/components/ranking';
import { formatDate } from '~/shared/utils/dateFormatter';
import DatesPlaceholder from '../../placeholder';
import List from './papers-carousel';
import EmptyState from '~/shared/components/empty/empty';
import { useNavigate } from 'react-router-dom';
import { selectedDateAtom } from '~/shared/store';

function ListItem({ dateAtom, isFocalElement }: { dateAtom: PrimitiveAtom<DateRow>; isFocalElement: boolean }): React.ReactElement {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const { date, papers } = useAtomValue(dateAtom); // Access the state of each individual date atom
  const { value, status } = date;
  // const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const navigate = useNavigate();

  const reformatDateMemo = useCallback((inputDate: string): string => {
    return formatDate(inputDate, {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });
  }, []);

  const onDateClick = date => e => {
    const is = tag => e.target.tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    navigate(`/date/${date.value}`);
  }

  const contentByStatus = {
    pending: <Empty date={value} />,
    scraping: <Scraping />,
    ranking: <Ranking />,
    complete: <List papers={papers} date={value} />,
    noData: <DatesPlaceholder />,
  };

  return (
    <Box 
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
}

function Empty({ date }: { date: string }): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <EmptyState date={date}/>
    </Box>
  );
}

export default ListItem;
