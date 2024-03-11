import React, { useCallback, useState } from 'react';
import { Box, Pagination, Typography } from '@mui/material';
import { PapersList } from '~/shared/utils/types';
import { useAtom } from 'jotai';
import CustomTooltip from '~/dashboard/papers/popover/summary';
import Scraping from '~/shared/components/Scraping';
import Ranking from '~/shared/components/Ranking';
import { selectedDayAtom } from '~/shared/state';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '~/shared/utils/dateFormatter';
import DatesPlaceholder from './placeholder';
import List from './papers';
import EmptyState from '~/shared/components/Empty';

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
  
  const onDayClick = day => e => {
    const is = tag => e.target.tagName === tag;
    const ignore = is('BUTTON') || is('path') || is('svg') || is('LI');

    if (ignore) return;

    navigate(`/day/${day.value}`);
  }

  return (
    <>
      {papersList.map(({ day, papers }) => {
        const { value, status } = day;


        const contentByStatus = {
          pending: <Empty day={value} />,
          scraping: <Scraping />,
          ranking: <Ranking />,
          complete: <List papers={papers} />,
          noData: <DatesPlaceholder />,
        };
        
        return (
          <Box 
            key={'day-' + value} 
            // onMouseEnter={() => setSelectedDay(value)}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
              paddingTop: 2,  
              paddingBottom: 2,
              backgroundColor: selectedDay === value ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              cursor: 'pointer',
            }}
            onClick={onDayClick(day)}
          >
            <Typography variant="h5" style={{ textDecoration: 'none', marginBottom: 4, marginTop: '.5em' }} >
              {reformatDateMemo(value)}
            </Typography>
            {
              contentByStatus[status]
            }
          </Box>
        );
      })}

      <CustomTooltip/>
    </>
  );
}

function Empty({ day }: { day: string }): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <EmptyState day={day}/>
    </Box>
  );
}

export default DatesList;
