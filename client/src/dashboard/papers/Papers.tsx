import React, { useCallback, useContext, useState } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Thumbnail from '~/shared/components/Thumbnail';
import EmptyState from '~/shared/components/Empty';
import Scraping from '~/shared/components/Scraping';
import Ranking from '~/shared/components/Ranking';
import { useAtom } from 'jotai';
import { papersListAtom, selectedDayAtom } from '../../shared/state';
import { Paper } from '~/shared/utils/types';
import { formatDate } from '~/shared/utils/dateFormatter';

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

function PapersList({ papers }: { papers: Paper[] }): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(2);

  const handlePageChange = (event, value) => {
    setPreviousPage(currentPage);
    setCurrentPage(value);
  };

  const emPxUnit = parseInt(getComputedStyle(document.documentElement).fontSize);
  const totalImages = papers.length;
  const imagesPerPage = 4;
  const margin = 1; // in em, 1em = 16px

  return (
    <div className="wrapper" style={{ margin: '1em' }}>
      <div className="carousel-container">
        <div
          className="carousel-wrapper"
          style={{ 
            transform: `translateX(-${
              (currentPage - 1) * 
              (imagesPerPage * (320 + (emPxUnit * margin * 2)) )
            }px)` 
          }}
        >
          {
            papers.map((paper, index) => {
              const isCurrentPage = index >= (currentPage - 1) * imagesPerPage && index < currentPage * imagesPerPage;
              const isPreviousPage = index >= (previousPage - 1) * imagesPerPage && index < previousPage * imagesPerPage;
              
              const isOffscreen = !isCurrentPage && !isPreviousPage;

              return (
                <div className={isOffscreen ? 'offscreen-image' : ''} key={paper.id}>
                  <Thumbnail paper={paper} />
                </div>
              )
            })
          }
        </div>
        <div className="pagination-wrapper">
          <Pagination
            count={Math.ceil(totalImages / imagesPerPage)}
            shape="rounded"
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>

      </div>
    </div>
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
