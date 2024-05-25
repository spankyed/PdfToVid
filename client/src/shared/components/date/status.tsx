import React, { useContext } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useAtom } from 'jotai';
import Scraping from './scraping';
import Ranking from './ranking';
import ActionButton from './action-button';

function ScrapeStatus({ date, scrapeAtom, status }: { date: string; scrapeAtom: any, status: string }): React.ReactElement {
  const contentByStatus = {
    pending: <ActionButton date={date} scrapeAtom={scrapeAtom}/>,
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

export default ScrapeStatus;
