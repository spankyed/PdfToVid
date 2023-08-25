import React from 'react';
import { Typography, Box, CircularProgress, LinearProgress } from '@mui/material';


const Scraping: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3} marginTop={4}>
      <CircularProgress />
      <Typography variant="h3">Scrape</Typography>
      {/* <LinearProgress /> */}
    </Box>
  );
}

export default Scraping;
