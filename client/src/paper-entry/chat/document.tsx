import React from 'react';
import { useAtom } from 'jotai';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import { docAtom } from './store';

export default function DocumentSection() {
  const [doc, setDoc] = useAtom(docAtom);

  // todo read more button, should open pdf modal

  return (
    <Box p={2} className='bg-slate-100'>
      <div className='flex justify-between'>
        <Typography variant="h6">{doc.title}</Typography>
        <Select
          sx={{ ml: 2, height: '2rem', mb: 1 }}
          size="small"
          variant='standard'
          value={doc.viewMode}
          onChange={(e) => setDoc({...doc, viewMode: e.target.value})}
        >
          <MenuItem value="full">Whole document</MenuItem>
          <MenuItem value="summary">Summary only</MenuItem>
        </Select>
      </div>

      <p>{doc.description}</p>
    </Box>
  );
};
