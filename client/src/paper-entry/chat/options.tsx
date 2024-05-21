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
