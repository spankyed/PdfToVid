import React, { useState } from 'react';
import {  Button, Pagination,  } from '@mui/material';
import Thumbnail from '~/shared/components/thumbnail';
import { Paper } from '~/shared/utils/types';
import { useAtom } from 'jotai';
import { anchorElAtom, isSummaryOpenAtom, popoverTargetAtom, popoverRefAtom, hoverTimeoutAtom } from '../summary/store';
import { resetDateStatusAtom } from '../../store';

function List({ papers, date }: { papers: Paper[]; date: string }): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(2);

  const handlePageChange = (event, value) => {
    setPreviousPage(currentPage);
    setCurrentPage(value);
  };

  const totalImages = papers.length;
  const imagesPerPage = 4;

  return (
    <div className="wrapper" style={{ margin: '1em' }}>
      <div className="carousel-container">
        {
          papers.length === 0 ? (
            <ErrorState date={date} />
          ) : (
            <>
              <Carousel
                papers={papers}
                imagesPerPage={imagesPerPage}
                previousPage={previousPage}
                currentPage={currentPage}
              />
              <div className="pagination-wrapper">
                <Pagination
                  count={Math.ceil(totalImages / imagesPerPage)}
                  shape="rounded"
                  color="primary"
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )
        }
      </div>
    </div>
  ); 
}

function Carousel({ papers, imagesPerPage, previousPage, currentPage }) {
  const emPxUnit = parseInt(getComputedStyle(document.documentElement).fontSize);
  const margin = 1; // in em, 1em = 16px
  const carouselWidth = imagesPerPage * (320 + (emPxUnit * margin * 2));

  return (
    <div
      className="carousel-wrapper"
      style={{ transform: `translateX(-${(currentPage - 1) * carouselWidth}px)` }}
    >
    {
      papers.map((paper, index) => {
        return (
          <PaperTile
            paper={paper}
            currentPage={currentPage}
            previousPage={previousPage}
            imagesPerPage={imagesPerPage}
            index={index}
            key={paper.id}
          />
        )
      })
    }
  </div>
  );
}

function PaperTile({ paper, currentPage, previousPage, imagesPerPage, index }) {
  const [, setAnchorEl] = useAtom(anchorElAtom);
  const [, setIsOpen] = useAtom(isSummaryOpenAtom);
  const [popoverRef] = useAtom(popoverRefAtom);
  const [, setPaperTarget] = useAtom(popoverTargetAtom);
  const [hoverTimeout, setHoverTimeout] = useAtom(hoverTimeoutAtom);
  const isCurrentPage = index >= (currentPage - 1) * imagesPerPage && index < currentPage * imagesPerPage;
  const isPreviousPage = index >= (previousPage - 1) * imagesPerPage && index < previousPage * imagesPerPage;
  const isOffscreen = !isCurrentPage && !isPreviousPage;

  const handleMouseOver = (paper) => (event: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    const target = event.currentTarget; // ! javascript :)

    const timeoutId = setTimeout(() => {
      setPaperTarget(paper);
      setAnchorEl(target);
      setIsOpen(true);
    }, 10);

    setHoverTimeout(timeoutId);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);

    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!popoverRef?.contains(relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className={isOffscreen ? 'offscreen-image' : ''} 
      onMouseOver={handleMouseOver(paper)}
      onMouseLeave={handleMouseOut}
    >
      <Thumbnail paper={paper} />
    </div>
  );
}

const ErrorState = ({ date }) => {
  const [, resetDateStatus] = useAtom(resetDateStatusAtom);

  const reset = () => {
    resetDateStatus(date)
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto my-8">
      <div className="font-medium text-gray-800 text-lg mb-2">Issue finding papers</div>
      <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
        <li>Make sure Chroma DB is running</li>
        <li>ArXiv's servers may be down</li>
        <li>Maybe we broke something.. again</li>
        <li>Actually no papers submitted (unlikely)</li>
      </ul>
      <button 
        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        type="button"
        onClick={reset}
      >
        Reset Status
      </button>
    </div>
  );
};

export default List;
