import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Button, Grid, TextField, CircularProgress, LinearProgress, Badge, styled } from '@mui/material';
// import { Paper, StoreType } from '~/shared/store';
// import { StoreContext } from '..';
import PapersTable from './components/table';
import Scraping from '~/shared/components/scraping';
import EmptyState from '~/shared/components/empty/empty';
import VideoPapersGrid from './components/grid';
import SearchAndActions from './components/search-actions';
import { Paper } from '~/shared/utils/types';
import { useAtom } from 'jotai';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom'; // Import useParams
import { formatDateParts } from '~/shared/utils/dateFormatter';
import { getColorShade } from '~/shared/utils/getColorShade';
import { datePageStateAtom, fetchPapersByDateAtom } from './store';

const ScoreBadge = styled(Badge)<{ count: number }>(({ theme, count }) => ({
  '& .MuiBadge-badge': {
    top: 8,
    right: '100%',
    transform: 'translateX(50%)',
    backgroundColor: getColorShade(count / 90),
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
}));

function DateEntryPage(): React.ReactElement {
  let { dateId } = useParams<{ dateId: string }>();
  dateId = dateId || '';

  const [, fetchData] = useAtom(fetchPapersByDateAtom);
  const [datePage] = useAtom(datePageStateAtom);

  useEffect(() => {
    fetchData(dateId);
  }, [fetchData]);
  
  const { papers, state } = datePage;
  // const { papers, state } = { state: 'complete', papers: [] as Paper[]};

  const componentsByState = {
    'pending': <Empty date={dateId}/>,
    'scraping': <div style={{paddingTop: '5em'}}><Scraping /></div>,
    'ranking': <div style={{paddingTop: '5em'}}>Ranking...</div>,
    'complete': <PageTabs papers={papers} />,
  }

  return (
    <Box padding={3} sx={{ marginTop: 3, margin: '0 auto', maxWidth: '90%' }}>
      <PageTitle date={dateId} count={papers.length} />
      {componentsByState[state]}
    </Box>
  );
}

const PageTitle: React.FC<{ date: string, count: number }> = ({ date, count }) => {
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
      <ScoreBadge 
        badgeContent={`${count}`} 
        count={count}
      >

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
        >
          {formattedDate}
        </Typography>
      </ScoreBadge>
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

const Empty: React.FC<{ date: string }> = ({ date }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={20}>
      <EmptyState date={date}/>
    </Box>
  );
}

export default DateEntryPage;
