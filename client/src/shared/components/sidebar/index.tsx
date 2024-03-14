import React, { useContext, useEffect, useState} from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
// import { StoreContext } from '../index';
// import { StoreType } from '../shared/store';
import './index.css';
import { useAtom } from 'jotai';
// import { fetchSidebarDataAtom } from '~/shared/store';
import Dates from './dates/Dates';
import Search from './search/Search';

type PanelType = 'dates' | 'search';

const height = 'calc(100vh - 65px)'

const Sidebar: React.FC = () => {
  // const [, fetchData] = useAtom(fetchSidebarDataAtom);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const [inPanel, setPanel] = useState<PanelType>('dates');
  
  const handlePanelToggle = (view: PanelType) => {
    setPanel(view);
  };

  return (
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

  );
}

export default Sidebar;
