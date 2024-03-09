import React, { useCallback, useContext, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import EmptyState from '~/shared/components/Empty';
import Scraping from '~/shared/components/Scraping';
import Ranking from '~/shared/components/Ranking';
import { useAtom } from 'jotai';
import { papersListAtom, selectedDayAtom } from '../../shared/state';
import { formatDate } from '~/shared/utils/dateFormatter';
import PapersList from './Carousel-List';

function Papers(): React.ReactElement {
  const navigate = useNavigate();
  // const store = useContext<StoreType>(StoreContext);
  // const { state, papersList, selectedDay, selectDay} = store.dashboard;

  const [papersList] = useAtom(papersListAtom);
  const [selectedDay, setSelectedDay] = useAtom(selectedDayAtom);
  
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

  // const is = a => b => a === b;

  return (
    <>
      {papersList.map(({ day, papers }) => {
        const { value, status } = day;

        const contentByStatus = {
          pending: <Empty day={value} />,
          scraping: <Scraping />,
          ranking: <Ranking />,
          complete: <PapersList papers={papers} />,
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

export default Papers;
