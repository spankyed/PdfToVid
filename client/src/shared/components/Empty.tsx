import React, { useContext } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { StoreContext } from '~/index';
import { StoreType } from '../store';


function EmptyState({ day }: { day: string }): React.ReactElement {
  const store = useContext<StoreType>(StoreContext);
  const { scrapePapers } = store.dashboard;

  const scrape = () => {
    console.log('scrapePapers');
    scrapePapers(day);
  }

  return (
    <>
      <Typography variant="h3">No Papers Scraped</Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" disabled>Full auto</Button>
        <Button variant="contained" color="secondary" disabled>Scrape & generate</Button>
        <Button variant="outlined" onClick={scrape}>Scrape</Button>
      </Box>
    </>
  );
}

export default EmptyState;
