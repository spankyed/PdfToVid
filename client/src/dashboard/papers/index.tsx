import React, { useCallback, useContext, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { papersListAtom } from '../../shared/state';
import PapersList from './list';

function Papers(): React.ReactElement {
  // const store = useContext<StoreType>(StoreContext);
  // const { state, papersList, selectedDay, selectDay} = store.dashboard;

  const [papersList] = useAtom(papersListAtom);

  // const is = a => b => a === b;
  const noData = papersList.length === 0;
  
  return (
    <>
      { noData 
        ? <NoData />
        : <PapersList papersList={papersList} />
      }
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
