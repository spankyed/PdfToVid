import React, { useContext, useEffect } from 'react';
import DateList from './DateList';
import PaperList from './PaperList';
import Search from './SearchPanel';
import { Box } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

const Dashboard: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);

  useEffect(() => {
    store.fetchPapers();
    // Set the overflow property of the body to hidden to remove the page scroll
  }, [store]);

  return (
    <>
      <Box sx={{ position: 'fixed', top: 0, height: '100vh', overflowY: 'auto', maxWidth: '25vw' }}>
        <Box sx={{ position: 'sticky', top: 0 }}>
          <DateList />
        </Box>
        <Search />
      </Box>
      <Box sx={{ marginLeft: '25vw', overflowY: 'auto', minWidth: '60vw', height: '100vh' }}>
        <PaperList />
      </Box>
    </>
  );
}

export default Dashboard;
