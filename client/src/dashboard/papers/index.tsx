import React, { useCallback, useContext, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { papersListAtom } from '../../shared/state';
import Grid from './grid';

function Papers(): React.ReactElement {
  const [papersList] = useAtom(papersListAtom);

  const noData = papersList.length === 0;
  
  return (
    <>
      {/* { noData 
        ? <NoData />
        : <Grid papersList={papersList} />
      } */}
      <Grid papersList={papersList} />
    </>
  );
}

const NoData = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
      textAlign: 'center',
      color: 'grey.500'
    }}
  >
    <CircularProgress />
    <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
      Loading data...
    </Typography>
  </Box>
);

export default Papers;
