import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Button, Grid, TextField } from '@mui/material';
import { Paper, StoreType } from '~/shared/store';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '..';
import Thumbnail from '~/shared/components/Thumbnail';
import PapersTable from './PapersTable';
// import SearchIcon from '@mui/icons-material/Search';

const Day: React.FC<{}> = observer(() => {
  const store = useContext<StoreType>(StoreContext);
  const papers = store.dashboard.papersList[0]?.papers || [];
  const dayId = store.routing.params.get('dayId') ?? '';

  return (
    <Box padding={3} sx={{ marginTop: 3, margin: '0 auto', maxWidth: '90%' }}>
      <PageTitle date={dayId} />
      {
        papers.length
          ? <PageTabs papers={papers} />
          : <EmptyState />
      }
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

const SearchAndActions: React.FC<{ showingTable: boolean }> = ({ showingTable }) => {
  return (
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
      style={{ 
        marginTop: '2em', 
        marginBottom: '2em', 
        marginRight: showingTable ? '2em' : '6em',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <TextField label="Search" variant="outlined" fullWidth />
      </Box>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button variant="contained" color='warning'>Restore All</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success">Generate All</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary">Upload All</Button>
        </Grid>
        {
          showingTable && (
            <Grid item>
              <Button variant="contained">Select</Button>
            </Grid>
          )
        }
      </Grid>
    </Box>
  );
}

const VideoPapersGrid: React.FC<{ papers: Paper[] }> = ({ papers }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.6em', // This will create spacing between items
    }}>
      {papers.map((paper, index) => (
        <div key={index} style={{
        }}>
          <Thumbnail paper={paper} shadow={true}/>
        </div>
      ))}
    </div>
  );
}

const EmptyState: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={20}>
      <Typography variant="h3">No Papers Processed</Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary">Full auto</Button>
        <Button variant="contained" color="secondary">Scrape & generate</Button>
        <Button variant="outlined">Just Scrape</Button>
      </Box>
    </Box>
  );
}

export default Day;
