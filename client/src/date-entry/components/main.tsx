import React, { useMemo, useState } from 'react';
import { Typography, Tabs, Tab, Box, Badge, styled } from '@mui/material';
import ThumbPapersGrid from './grid';
import SearchAndActions from './search-actions';
import PapersTable from './table';
import { Paper } from '~/shared/utils/types';
import { tabValueAtom } from '../store';
import { useAtom } from 'jotai';

const MainTabs: React.FC<{ papers?: Paper[]; isLoading?: boolean }> = ({ papers = [], isLoading = false }) => {
  const [tabValue, setTabValue] = useAtom(tabValueAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Table" />
        <Tab label="Grid" />
      </Tabs>
      <Box>
        <SearchAndActions showingTable={tabValue === 0}/>
        {tabValue === 0 && <PapersTable papers={papers} isLoading={isLoading}/>}
        {tabValue === 1 && <ThumbPapersGrid papers={papers} isLoading={isLoading}/>}
      </Box>
    </Box>
  );
}

export default MainTabs;
