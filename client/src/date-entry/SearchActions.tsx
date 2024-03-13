import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Button, Grid, TextField } from '@mui/material';
// import { Paper, StoreType } from '~/shared/store';
// import SearchIcon from '@mui/icons-material/Search';

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

export default SearchAndActions;
