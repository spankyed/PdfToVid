import React, { useCallback, useState } from 'react';
import { Box, Pagination, Typography } from '@mui/material';
import { PapersList } from '~/shared/utils/types';
import { useAtom } from 'jotai';
import SummaryPopover from '~/calender/components/summary/summary';
import Scraping from '~/shared/components/scraping';
import Ranking from '~/shared/components/ranking';
import { selectedDayAtom } from '~/shared/store';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '~/shared/utils/dateFormatter';
import DatesPlaceholder from '../placeholder';
import List from './papers-list';
import EmptyState from '~/shared/components/empty/empty';

function DatesList({ papersList }: { papersList: PapersList[] }): React.ReactElement {
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom);
  const navigate = useNavigate();

  const reformatDateMemo = useCallback((inputDate: string): string => {
    return formatDate(inputDate, {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    });
  }, []);
  
  const onDayClick = date => e => {
    const is = tag => e.target.tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    navigate(`/date/${date.value}`);
  }

  return (
    <>
      {papersList.map(({ day, papers }) => {
        const { value, status } = day;


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
            // onMouseEnter={() => setSelectedDay(value)}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
              paddingTop: 2,  
              paddingBottom: 2,
              backgroundColor: selectedDay === value ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
            }}
            onClick={onDayClick(day)}
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

      <SummaryPopover/>
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

export default DatesList;
