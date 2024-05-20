import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Typography } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { threadOptionsAtom, selectedThreadsAtom, modelAtom, addNewThreadAtom, selectAndLoadMessagesAtom } from './store';
import { paperAtom } from '../store';

export default function ChatOptions() {
  return (
    // <Box display="flex" justifyContent="space-between" p={2}>
    // <Box sx={{ my: 4, width: '80rem', mx: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    <div className='flex row w-full pt-6 pl-3 pb-3 bg-slate-100'>
      <ModelOptions/>
      <ThreadOptions />
    </div>
  );
};

function ModelOptions(){
  const [model, setModel] = useAtom(modelAtom);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl sx={{ width: '10rem' }}>
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          value={model}
          label="Model"
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value="Claude">Claude</MenuItem>
          <MenuItem value="GPT-4">GPT-4</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
function ThreadOptions(){
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
    console.log('e.target.value: ', e.target.value);
    if (!paper?.id || !e.target.value){
      return
    }
    selectAndLoadMessages(paper!.id, e.target.value);
  }

  return (
    <Box flex={1} pl={3} sx={{ display: 'flex', width: '40rem', justifyContent: 'space-between' }}>
      <FormControl  sx={{ width: '20rem' }}>
        <InputLabel id="thread-select-label">Thread</InputLabel>
        <Select
          labelId="thread-select-label"
          value={selectedThread || ''}
          label="Thread"
          onChange={select}
          startAdornment={<AltRouteIcon sx={{ mr: 1 }} />}
        >
          {
            threadOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>{option.description}</MenuItem>
            ))
          }
          <Button
            onClick={handleAddThread}
            sx={{ width: '100%' }}>
            Start new thread
          </Button>
        </Select>
      </FormControl>
    </Box>
  )
}
