import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, Divider, Typography, IconButton, Tooltip, Paper } from '@mui/material';

import './backfill.css';
import PageLayout from '~/shared/components/layout/page-layout';
import DateRange from './add-dates';
import BatchTable from './batch-scrape';

const BackfillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  const isNewUser = queryParams.get('isNewUser') === 'true'; // todo - use this to show a tutorial popover messages

  return (
    <PageLayout padding={3}>
      <Box sx={{ my: 4, width: '80rem', mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Paper elevation={2} className='flex row w-full justify-between p-12' style={{ backgroundColor: '#fff' }}>
          <DateRange />

          <Divider orientation="vertical" flexItem />

          <BatchTable/>
        </Paper>

        <Button variant="contained" color='success' onClick={()=>{}} style={{ width: '20rem', placeSelf: 'center' }}>
          Scrape Recommended
        </Button>
      </Box>
    </PageLayout>
  );
}

export default BackfillPage;
