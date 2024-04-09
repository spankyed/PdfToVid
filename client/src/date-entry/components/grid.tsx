import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { PlaceholderList } from '~/calendar/components/placeholder';
import PaperTile from '~/shared/components/paper/tile';
import { isSummaryOpenAtom } from '~/shared/components/paper/tile/summary/store';
import SummaryPopover from '~/shared/components/paper/tile/summary/summary';
// import { Link } from 'react-router-dom';
import { Paper } from '~/shared/utils/types';

const VideoPapersGrid: React.FC<{ papers: Paper[]; isLoading: boolean; placeholderRows?: number }> = ({
  papers,
  isLoading = false,
  placeholderRows = 4
}) => {
  const [, setSummaryOpen] = useAtom(isSummaryOpenAtom);
  useEffect(() => () => setSummaryOpen(false), []); // Close the summary popover on unmount

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2em',
      marginBottom: '2em',
    }}>
      {
        isLoading
        ? <GridPlaceholder placeholderRows={placeholderRows}/>
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

const GridPlaceholder = ({ placeholderRows }) => {
  return (
    <div>
      {Array(placeholderRows).fill(null).map((_, index) => (
        <div key={index} style={{
        }}>
          <PlaceholderList/>
        </div>
      ))}
    </div>
  );
}

export default VideoPapersGrid;
