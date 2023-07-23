const days = {
  "2021-10-01": [
    {
      id: '1',
      imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      author: '@bkristastucchio',
    },
    {
      id: '2',
      imgUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
      author: '@rollelflex_graphy726',
    },
    {
      id: '3',
      imgUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
      author: '@helloimnik',
    },
  ],
  "2021-10-05": [
    {
      id: '1',
      imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      author: '@bkristastucchio',
    },
    {
      id: '2',
      imgUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
      author: '@rollelflex_graphy726',
    },
    {
      id: '3',
      imgUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
      author: '@helloimnik',
    },
  ],
  "2021-10-02": [
    {
      id: '1',
      imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      author: '@bkristastucchio',
    },
    {
      id: '2',
      imgUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
      author: '@rollelflex_graphy726',
    },
    {
      id: '3',
      imgUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
      author: '@helloimnik',
    },
  ],
  "2021-10-03": [
    {
      id: '1',
      imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      author: '@bkristastucchio',
    },
    {
      id: '2',
      imgUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
      author: '@rollelflex_graphy726',
    },
    {
      id: '3',
      imgUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
      author: '@helloimnik',
    },
  ],
};
// src/components/PaperList.tsx

import React, { useContext } from 'react';
import { Box, Typography, ImageList, ImageListItem } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

const PaperList: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);

  // Assuming the store has a `dates` property that is an object where each key is a date
  // and the value is an array of paper objects for that date
  // const days = store.days;

  return (
    <>
      {Object.keys(days).map(date => (
        <Box key={date} sx={{ marginBottom: 2, p: 2, border: '1px dashed grey'  }}>
          <Typography variant="h6">{date}</Typography>
          {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}> */}
          <ImageList sx={{ width: 500 }} cols={3} >
            {days[date].map(paper => (
              <ImageListItem key={paper.imgUrl}>
                <img
                  src={`${paper.imgUrl}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${paper.imgUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={paper.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      ))}
    </>
  );
}

export default PaperList;
