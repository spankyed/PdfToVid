import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Tabs, Tab, Box, Badge, styled } from '@mui/material';
import ThumbPapersGrid from './grid';
import SearchAndActions from './search-actions';
import PapersTable from './table';
import { Paper } from '~/shared/utils/types';
import { dateEntryPapersAtom, tabValueAtom } from '../store';
import { Atom, atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { emptyListAtom, updatePaperInListAtom } from "~/shared/store";
import TocIcon from '@mui/icons-material/Toc';
import AppsIcon from '@mui/icons-material/Apps';

const MainTabs: React.FC<{
  papersAtom?: Atom<Paper[]>;
  isLoading?: boolean;
  slideUp?: boolean;
}> = ({ papersAtom, isLoading = false, slideUp = false }) => {
  const [tabValue, setTabValue] = useAtom(tabValueAtom);
  const updatePaper = useSetAtom(updatePaperInListAtom);
  const papers = useAtomValue(papersAtom || emptyListAtom);

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

  const style = {} 

  return (
    <Box sx={style}>
      <div className="flex justify-between align-middle items-center">
        <SearchAndActions showingTable={tabValue === 0}/>
        <Tabs value={tabValue} onChange={handleChange} sx={{ height: '3rem' }}>
          <Tab label={<span><TocIcon/> </span>} />
          <Tab label={<span><AppsIcon/> </span>} />
        </Tabs>
      </div>
      {tabValue === 0 && <PapersTable papers={papers} isLoading={isLoading}/>}
      {tabValue === 1 && <ThumbPapersGrid papers={papers} isLoading={isLoading}/>}
    </Box>
  );
}

export default MainTabs;
