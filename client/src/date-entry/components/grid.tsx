import React from 'react';
import { PlaceholderList } from '~/calendar/components/placeholder';
// import { Link } from 'react-router-dom';

import Thumbnail from '~/shared/components/paper/thumbnail';
import { Paper } from '~/shared/utils/types';

const VideoPapersGrid: React.FC<{ papers: Paper[]; isLoading: boolean }> = ({ papers, isLoading = false }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2em',
    }}>
      {
        isLoading
        ? <GridPlaceholder />
        : <>
            {
              papers.map((paper, index) => (
                <div key={`${paper.id}-${index}`}>
                  <Thumbnail paper={paper} shadow={true} />
                </div>
              ))
            }
          </>
      }
    </div>
  );
}

const GridPlaceholder = () => {
  return (
    <div>
      {Array(4).fill(null).map((_, index) => (
        <div key={index} style={{
        }}>
          <PlaceholderList/>
        </div>
      ))}
    </div>
  );
}

export default VideoPapersGrid;
