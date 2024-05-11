import React from 'react';
import { useAtom } from 'jotai';
import { Button, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { threadAtom, modelAtom, tokenUsageAtom } from './store';

export default function ChatHeader() {
  const [thread, setThread] = useAtom(threadAtom);
  const [model, setModel] = useAtom(modelAtom);
  const [tokenUsage] = useAtom(tokenUsageAtom);

  // todo add new thread option to dropdown, adds an empty thread

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box flex={1}>
        <FormControl fullWidth>
          <InputLabel id="thread-select-label">Thread</InputLabel>
          <Select
            labelId="thread-select-label"
            value={thread}
            label="Thread"
            onChange={(e) => setThread(e.target.value)}
            startAdornment={<AltRouteIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="Thread 1">Initial thread...</MenuItem>
            <MenuItem value="Thread 2">Can you write a...</MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button variant="outlined">Summarize</Button>
          <Button variant="outlined">Hide</Button>
        </Box>
      </Box>

      <Box flex={1}>
        <FormControl fullWidth>
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
        <Box mt={1}>Conversation uses {tokenUsage.current} / {tokenUsage.max} tokens</Box>
      </Box>
    </Box>
  );
};
