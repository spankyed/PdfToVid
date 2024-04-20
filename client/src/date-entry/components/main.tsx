import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Tabs, Tab, Box, Badge, styled } from '@mui/material';
import ThumbPapersGrid from './grid';
import SearchAndActions from './search-actions';
import PapersTable from './table';
import { Paper } from '~/shared/utils/types';
import { dateEntryPapersAtom, tabValueAtom } from '../store';
import { Atom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { emptyAtom, updatePaperInListAtom } from "~/shared/store";

const MainTabs: React.FC<{
  papersAtom?: Atom<Paper[]>;
  isLoading?: boolean;
  slideUp?: boolean;
}> = ({ papersAtom, isLoading = false, slideUp = false }) => {
  const [tabValue, setTabValue] = useAtom(tabValueAtom);
  const updatePaper = useSetAtom(updatePaperInListAtom);
  const papers = useAtomValue(papersAtom || emptyAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ papersListAtom: dateEntryPapersAtom, id, field, newValue: value })
    }

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);

  const style = slideUp ? { marginTop: -3 } : {} 

  return (
    <Box sx={style}>
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
