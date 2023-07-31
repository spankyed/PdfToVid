import React, { useContext, useEffect, useState} from 'react';
import DateList from './DateList';
import PaperList from './PaperList';
import Search from './SearchPanel';
import { Box, Button, ButtonGroup } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

type PanelType = 'dates' | 'search';

const height = 'calc(100vh - 64px)'

const Dashboard: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);

  useEffect(() => {
    store.fetchPapers();
  }, [store]);

  const [inPanel, setPanel] = useState<PanelType>('dates');
  
  const handlePanelToggle = (view: PanelType) => {
    setPanel(view);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{  height: height, width: '10vw' }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ width: '100%'}}>
          <Button onClick={() => handlePanelToggle('dates')} sx={{ width: '50%', borderRadius: 0, boxShadow: 'none' }}>Dates</Button>
          <Button onClick={() => handlePanelToggle('search')} sx={{ width: '50%', borderRadius: 0, boxShadow: 'none' }}>Search</Button>
        </ButtonGroup>
        {
          inPanel === 'dates' ? <DateList /> : <Search />
        }
      </Box>
      <Box sx={{ overflowY: 'auto', flexGrow: 1, height: height }}>
        <PaperList />
      </Box>
    </Box>
  );
}

export default Dashboard;
