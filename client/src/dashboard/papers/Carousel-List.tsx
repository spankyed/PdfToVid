import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import Thumbnail from '~/shared/components/Thumbnail';
import { Paper } from '~/shared/utils/types';

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

export default PapersList;
