import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { LearnTab } from './prompts';
import { ReviewTab } from './review';

const EntryTabs: React.FC<{ entry: any }> = ({ entry }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Generate" />
        <Tab label="Prompts" />
        <Tab label="Analytics" />
        {/* instead of integrate as separate tab, consider having in review section under meta */}
      </Tabs>
      {tabValue === 0 && <ReviewTab entry={entry} />}
      {tabValue === 1 && <LearnTab entry={entry} />}  {/* prompts*/}
      {tabValue === 2 && <div>empty</div>}
    </Box>
  );
}

export default EntryTabs;
