import React, { useContext, useEffect } from 'react';
import DateList from './DateList';
import PaperList from './PaperList';
import SearchPanel from './SearchPanel';
import { Grid } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

const Dashboard: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);

  useEffect(() => {
    store.fetchPapers();
  }, [store]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <DateList />
      </Grid>
      <Grid item xs={6}>
        <PaperList />
      </Grid>
      <Grid item xs={3}>
        <SearchPanel />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
