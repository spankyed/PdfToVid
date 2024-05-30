import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, Divider, Typography, IconButton, Tooltip, Paper } from '@mui/material';

import './backfill.css';
import PageLayout from '~/shared/components/layout/page-layout';
import DateRange from './add-dates';
import BatchTable from './batch-scrape';
import { updateStatusAtom } from './batch-scrape/store';
import SocketListener from '~/shared/api/socket-listener';
import { addAlertAtom } from '~/shared/components/notification/store';
import dayjs from 'dayjs';
import { updateSidebarDataAtom } from '~/shared/components/layout/sidebar/dates/store';

const BackfillPage = () => {
  const queryParams = new URLSearchParams(location.search);
  const isNewUser = queryParams.get('isNewUser') === 'true'; // todo - use this to show a tutorial popover messages
  const updateStatus = useSetAtom(updateStatusAtom);
  const addAlert = useSetAtom(addAlertAtom);
  const updateSidebarData = useSetAtom(updateSidebarDataAtom);

  const handleDateStatusUpdate = ({ key, status: newStatus, data: papers }) => {
    updateStatus({ key, status: newStatus, count: papers?.length });

    if (key === 'batch' && newStatus === 'complete') {
      addAlert({ type: 'success', message: 'Batch scraping complete!', autoClose: true })
    } else if (newStatus === 'error') {
      const id = dayjs(key).format('MM/DD/YYYY')
      addAlert({ id, message: `There was a problem scraping papers for ${id}`, autoClose: true })
    }

    updateSidebarData({ key, status: newStatus, count: papers?.length});
  };
  return (
    <PageLayout padding={3}>
      <Paper
        sx={{ my: 4, width: '80rem', mx: 'auto'}}
        elevation={2}
        className='flex flex-col w-full p-12'>
        <DateRange />
        <BatchTable/>
      </Paper>

      {/* <Button variant="contained" color='success' onClick={()=>{}} style={{ width: '20rem', placeSelf: 'center' }}>
        Scrape Recommended
      </Button> */}

      <SocketListener eventName="date_status" handleEvent={handleDateStatusUpdate} id='batch-scrape'/>
    </PageLayout>
  );
}

export default BackfillPage;
