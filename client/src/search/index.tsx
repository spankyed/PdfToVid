import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, FormGroup, FormHelperText, FormLabel, Grid, Tab, Tabs } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { resultListAtom, searchStateAtom, tabValueAtom } from './store';
import PageLayout from '~/shared/components/layout/page-layout';
import PageMessage from '~/shared/components/page-message';
import VideoPapersGrid from '~/date-entry/components/grid';
import PapersTable from '~/date-entry/components/table';
import './search.css';

const SearchPage: React.FC<{}> = () => {
  const [searchField, setSearchField] = useState('');
  const [relevancyScore, setRelevancyScore] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ favorite: false, viewed: false, states: { initial: false, approved: false, generated: false, published: false } });
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  const handleCriteriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [event.target.name]: event.target.checked });
  };

  return (
    <PageLayout padding={3}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
          style={{ margin: '0 15em 1em 15em' }}
        >
        <Box sx={{ width: '100%' }}>
          <TextField id="keyword-input" label="Search Term" variant="outlined" sx={{ marginRight: 2 }} fullWidth/>
        </Box>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="search-field-label">Field</InputLabel>
          <Select
            labelId="search-field-label"
            id="search-field-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value as string)}
            label="Field"
          >
            <MenuItem value="field1">Field 1</MenuItem>
            <MenuItem value="field2">Field 2</MenuItem>
            {/* Add more fields as needed */}
          </Select>
        </FormControl>
      </Box>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Advanced</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ margin: '0 0 2rem 2rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControl component="fieldset" variant="standard">
              {/* <FormLabel component="legend">By criteria</FormLabel> */}
              <Grid container spacing={1} justifyContent="flex-end" sx={{ minWidth: '25rem', marginBottom: 2 }}>
                <Grid item xs={6} >
                  <FormControlLabel
                    // sx={{ minWidth: 'fit-content' }}
                    control={
                      <Checkbox checked={searchCriteria.favorite} onChange={handleCriteriaChange} name="favorite" />
                    }
                    label={<span>
                      Favorite <StarOutlinedIcon color="warning" style={{ marginLeft: '8px' }} />
                    </span>}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={searchCriteria.favorite} onChange={handleCriteriaChange} name="favorite" />
                    }
                    label={<span>
                      Viewed
                      <VisibilityIcon color="info" style={{ marginLeft: '15px' }} />
                    </span>}
                  />
                </Grid>
              </Grid>
              <FormGroup>
                <FormControl sx={{marginTop: 2, display:'flex', flexDirection: 'row' }} variant="outlined">
                  <Select
                    labelId="comparison-field-label"
                    id="comparison-field-select"
                    value={0}
                    sx={{ marginRight: 2 }}
                    // onChange={(e) => setSearchField(e.target.value as string)}
                    // displayEmpty
                  >
                    <MenuItem value="0">≥</MenuItem>
                    <MenuItem value="1">≤</MenuItem>
                    {/* Add more fields as needed */}
                  </Select>
                  <TextField
                    id="relevancy-score-input"
                    label="Relevancy Score"
                    variant="outlined"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    value={relevancyScore}
                    onChange={(e) => setRelevancyScore(e.target.value)}
                    sx={{ minWidth: 170 }} 
                  />

                </FormControl>

              </FormGroup>
            </FormControl>

            <Divider orientation="vertical" flexItem />

            <FormControl
              required
              error={false}
              component="fieldset"
              variant="standard"
            >
              {/* <FormLabel component="legend">By Date</FormLabel> */}
              <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(newValue: any) => setFromDate(newValue)}
                  />
                  <DatePicker
                    sx={{ marginTop: 2 }}
                    label="To Date"
                    value={toDate}
                    onChange={(newValue: any) => setToDate(newValue)}
                  />
                </LocalizationProvider>
              </Box>

              {/* <FormHelperText>You can display an error</FormHelperText> */}
            </FormControl>

            <Divider orientation="vertical" flexItem />

            <FormControl sx={{}} component="fieldset" variant="standard">
              <FormLabel component="legend">State</FormLabel>
              <Grid container spacing={1} justifyContent="flex-end">
                {Object.keys(searchCriteria.states).map((state, index) => (
                  <Grid item xs={6} key={index}> {/* Ensure each item takes up half the width */}
                    <FormControlLabel
                      control={<Checkbox checked={searchCriteria.states[state]} onChange={handleCriteriaChange} name={`states.${state}`} />}
                      label={state.charAt(0).toUpperCase() + state.slice(1)}
                    />
                  </Grid>
                ))}
              </Grid>

            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: "space-between", minWidth: 420, placeSelf: 'center', marginTop: 2  }}>
          <Button variant="contained" color='success'>Search</Button>
          <Button variant="contained" color="warning">Reset</Button>
          <Button variant="contained" color="secondary">Clear Results</Button>
        </Box>

      <Divider sx={{ width: '100%', my: 2 }} />

      {/* <Typography sx={{ width: '100%', mx: 2,  marginBottom: 2 }}>Results</Typography> */}

      <RenderByState />
    </PageLayout>
  );
}

const RenderByState = () => {
  const [searchState] = useAtom(searchStateAtom);

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

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange} centered>
        <Tab label="Table" />
        <Tab label="Grid" />
      </Tabs>
      <Box>
        {tabValue === 0 && <PapersTable papers={results} isLoading={isLoading} placeholderRows={3}/>}
        {tabValue === 1 && <VideoPapersGrid papers={results} isLoading={isLoading} placeholderRows={2}/>}
      </Box>
    </Box>
  );
}

export default SearchPage;
