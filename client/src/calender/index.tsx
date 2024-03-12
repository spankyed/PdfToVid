import React, { useContext, useEffect, useState} from 'react';
import Dates from './sidebar/dates/Dates';
import Papers from './main';
import Search from './sidebar/search/Search';
import { Box, Button, ButtonGroup } from '@mui/material';
// import { StoreContext } from '../index';
// import { StoreType } from '../shared/store';
import './index.css';
import { useAtom } from 'jotai';
import { fetchCalenderDataAtom } from '~/shared/state';
import { isOpenAtom } from './main/summary/store';

type PanelType = 'dates' | 'search';

const height = 'calc(100vh - 65px)'

const Calender: React.FC = () => {
  const [, fetchData] = useAtom(fetchCalenderDataAtom);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [inPanel, setPanel] = useState<PanelType>('dates');
  
  const handlePanelToggle = (view: PanelType) => {
    setPanel(view);
  };

  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  // Define a function to handle the scroll event
  const handleScroll = () => {
    // Logic to close the popover
    if (isOpen) {
      setIsOpen(false);
    }
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{  height: height, width: '13vw', borderRight: '1px solid rgba(0, 0, 0, 0.3)' }}>
        <ButtonGroup  variant="contained" aria-label="outlined primary button group" sx={{ width: '100%', height: '5%'}}>
          <Button 
            onClick={() => handlePanelToggle('dates')} 
            sx={{ width: '50%', borderRadius: 0, boxShadow: 'none', 
              // background: 'linear-gradient(to bottom, #1976d2, #628fcf)' 
            }}
          >
            Dates
          </Button>
          <Button 
            onClick={() => handlePanelToggle('search')} 
            sx={{ width: '50%', borderRadius: 0, boxShadow: 'none', 
              // background: 'linear-gradient(to bottom, #1976d2, #628fcf)' 
            }}
          >
            Search
          </Button>
        </ButtonGroup>
        <Box sx={{ maxHeight: '95%', overflow: 'auto', position: 'relative' }}>
          {
            inPanel === 'dates' 
              ? <Dates /> 
              : <Search />
          }
        </Box>
      </Box>
      <Box 
        sx={{ overflowY: 'auto', flexGrow: 1, height: height }}
        onScroll={handleScroll} // Add the onScroll event listener here
      >
        <Papers />
      </Box>
    </Box>
  );
}

export default Calender;
