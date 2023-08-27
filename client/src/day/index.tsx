import React, { useContext, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Button, Grid, TextField, CircularProgress, LinearProgress } from '@mui/material';
import { Paper, StoreType } from '~/shared/store';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '..';
import PapersTable from './PapersTable';
import Scraping from '~/shared/components/Scraping';
import EmptyState from '~/shared/components/Empty';
import VideoPapersGrid from './VideosGrid';
import SearchAndActions from './SearchActions';
// import SearchIcon from '@mui/icons-material/Search';

const Day: React.FC<{}> = observer(() => {
  const store = useContext<StoreType>(StoreContext);
  const dayId = store.routing.params.get('dayId') ?? '';
  
  // todo current day state and scrape papers for day
  const papers = store.dashboard.papersList[0]?.papers || [];
  // const state = store.dashboard.papersList[0]?.state || 'scraping';
  const state = 'scraping';

  const componentsByState = {
    'pending': <Empty day={dayId}/>,
    'scraping': <Scraping />,
    'complete': <PageTabs papers={papers} />,
  }

  return (
    <Box padding={3} sx={{ marginTop: 3, margin: '0 auto', maxWidth: '90%' }}>
      <PageTitle date={dayId} />
      {componentsByState[state]}
    </Box>
  );
})

const PageTitle: React.FC<{ date: string }> = ({ date }) => {
  // const [formattedDate, weekday] = useMemo(() => {
  const formattedDate = useMemo(() => {
    const dateObj = new Date(date);
    const formatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    });

    const [dayName, month, day, year] = formatted.replaceAll(',', '') .split(' ');
    // return [`${dayName}, ${month} ${day}, ${year}`, dayName];
    return `${dayName}, ${month} ${day}, ${year}`;
  }, [date]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginBottom={0}
>
      {/* <Typography variant="subtitle1">{weekday}</Typography> */}
      <Typography variant="h4"
        sx={{
          borderBottom: '2px solid black',
          padding: '0 2em .5em 2em',
        }}
      >{formattedDate}</Typography>
      {/* <Typography variant="h6">{weekday}</Typography> */}
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
        <Tab label="Papers" />
        <Tab label="Videos" />
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
