import React, { useState } from 'react';
import { Box } from '@mui/material';

function DatesPlaceholder(): React.ReactElement {
  const fakeDates = Array(3).fill(null);

  return (
    <>
      {fakeDates.map((_, index) => (
        <Box 
          key={'day-placeholder-' + index}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
            paddingTop: 2,  
            paddingBottom: 2,
            cursor: 'pointer',
          }}
        >
          <div style={{ width: '100px', height: '20px', backgroundColor: '#ccc', marginBottom: 4, marginTop: '.5em' }} />
          <PlaceholderList />
        </Box>
      ))}

      {/* You can include <CustomTooltip/> if it's needed for the placeholder as well */}
    </>
  );
}

function PlaceholderList(): React.ReactElement {
  // Assume 4 placeholders to mimic 4 papers
  const fakeThumbs = Array(4).fill(null);

  return (
    <div className="wrapper" style={{ margin: '1em' }}>
      <div className="carousel-container">
        <div className="carousel-wrapper">
          {fakeThumbs.map((_, index) => (
            <div className="placeholder-thumbnail" key={index}>
              <ThumbnailPlaceholder />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ThumbnailPlaceholder({ shadow = false }): React.ReactElement {
  return (
    <div
      style={{ 
        position: 'relative', 
        width: '320px', 
        height: '180px',  
        backgroundColor: '#ccc', // This makes the box grey
        borderBottomRightRadius: '4px',
        borderBottomLeftRadius: '4px',
        boxShadow: shadow ? '0px 2px 15px rgba(0, 0, 0, 0.6)' : 'none',
        padding: '1em',
      }}
      className='thumb-img'
    >
      {/* Placeholder content can go here if needed */}
    </div>
  )
}

export default DatesPlaceholder;
