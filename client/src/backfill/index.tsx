import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, Divider } from '@mui/material';

import './backfill.css';
import PageLayout from '~/shared/components/layout/page-layout';
import DateRange from './components/date-range';
import BatchControls from './components/batch';
import ResultsTable from './components/results-table';


const BackfillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  console.log('queryParams: ', queryParams);
  const isNewUser = queryParams.get('isNewUser') === 'true';
  console.log('isNewUser: ', isNewUser);

  return (
    <PageLayout padding={3}>

      <div className='flex row w-full justify-between'>
        <div className='flex column'>
          <BatchControls />
          <Button variant="contained" color='success'>Scrape Batch</Button>
        </div>

        <Divider orientation="vertical" flexItem />

        <DateRange />

      </div>

      <ResultsTable/>
      {/* <div className=''></div> */}
    </PageLayout>
  );
}


export default BackfillPage;
