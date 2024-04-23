import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, Divider, Typography, IconButton, Tooltip } from '@mui/material';

import './backfill.css';
import PageLayout from '~/shared/components/layout/page-layout';
import DateRange from './components/date-range';
import BatchControls from './components/batch';
import ResultsTable from './components/calender';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CalendarComponent from './components/calender';

const BatchScrapeButton = () => {
  const info = `We recommend scraping papers in batches of 20 days. Then take the opportunity to review those papers, starring papers you find interesting.
  It is also good to occasionally unfavorite papers you find less interesting than the latest papers you might’ve seen.`
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}> {/* Ensure button and icon are aligned */}
    <Button variant="contained" color="warning" onClick={() => {}}>
      <Tooltip title={info}>
        <HelpOutlineIcon sx={{ mr: 1}}/>
      </Tooltip>
      Scrape Batch
    </Button>

  </div>
  );
};

const BackfillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  console.log('queryParams: ', queryParams);
  const isNewUser = queryParams.get('isNewUser') === 'true';
  console.log('isNewUser: ', isNewUser);

  return (
    <PageLayout padding={3}>

      <Box sx={{ my: 4, width: '80rem', mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        <Button
          variant="contained" color='success' onClick={()=>{}} style={{ width: '20rem', placeSelf: 'center' }}
        >
          Scrape Recommended
        </Button>


        <div className='flex row w-full justify-between p-12' style={{ backgroundColor: '#fff' }}>

          <div style={{ width: '25%' }}>
            <DateRange />
            <Button variant="contained" color="success" onClick={()=>{}}>Add Dates</Button>

          </div>
          <Divider orientation="vertical" flexItem />

          <div style={{ width: '55%' }}>
            {/* <Button variant="contained" color='success'>Scrape Batch</Button> */}

            <Box sx={{ display: 'flex', justifyContent: 'end', minWidth: 200, placeSelf: 'center', marginTop: 2  }}>
            {/* <Box sx={{ display: 'flex', justifyContent: "space-between", minWidth: 420, placeSelf: 'center', marginTop: 2  }}> */}
              <BatchScrapeButton/>
              {/* <Button variant="contained" color="secondary">Clear Results</Button> */}
            </Box>
            <BatchControls />
          </div>



        </div>

        {/* <ResultsTable/> */}
        {/* <div className=''></div> */}

        {/* <CalendarComponent selectedDays={[]} /> */}
      </Box>
    </PageLayout>
  );
}

export default BackfillPage;
