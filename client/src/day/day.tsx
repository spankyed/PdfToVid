import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Grid, Card, CardMedia, CardActions, TextField } from '@mui/material';


interface DayTitleProps {
  date: string;
}

interface PapersTableProps {
  papers: {
    name: string;
    status: string;
  }[];
}

const Papers = [
  {
    id: '1',
    imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Testing GPT-4 with Wolfram Alpha and Code Interpreter plug-ins on math and science problems',
    status: 'uploaded',
  },
  {
    id: '2',
    imgUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Testing GPT-4 with Wolfram Alpha and Code Interpreter plug-ins on math and science problems',
    status: 'discarded',
  },
  {
    id: '3',
    imgUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Testing GPT-4 with Wolfram Alpha and Code Interpreter plug-ins on math and science problems',
    status: 'generated',
  },
]

const Videos = Papers

const DayDetails: React.FC<{ date: string; papers: any[]; videos: any[] }> = ({ date, papers, videos }) => {
  return (
    <Box padding={3} sx={{ marginTop: 3, margin: '0 auto', maxWidth: '90%' }}>
      <DayTitle date={date} />
      {
        // papers.length
        true
          ? <DayTabs papers={Papers} videos={Videos} />
          : <EmptyState />
      }
    </Box>
  );
}

const DayTabs: React.FC<{ papers: any[]; videos: any[] }> = ({ papers, videos }) => {
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
        {tabValue === 1 && <VideosGrid videos={videos} />}
      </Box>
    </Box>
  );
}

const DayTitle: React.FC<DayTitleProps> = ({ date }) => {
  const dt = '2021-10-19'

  // const [formattedDate, weekday] = useMemo(() => {
  const formattedDate = useMemo(() => {
    const dateObj = new Date(dt);
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


const PapersTable: React.FC<PapersTableProps> = ({ papers }) => {

  function getColorShade(value: number): string {
    const greenRGB = [0, 255, 0];
    const yellowRGB = [255, 255, 0];
    const redRGB = [255, 0, 0];

    const interpolateRGB = (start: number[], end: number[], t: number): number[] =>
      start.map((channel, i) => Math.round(channel + t * (end[i] - channel)));

    const colorRGB = value <= 0.5
      ? interpolateRGB(greenRGB, yellowRGB, value * 2)
      : interpolateRGB(yellowRGB, redRGB, (value - 0.5) * 2);

    return `rgb(${colorRGB.join(', ')})`;
  }

  return (
    <TableContainer sx={{ marginTop: 3, margin: '0 auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Paper Title</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Relevancy</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {papers.map((paper, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <Link to={`/entry/${1}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                  {/* <Typography variant="h6">{paper.title}</Typography> */}
                  {paper.title}
                </Link>
              </TableCell>
              <TableCell align="center">{paper.status}</TableCell>
              <TableCell align="center">
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: getColorShade(.5),
                    display: 'inline-block',
                    border: '1px solid black',
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const VideosGrid: React.FC<{ videos: { thumbnail: string }[] }> = ({ videos }) => {
  return (
    <Grid container spacing={2} sx={{marginTop: 3}}>
      {videos.map((video, index) => (
        <Grid item xs={2} key={index}>
          <Card>
            {/* <Link to={`/entry/${paper.id}`} style={{ textDecoration: 'none' }}> */}
            <Link to={`/entry/${1}`} style={{ textDecoration: 'none' }}>
              <CardMedia
                component="img"
                height="140"
                image={video.imgUrl}
                alt="Video thumbnail"
              />
            </Link>
            <CardActions>
              <Button size="small" color="primary">Upload</Button>
              <Button size="small" color="secondary">View</Button>
              <Button size="small" color="error">Discard</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

const SearchAndActions: React.FC = () => {
  return (
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
      style={{ marginTop: '2em', marginBottom: '2em' }}
    >
      <Box sx={{ width: '100%' }}>
        <TextField label="Search" variant="outlined" fullWidth />
      </Box>
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button variant="contained" color="error">Restore</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">Generate All</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary">Upload All</Button>
        </Grid>
        <Grid item>
          <Button variant="contained">Show All</Button>
        </Grid>
      </Grid>
    </Box>
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

export default DayDetails;
