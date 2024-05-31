import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Typography } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { threadOptionsAtom, selectedThreadsAtom, addNewThreadAtom, selectAndLoadMessagesAtom } from './store';
import { paperAtom } from '~/paper-entry/store';
import { truncateText } from '~/shared/utils/truncateText';
import { colors } from '~/shared/styles/theme';
import { featureDisabledAlertAtom } from '~/shared/components/notification/store';


export default function ThreadOptions(){
  const paper = useAtomValue(paperAtom);
  // const selectedThreads = useAtomValue(selectedThreadsAtom);
  // const selectAndLoadMessages = useSetAtom(selectAndLoadMessagesAtom);
  // const addNewThread = useSetAtom(addNewThreadAtom);
  const threadOptions = useAtomValue(threadOptionsAtom);
  const featureDisabledAlert = useSetAtom(featureDisabledAlertAtom);

  // const selectedThread = 0;

  const handleAddThread = async () => {
    featureDisabledAlert();
  };

  const select = (e) => {
    const thread = threadOptions.find(option => option.id === e.target.value)
    if (!paper?.id || !e.target.value || !thread){
      return
    }
    featureDisabledAlert();
  }

  return (
    <Box flex={1} pl={3} sx={{ display: 'flex', width: '40rem', justifyContent: 'space-between' }}>
      <FormControl color='secondary' sx={{ width: '20rem' }}>
        <InputLabel
          id="thread-select-label"
          sx={{ color: '#9e9e9e !important' }}
        >
          Thread
        </InputLabel>
        <Select
          disabled={true}
          labelId="thread-select-label"
          value={0}
          label="Thread"
          onChange={select}
          startAdornment={<AltRouteIcon sx={{ mr: 1 }} />}
        >
          {
            threadOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                { option.description.length > 25
                  ? truncateText(25, option.description) + '...'
                  : option.description
                }
                {option.duplicateNumber ? ` [${option.duplicateNumber}]` : ''}
              </MenuItem>
            ))
          }
          <Button
            variant='contained'
            // color='primary'
            color='secondary'
            onClick={handleAddThread}
            sx={{
              width: '100%', mb: -.9,
              borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
              borderBottom: `3px solid rgba(0, 0, 0, 0.3 )`,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
            }}>
            Start new thread
          </Button>
          {/* <Button
            onClick={deleteCurrentThread}
            sx={{ width: '100%', color: 'red' }}>
            Delete current thread
          </Button> */}
        </Select>
      </FormControl>
    </Box>
  )
}
