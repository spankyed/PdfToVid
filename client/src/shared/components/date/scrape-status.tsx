import React, { useContext } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import Scraping from '~/shared/components/scraping';
import Ranking from '~/shared/components/ranking';

function ScrapeStatus({ date, scrapeAtom, status }: { date: string; scrapeAtom: any, status: string }): React.ReactElement {
  const contentByStatus = {
    pending: <Empty date={date} scrapeAtom={scrapeAtom}/>,
    scraping: <Scraping />,
    ranking: <Ranking />,
    error: <>Error</>
  };

  return (
    <>
      {
        contentByStatus[status]
      }
    </>
  );
}

function Empty({ date, scrapeAtom }: { date: string; scrapeAtom: any }): React.ReactElement {
  const [, scrapePapers] = useAtom(scrapeAtom);

  const scrape = () => {
    scrapePapers(date);
  }
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} margin={3}>
      <Typography variant="h3">No Papers Scraped</Typography>
      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={scrape}>Scrape & Rank</Button>
        <Button variant="contained" color="secondary" disabled>Generate Content*</Button>
        {/* <Button variant="contained" color="primary" disabled>Fully auto</Button> */}
      </Box>
    </Box>
  );
}

export default ScrapeStatus;
