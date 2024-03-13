import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Button, Grid, TextField, CircularProgress, LinearProgress } from '@mui/material';
// import { Paper, StoreType } from '~/shared/store';
// import { StoreContext } from '..';
import PapersTable from './PapersTable';
import Scraping from '~/shared/components/Scraping';
import EmptyState from '~/shared/components/Empty';
import VideoPapersGrid from './VideosGrid';
import SearchAndActions from './SearchActions';
import { Paper } from '~/shared/utils/types';
import { useAtom } from 'jotai';
import { fetchPapersForDayAtom, dayPageStateAtom } from '~/shared/state';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom'; // Import useParams
import { formatDateParts } from '~/shared/utils/dateFormatter';


function Day(): React.ReactElement {
  let { dayId } = useParams<{ dayId: string }>();
  dayId = dayId || '';

  const [, fetchData] = useAtom(fetchPapersForDayAtom);
  const [dayPage] = useAtom(dayPageStateAtom);

  useEffect(() => {
    fetchData(dayId);
  }, [fetchData]);
  
  const { papers, state } = dayPage;
  // const { papers, state } = { state: 'complete', papers: [] as Paper[]};

  const componentsByState = {
    'pending': <Empty day={dayId}/>,
    'scraping': <div style={{paddingTop: '5em'}}><Scraping /></div>,
    'ranking': <div style={{paddingTop: '5em'}}>Ranking...</div>,
    'complete': <PageTabs papers={papers} />,
  }

  return (
    <Box padding={3} sx={{ marginTop: 3, margin: '0 auto', maxWidth: '90%' }}>
      <PageTitle date={dayId} />
      {componentsByState[state]}
    </Box>
  );
}

const PageTitle: React.FC<{ date: string }> = ({ date }) => {
  // const [formattedDate, weekday] = useMemo(() => {
    const formattedDate = useMemo(() => {
      const [weekday, month, day, year] = formatDateParts(date, {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    
      return `${weekday}, ${month} ${day}, ${year}`;
    }, [date]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginBottom={1}>
      <Typography variant="h4"
        sx={{
          background: '#FE6B8B',
          color: 'white',
          webkitBackgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          borderBottom: '2px solid #FF8E53',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          padding: '.5em 2em .5em 2em',
          fontWeight: 'bold',
          borderRadius: '5px',
          letterSpacing: '0.0075em',
          marginTop: '20px',
        }}
      >{formattedDate}</Typography>
    </Box>
  );
}

const PageTabs: React.FC<{ papers: Paper[] }> = ({ papers }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Table" />
        <Tab label="Grid" />
      </Tabs>
      <Box>
        <SearchAndActions showingTable={tabValue === 0}/>
        {tabValue === 0 && <PapersTable papers={papers} />}
        {tabValue === 1 && <VideoPapersGrid papers={papers} />}
      </Box>
    </Box>
  );
}

const Empty: React.FC<{ day: string }> = ({ day }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={20}>
      <EmptyState day={day}/>
    </Box>
  );
}

export default Day;
