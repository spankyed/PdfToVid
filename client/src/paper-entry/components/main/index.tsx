import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { LearnTab } from './prompts';
import { ContentTab } from './content';
import { useAtom, useAtomValue } from 'jotai';
import { paperAtom } from '~/paper-entry/store';



const MainSection = () => {
  const paper = useAtomValue(paperAtom);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Prompts" />
        <Tab label="Generate" />
        {/* <Tab label="Analytics" /> */}
        {/* todo add "Integrate" tab to apply and implement research into projects */}
      </Tabs>
      {tabValue === 0 && <LearnTab />}  {/* prompts*/}
      {tabValue === 1 && <ContentTab />}
      {/* {tabValue === 2 && <div>empty</div>} */}
    </Box>
  );
}

export default MainSection;
