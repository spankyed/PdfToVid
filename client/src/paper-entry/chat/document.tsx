import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Box, Select, MenuItem, Typography } from '@mui/material';
import { docAtom } from './store';
import { paperAtom, pdfModalOpen } from '../store';

export default function DocumentSection() {
  // const [doc, setDoc] = useAtom(docAtom);
  const setPdfOpen = useSetAtom(pdfModalOpen);
  const [paper] = useAtom(paperAtom);

  // todo read more button, should open pdf modal

  const truncateText = (description?: string) => {
    if (!description) return ''
    return description.slice(0, 376)
  }

  return (
    <Box px={2} pb={2} className='bg-slate-100'>
      <div className='flex justify-between'>
        <Typography variant="h6">{paper?.title}</Typography>
        {/* <Select
          sx={{ ml: 2, height: '2rem', mb: 1, px: 2 }}
          name='document-view-mode'
          size="small"
          variant='standard'
          value={doc.viewMode}
          onChange={(e) => setDoc({...doc, viewMode: e.target.value})}
        >
          <MenuItem value="full">Whole document</MenuItem>
          <MenuItem value="summary">Summary only</MenuItem>
        </Select> */}
      </div>

      <p className='inline'>{truncateText(paper?.abstract)}...</p>
      {/* read more link */}
      <Typography
        variant="body2" color="textSecondary" sx={{ display: 'inline', ml: 1, cursor: 'pointer' }}
        onClick={() => setPdfOpen(true)}
        >
        Read more
      </Typography>
    </Box>
  );
};
