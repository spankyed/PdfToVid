import React, { useCallback, useState } from 'react';
import { Box, Pagination, Typography } from '@mui/material';
import Thumbnail from '~/shared/components/Thumbnail';
import { Paper, PapersList } from '~/shared/utils/types';
import { useAtom } from 'jotai';
import { anchorElAtom, isOpenAtom, popoverTargetAtom, tooltipRefAtom } from './popover/store';
import CustomTooltip from '~/dashboard/papers/popover/summary';
import EmptyState from '~/shared/components/Empty';
import Scraping from '~/shared/components/Scraping';
import Ranking from '~/shared/components/Ranking';
import { selectedDayAtom } from '~/shared/state';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '~/shared/utils/dateFormatter';

function PapersListV2({ papersList }: { papersList: PapersList[] }): React.ReactElement {
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
        // noData: <NoData />,
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
  )
}

function Empty({ day }: { day: string }): React.ReactElement {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <EmptyState day={day}/>
    </Box>
  );
}


function List({ papers }: { papers: Paper[] }): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(2);
  const [, setAnchorEl] = useAtom(anchorElAtom);
  const [, setIsOpen] = useAtom(isOpenAtom);
  const [tooltipRef] = useAtom(tooltipRefAtom);
  const [, setPaperTarget] = useAtom(popoverTargetAtom);

  const handlePageChange = (event, value) => {
    setPreviousPage(currentPage);
    setCurrentPage(value);
  };

  const emPxUnit = parseInt(getComputedStyle(document.documentElement).fontSize);
  const totalImages = papers.length;
  const imagesPerPage = 4;
  const margin = 1; // in em, 1em = 16px

  const handleMouseOver = (paper) => (event: React.MouseEvent<HTMLElement>) => {
    setPaperTarget(paper)
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!tooltipRef?.contains(relatedTarget)) {
      setIsOpen(false);
    }
  };

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
                <div 
                  className={isOffscreen ? 'offscreen-image' : ''} 
                  key={paper.id}
                  onMouseOver={handleMouseOver(paper)}
                  onMouseLeave={handleMouseOut}
                >
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

export default PapersListV2;
