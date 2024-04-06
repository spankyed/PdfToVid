import React from 'react';
// import { Link } from 'react-router-dom';

import Thumbnail from '~/shared/components/paper/thumbnail';
import { Paper } from '~/shared/utils/types';

const VideoPapersGrid: React.FC<{ papers: Paper[] }> = ({ papers }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1em', // This will create spacing between items
    }}>
      {/* {papers.map((paper, index) => (
        <div key={index} style={{
        }}>
          <Thumbnail paper={paper} shadow={true}/>
        </div>
      ))} */}
      {
        papers.map((paper, index) => (
          <div key={`${paper.id}-${index}`} style={{}}>
            <Thumbnail paper={paper} shadow={true} />
          </div>
        ))
      }
    </div>
  );
}

export default VideoPapersGrid;
