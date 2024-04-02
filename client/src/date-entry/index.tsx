import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Button, Grid, TextField, CircularProgress, LinearProgress, Badge, styled } from '@mui/material';
import Scraping from '~/shared/components/scraping';
import EmptyState from '~/shared/components/empty/empty';
import { useAtom } from 'jotai';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom'; // Import useParams
import { datePageStateAtom, fetchPapersByDateAtom } from './store';
import PageTitle from './components/page-title';
import MainTabs from './components/main';
import PageLayout from '~/shared/components/layout/page-layout';

function DateEntryPage(): React.ReactElement {
  let { dateId } = useParams<{ dateId: string }>();
  dateId = dateId || '';

  const [, fetchData] = useAtom(fetchPapersByDateAtom);
  const [datePage] = useAtom(datePageStateAtom);

  useEffect(() => {
    fetchData(dateId);
  }, [fetchData]);
  
  const { papers, state: dateState } = datePage;

  const componentsByState = {
    'pending': <Empty date={dateId}/>,
    'scraping': <div style={{paddingTop: '5em'}}><Scraping /></div>,
    'ranking': <div style={{paddingTop: '5em'}}>Ranking...</div>,
    'complete': <MainTabs papers={papers} />,
  }

  return (
    <PageLayout padding={3} style={{ marginTop: 3, margin: '0 auto'}}>
      <PageTitle date={dateId} count={papers.length} />
      {componentsByState[dateState]}
    </PageLayout>
  );
}

const Empty: React.FC<{ date: string }> = ({ date }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={20}>
      <EmptyState date={date}/>
    </Box>
  );
}

export default DateEntryPage;
