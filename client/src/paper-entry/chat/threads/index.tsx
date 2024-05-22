import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Typography } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { threadOptionsAtom, selectedThreadsAtom, addNewThreadAtom, selectAndLoadMessagesAtom } from './store';
import { paperAtom } from '~/paper-entry/store';
import { truncateText } from '~/shared/utils/truncateText';


export default function ThreadOptions(){
  const paper = useAtomValue(paperAtom);
  const selectedThreads = useAtomValue(selectedThreadsAtom);
  const selectAndLoadMessages = useSetAtom(selectAndLoadMessagesAtom);
  const addNewThread = useSetAtom(addNewThreadAtom);
  const threadOptions = useAtomValue(threadOptionsAtom);

  const selectedThread = paper?.id && selectedThreads?.hasOwnProperty(paper?.id) ? selectedThreads[paper?.id] : null;

  const handleAddThread = async () => {
    addNewThread(paper!.id);
  };

  const select = (e) => {
    const thread = threadOptions.find(option => option.id === e.target.value)
    if (!paper?.id || !e.target.value || !thread){
      return
    }
    selectAndLoadMessages(paper!.id, thread);
  }

  return (
    <Box flex={1} pl={3} sx={{ display: 'flex', width: '40rem', justifyContent: 'space-between' }}>
      <FormControl  sx={{ width: '20rem' }}>
        <InputLabel id="thread-select-label">Thread</InputLabel>
        <Select
          labelId="thread-select-label"
          value={selectedThread?.id || ''}
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
            onClick={handleAddThread}
            sx={{ width: '100%' }}>
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
