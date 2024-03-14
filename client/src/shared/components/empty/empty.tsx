import React, { useContext } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import { scrapePapersAtom } from './store';
// import { StoreContext } from '~/index';
// import { StoreType } from '../store';


function EmptyState({ day }: { day: string }): React.ReactElement {
  // const store = useContext<StoreType>(StoreContext);
  // const { scrapePapers } = store.calender;

  const [, scrapePapers] = useAtom(scrapePapersAtom);

  const scrape = () => {
    scrapePapers(day);
  }

  return (
    <>
      <Typography variant="h3">No Papers Scraped</Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" disabled>Fully auto</Button>
        <Button variant="contained" color="secondary" disabled>Generate Content</Button>
        <Button variant="outlined" onClick={scrape}>Scrape & Rank</Button>
      </Box>
    </>
  );
}

export default EmptyState;
