import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box } from '@mui/material';

import './backfill.css';
import PageLayout from '~/shared/components/layout/page-layout';
import DateRange from './components/date-range';
import BatchControls from './components/batch';


const BackfillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  console.log('queryParams: ', queryParams);
  const isNewUser = queryParams.get('isNewUser') === 'true';
  console.log('isNewUser: ', isNewUser);

  return (
    <PageLayout padding={3}>
      <Box>
        <DateRange />
        <BatchControls />
      </Box>
    </PageLayout>
  );
}


export default BackfillPage;
