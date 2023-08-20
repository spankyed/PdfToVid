import React, { useContext, useEffect, useState} from 'react';
import Dates from './Dates';
import Papers from './Papers';
import Search from './Search';
import { Box, Button, ButtonGroup } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

type PanelType = 'dates' | 'search';

const height = 'calc(100vh - 65px)'

const Dashboard: React.FC = () => {
  // ! this component is not using mobx-react-lite observer and is therefore not reactive
  const store = useContext<StoreType>(StoreContext);
  const { state, fetchDashboard, setState } = store.dashboard;

  if (state === "initial") {
    setState('loading');
    fetchDashboard();
  }

  const [inPanel, setPanel] = useState<PanelType>('dates');
  
  const handlePanelToggle = (view: PanelType) => {
    setPanel(view);
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
      <Box sx={{ overflowY: 'auto', flexGrow: 1, height: height }}>
        <Papers />
      </Box>
    </Box>
  );
}

export default Dashboard;
