import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Grid, Card, CardMedia, CardActions, TextField, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArticleIcon from '@mui/icons-material/Article';
import { Paper, StoreType } from '~/shared/store';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '..';
// import SearchIcon from '@mui/icons-material/Search';

const statuses = {
  0: {
    label: 'discarded',
    color: 'error',
    action: 'Discard',
    icon: <AutorenewIcon color="error" />
  },
  1: {
    label: 'scraped',
    color: undefined,
    action: 'Generate',
    icon: <ArticleIcon color="success" />
  },
  2: {
    label: 'generated',
    color: 'success',
    action: 'Upload',
    icon: <CloudUploadIcon color="secondary" />
  },
  3: {
    label: 'uploaded',
    color: 'secondary',
    action: 'View',
    icon: null
  },
}

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
    <Box display="flex" flexDirection="column" alignItems="center" marginBottom={0}>
      {/* <Typography variant="subtitle1">{weekday}</Typography> */}
      <Typography variant="h4">{formattedDate}</Typography>
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
        <SearchAndActions/>
        {tabValue === 0 && <PapersTable papers={papers} />}
        {tabValue === 1 && <VideoPapersGrid papers={papers} />}
      </Box>
    </Box>
  );
}

const SearchAndActions: React.FC = () => {
  return (
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
      style={{ marginTop: '2em', marginBottom: '2em', marginRight: '2em' }}
    >
      <Box sx={{ width: '100%' }}>
        <TextField label="Search" variant="outlined" fullWidth />
      </Box>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button variant="contained" color="error">Restore</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="success">Generate All</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary">Upload All</Button>
        </Grid>
        <Grid item>
          <Button variant="contained">Select</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

const PapersTable: React.FC<{ papers: Paper[] }> = ({ papers }) => {
  function getColorShade(value: number): string {
    const greenRGB = [0, 255, 0];
    const yellowRGB = [255, 255, 0];
    const redRGB = [255, 0, 0];
  
    const interpolateRGB = (start: number[], end: number[], t: number): number[] =>
      start.map((channel, i) => Math.round(channel + t * (end[i] - channel)));

    const colorRGB = value <= 0.5
      ? interpolateRGB(redRGB, yellowRGB, value * 2) // Flip start and end colors
      : interpolateRGB(yellowRGB, greenRGB, (value - 0.5) * 2); // Flip start and end colors
  
    return `rgb(${colorRGB.join(', ')})`;
  }

  const statusFrom = (paper: Paper) => statuses[paper.metaData.status]
  
  return (
    <TableContainer sx={{ marginTop: 3, margin: '0 auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Paper Title</TableCell>
            <TableCell align="center">Relevancy</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right" style={{ paddingRight: '9em' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {papers.map((paper, index) => (
            <TableRow key={index}>
              <TableCell 
                align="left" 
                sx={{ 
                  fontSize: '1.075rem', padding: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }
                }}
              >
                <Link 
                  to={`/entry/${1}`} 
                  style={{ 
                    display: 'block', 
                    padding: '1em', 
                    textDecoration: 'none', 
                    color: 'inherit', 
                  }}

                >
                  {paper.title}
                </Link>
              </TableCell>
              <TableCell align="center">
                <div
                  title={`${paper.metaData.relevancy * 100}%`}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: getColorShade(paper.metaData.relevancy),
                    display: 'inline-block',
                    border: '1px solid black',
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={statusFrom(paper).label} 
                  color={statusFrom(paper).color} 
                  title={statusFrom(paper).title}
                />
              </TableCell>
              <TableCell align="right">
                <Button title={`${statusFrom(paper).action}`}>
                  {statusFrom(paper).icon}
                </Button>
                <Button title='View'>
                  <VisibilityIcon color="primary" style={{ marginRight: '4px' }} />
                </Button>
                <Button title='Like'>
                  <FavoriteIcon color="error" />
                  {/* <FavoriteBorderIcon color="action" style={{ marginRight: '8px' }} /> */}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const VideoPapersGrid: React.FC<{ papers: Paper[] }> = ({ papers }) => {
  return (
    <Grid container spacing={2} sx={{marginTop: 3}}>
      {papers.map((paper, index) => (
        <Grid item xs={2} key={index}>
          <Card>
            {/* <Link to={`/entry/${paper.id}`} style={{ textDecoration: 'none' }}> */}
            <Link to={`/entry/${1}`} style={{ textDecoration: 'none' }}>
              <CardMedia
                component="img"
                height="140"
                image={paper.video.thumbnailUrl || 'https://picsum.photos/200/300'}
                alt="Video thumbnail"
              />
            </Link>
            <CardActions>
              <Button size="small" color="primary" title='Upload'>Upload</Button>
              <Button size="small" color="secondary" title='View'>View</Button>
              <Button size="small" color="error" title='Discard'>Discard</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
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
