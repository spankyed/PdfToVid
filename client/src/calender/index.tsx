import React, { useContext, useEffect, useState } from 'react';
import Grid from './components/grid';
import { Box } from '@mui/material';
import './index.css';
import { useAtom } from 'jotai';
import { isOpenAtom } from './components/summary/store';

const height = 'calc(100vh - 65px)'

const Calender: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const handleScroll = () => {
    // Logic to close the summary popover on scroll
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box 
        sx={{ overflowY: 'auto', flexGrow: 1, height: height }}
        onScroll={handleScroll} // Add the onScroll event listener here
      >
        <Grid />
      </Box>
    </Box>
  );
}

export default Calender;
