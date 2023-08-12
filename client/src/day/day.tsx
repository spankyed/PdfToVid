import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Tabs, Tab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Grid, Card, CardMedia, CardActions, TextField } from '@mui/material';
// import moment from 'moment';


const Papers = [
  {
    id: '1',
    imgUrl: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    status: 'uploaded',
  },
  {
    id: '2',
    imgUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    status: 'discarded',
  },
  {
    id: '3',
    imgUrl: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    status: 'generated',
  },
]

const Videos = Papers

// DayTitle Component
const DayTitle: React.FC<{ date: string }> = ({ date }) => {
  // const formattedDate = moment(date).format('ddd, MMM D YYYY');
  const formattedDate = 'Mon, Jul 19 2023';
  return (
    <Box display="flex" justifyContent="center" marginBottom={3}>
      <Typography variant="h4">{formattedDate}</Typography>
    </Box>
  );
}

// PapersTable Component
const PapersTable: React.FC<{ papers: { name: string; status: string }[] }> = ({ papers }) => {
  return (
    <TableContainer sx={{marginTop: 3}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Paper Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {papers.map((paper, index) => (
            <TableRow key={index}>
              <TableCell>
                {/* <Link to={`/entry/${paper.id}`} style={{ textDecoration: 'none', color: 'inherit' }}> */}
                <Link to={`/entry/${1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {paper.title}
                </Link>
              </TableCell>
              <TableCell>{paper.status}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary">View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// VideosGrid Component
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
              <Button size="small" color="secondary">View Details</Button>
              <Button size="small" color="error">Discard</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// SearchAndActions Component
const SearchAndActions: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={2}>
        <TextField label="Search" variant="outlined" fullWidth />
        <Button variant="contained">Show All</Button>
      </Box>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="error">Restore</Button>
        <Button variant="contained" color="primary">Generate All</Button>
        <Button variant="contained" color="secondary">Upload All</Button>
      </Box>
    </Box>
  );
}

// DayTabs Component
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
      <Box marginTop={3}>
        <SearchAndActions />
        {tabValue === 0 && <PapersTable papers={papers} />}
        {tabValue === 1 && <VideosGrid videos={videos} />}
      </Box>
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



// DayDetails Page
const DayDetails: React.FC<{ date: string; papers: any[]; videos: any[] }> = ({ date, papers, videos }) => {
  return (
    <Box padding={3}>
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

export default DayDetails;


