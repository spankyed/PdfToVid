import React, { useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Paper, Typography } from '@mui/material';
import { modelAtom } from './store';
import ThreadOptions from './threads';

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
          disabled={true}
          labelId="model-select-label"
          value={model}
          label="Model"
          onChange={(e) => setModel(e.target.value)}
        >
          <MenuItem value="gpt-4o">GPT-4o</MenuItem>
          <MenuItem value="claude-sonnet">Claude Sonnet</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
