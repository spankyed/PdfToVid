// import React, { useContext } from 'react';
// import { StoreContext } from '../index';

// function Dashboard() {
//   const store = useContext(StoreContext);

//   // Now we can use the store in our component
//   // ...

//   return (
//     // ...
//   );
// }
// src/pages/Dashboard.tsx

import React from 'react';
import { Grid } from '@material-ui/core';
import DateList from '../components/DateList';
import PaperList from '../components/PaperList';
import SearchPanel from '../components/SearchPanel';

const Dashboard: React.FC = () => {
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

