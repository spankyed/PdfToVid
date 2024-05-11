import React from 'react';
import { useAtom } from 'jotai';
import { Box, Select, MenuItem } from '@mui/material';
import { docAtom } from './store';

export default function DocumentSection() {
  const [doc, setDoc] = useAtom(docAtom);

  // todo read more button, should open pdf modal

  return (
    <Box p={2}>
      <h1>{doc.title}</h1>
      <p>{doc.description}</p>
      <Select
        value={doc.viewMode}
        onChange={(e) => setDoc({...doc, viewMode: e.target.value})}
      >
        <MenuItem value="full">Full</MenuItem>
        <MenuItem value="summary">Summary</MenuItem>
      </Select>
    </Box>
  );
};
