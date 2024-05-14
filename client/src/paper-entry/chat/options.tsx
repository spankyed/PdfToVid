import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Typography } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { threadAtom, modelAtom } from './store';

export default function ChatOptions() {
  // todo add new thread option to dropdown, adds an empty thread

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
  const [thread, setThread] = useAtom(threadAtom);
  const [threadOptions, setThreadOptions] = useState([
    { name: 'Main thread', id: `1` },
    // { name: 'Can you write a...', id: `2` },
  ]);

  const handleAddThread = () => {
    const newThreadName = {
      name: `Thread ${threadOptions.length + 1}`,
      id: `${threadOptions.length + 1}`,
    };
    setThreadOptions([...threadOptions, newThreadName]);
    setThread(newThreadName.id);
  };

  return (
    <Box flex={1} pl={3} sx={{ display: 'flex', width: '40rem', justifyContent: 'space-between' }}>
      <FormControl  sx={{ width: '20rem' }}>
        <InputLabel id="thread-select-label">Thread</InputLabel>
        <Select
          labelId="thread-select-label"
          value={thread || `${threadOptions.length}`}
          label="Thread"
          onChange={(e) => setThread(e.target.value)}
          startAdornment={<AltRouteIcon sx={{ mr: 1 }} />}
        >
          {
            threadOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
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
