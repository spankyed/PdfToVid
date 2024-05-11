import React from 'react';
import { useAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Typography } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { threadAtom, modelAtom } from './store';

export default function ChatOptions() {
  // todo add new thread option to dropdown, adds an empty thread

  return (
    // <Box display="flex" justifyContent="space-between" p={2}>
    // <Box sx={{ my: 4, width: '80rem', mx: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    <Paper elevation={2} className='flex row w-full px-12 py-6' style={{ backgroundColor: '#fff' }}>
      <ModelOptions/>
      <ThreadOptions />
    </Paper>
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

  return (
    <Box flex={1} pl={3} sx={{ display: 'flex', width: '40rem', justifyContent: 'space-between' }}>
      <FormControl  sx={{ width: '20rem' }}>
        <InputLabel id="thread-select-label">Thread</InputLabel>
        <Select
          labelId="thread-select-label"
          value={thread}
          label="Thread"
          onChange={(e) => setThread(e.target.value)}
          startAdornment={<AltRouteIcon sx={{ mr: 1 }} />}
        >
          <MenuItem value="Thread 1">Main thread</MenuItem>
          <MenuItem value="Thread 2">Can you write a...</MenuItem>
        </Select>
      </FormControl>

      {/* <Box sx={{ display: 'flex', height: '3rem' }}>
        <Button variant="outlined">Summarize</Button>
        <Button variant="outlined" sx={{ ml: '1rem'}}>Hide</Button>
      </Box> */}
    </Box>
  )
}
