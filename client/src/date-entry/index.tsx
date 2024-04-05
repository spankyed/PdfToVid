import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Button, Grid, TextField, CircularProgress, LinearProgress, Badge, styled } from '@mui/material';
import Scraping from '~/shared/components/scraping';
import EmptyState from '~/shared/components/date/empty';
import { useAtom } from 'jotai';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom'; // Import useParams
import { dateEntryModelAtom, dateEntryStateAtom, fetchPapersByDateAtom, resetDateEntryStatusAtom, scrapePapersDateEntryAtom } from './store';
import PageTitle from './components/page-title';
import MainTabs from './components/main';
import PageLayout from '~/shared/components/layout/page-layout';
import ResetState from '~/shared/components/date/reset';

function DateEntryPage(): React.ReactElement {
  let { dateId } = useParams<{ dateId: string }>();
  dateId = dateId || '';

  const [, fetchData] = useAtom(fetchPapersByDateAtom);
  const [datePage] = useAtom(dateEntryModelAtom);

  useEffect(() => {
    fetchData(dateId);
  }, []);
  
  const { papers } = datePage;

  // todo change complicated nested ternary into a flat switch statement component
  return (
    <PageLayout padding={3} style={{ marginTop: 3, margin: '0 auto'}}>
      <PageTitle date={dateId} count={papers.length} />
      <RenderByState
        dateId={dateId}
        papers={papers}
      />
      {/* {componentsByDayState[dateState]} */}
    </PageLayout>
  );
}

function RenderByState({ dateId, papers }) {
  const [state] = useAtom(dateEntryStateAtom);

  switch (state) {
    case 'loading':
      return <MainTabs papers={papers} isLoading={true} />;
    case 'error':
      return <div>Error: Date Not Found</div>;
    case 'unexpected':
      return <div><ResetState date={dateId} resetStatusAtom={resetDateEntryStatusAtom} /></div>;
    case 'pending':
      return <Empty date={dateId} />;
    case 'complete':
    default:
      return <MainTabs papers={papers} />;
  }
}

const Empty: React.FC<{ date: string }> = ({ date }) => {
  // todo display active scraping status
  // const componentsByDayState = {
  //   'pending': <Empty date={dateId}/>,
  //   'scraping': <div style={{paddingTop: '5em'}}><Scraping /></div>,
  //   'ranking': <div style={{paddingTop: '5em'}}>Ranking...</div>,
  //   'complete': <MainTabs papers={papers} />,
  // }
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={20}>
      <EmptyState date={date} scrapeAtom={scrapePapersDateEntryAtom}/>
    </Box>
  );
}

export default DateEntryPage;
