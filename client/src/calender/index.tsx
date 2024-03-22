import React, { useContext, useEffect, useRef } from 'react';
import CalenderMain from './components/main';
import { Box } from '@mui/material';
import './calender.css';
import { useAtom } from 'jotai';
import { isOpenAtom,  } from './components/summary/store';
import { scrollableContainerRefAtom } from './components/main/store';

const height = 'calc(100vh - 65px)'

const Calender: React.FC = () => {
  const [, setScrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollableContainerRef(containerRef);
  }, [setScrollableContainerRef]);


  const handleScroll = () => {
    // Logic to close the summary popover on scroll
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box 
        ref={containerRef}
        sx={{ overflowY: 'auto', flexGrow: 1, height: height }}
        onScroll={handleScroll} // Add the onScroll event listener here
      >
        <CalenderMain />
      </Box>
    </Box>
  );
}

export default Calender;
