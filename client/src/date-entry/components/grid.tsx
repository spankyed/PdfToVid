import React from 'react';
import { PlaceholderList } from '~/calendar/components/placeholder';
import PaperTile from '~/shared/components/paper/tile';
import SummaryPopover from '~/shared/components/paper/tile/summary/summary';
// import { Link } from 'react-router-dom';
import { Paper } from '~/shared/utils/types';

const VideoPapersGrid: React.FC<{ papers: Paper[]; isLoading: boolean }> = ({ papers, isLoading = false }) => {
  // useEffect(() => () => setSummaryOpen(false), []); // Close the summary popover on unmount
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2em',
      marginBottom: '2em',
    }}>
      {
        isLoading
        ? <GridPlaceholder />
        : <>
            {
              papers.map((paper, index) => (
                <div key={`${paper.id}-${index}`}>
                  <PaperTile paper={paper} shadow={true}/>
                </div>
              ))
            }
          </>
      }
      <SummaryPopover/>
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
