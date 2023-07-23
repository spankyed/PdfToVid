// src/components/SearchPanel.tsx

import React, { useContext } from 'react';
import { TextField, Box, Card, CardContent, Typography } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

const SearchPanel: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);

  // Assuming the store has a `searchResults` property that is an array of result objects
  // const searchResults = store.searchResults;
  const searchResults = [
    {
      title: 'Breakfast',
      date: '2021-10-01',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    },
    {
      title: 'Breakfast',
      date: '2021-10-01',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    },
    {
      title: 'Breakfast',
      date: '2021-10-01',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    },
    {
      title: 'Breakfast',
      date: '2021-10-01',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    },
    {
      title: 'Breakfast',
      date: '2021-10-01',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    },
  ];

  return (
    <Box>
      <TextField label="Search" variant="outlined" fullWidth />
      {searchResults.map(result => (
        <Card key={result.title} sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="h6">{result.title}</Typography>
            <Typography variant="body2" color="text.secondary">{result.date}</Typography>
            <Typography variant="body1">{result.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default SearchPanel;