import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Button, Box, Accordion, AccordionSummary, AccordionDetails, Typography, Divider, Tab, Tabs } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './search.css';
import { resetFieldsAtom, resultListAtom, searchStateAtom, submitSearchAtom, tabValueAtom } from './store';
import PageLayout from '~/shared/components/layout/page-layout';
import PageMessage from '~/shared/components/page-message';
import ThumbPapersGrid from '~/date-entry/components/grid';
import PapersTable from '~/date-entry/components/table';
import QueryControl from './controls/query';
import BasicCriteriaControl from './controls/basic-criteria';
import DateRangeControl from './controls/date-range';
import StateControl from './controls/state';
import { updatePaperInListAtom } from '~/shared/store';

const SearchPage: React.FC<{}> = () => {
  const resetFields = useSetAtom(resetFieldsAtom);
  const submitSearch = useSetAtom(submitSearchAtom);
  const queryParams = new URLSearchParams(location.search);
  const queryParam = queryParams.get('query');

  useEffect(() => {
    if (queryParam) {
      submitSearch({ query: queryParam, queryField: 'all'});
    }
  }, [queryParam]);

  return (
    <PageLayout padding={3}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
          style={{ margin: '0 15em 1em 15em' }}
        >
        <QueryControl />
      </Box>

      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{backgroundColor: 'rgb(30 32 34)'}}>
          <Typography>Advanced</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ margin: '0 0 2rem 2rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <BasicCriteriaControl/>

            <Divider orientation="vertical" flexItem />

            <DateRangeControl />

            <Divider orientation="vertical" flexItem />

            <StateControl />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: "space-between", minWidth: 200, placeSelf: 'center', marginTop: 2  }}>
      {/* <Box sx={{ display: 'flex', justifyContent: "space-between", minWidth: 420, placeSelf: 'center', marginTop: 2  }}> */}
        <Button variant="contained" color='success' onClick={() => submitSearch()}>Search</Button>
        <Button variant="contained" color="warning" onClick={resetFields}>Reset</Button>
        {/* <Button variant="contained" color="secondary">Clear Results</Button> */}
      </Box>

      <Divider sx={{ width: '100%', my: 2, marginTop: 4 }} />

      {/* <Typography sx={{ width: '100%', mx: 2,  marginBottom: 2 }}>Results</Typography> */}

      <RenderByState />

    </PageLayout>
  );
}

const RenderByState = () => {
  const [searchState] = useAtom(searchStateAtom);
  // const searchState = 'loading';

  switch (searchState) {
    case 'pending':
      return <PageMessage message={'Define search criteria then press search ...'}/>;
    case 'loading':
      return <Results isLoading={true} />;
    case 'complete':
      return <Results />;
    case 'empty':
      return <PageMessage message={'No papers found'}/>;
    case 'error':
      return <PageMessage message={'Error occurred while fetching papers'}/>;
  }
}

const Results = ({ isLoading = false }) => {
  const [tabValue, setTabValue] = useAtom(tabValueAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: 0 | 1) => {
    setTabValue(newValue);
  };
  const [results] = useAtom(resultListAtom);
  const updatePaper = useSetAtom(updatePaperInListAtom);

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ papersListAtom: resultListAtom, id, field, newValue: value })
    }

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange} centered>
        <Tab label="Table" />
        <Tab label="Grid" />
      </Tabs>
      <Box>
        {tabValue === 0 && <PapersTable papers={results} isLoading={isLoading} placeholderRows={10}/>}
        {tabValue === 1 &&
          <Box sx={{ marginTop: 2 }}>
            <ThumbPapersGrid papers={results} isLoading={isLoading} placeholderRows={4}/>
          </Box>  
        }
      </Box>
    </Box>
  );
}

export default SearchPage;
