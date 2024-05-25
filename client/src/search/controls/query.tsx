import React, { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Select, MenuItem, FormControl, InputLabel, Box, TextField, Button } from '@mui/material';
import { queryAtom, queryFieldAtom, resetFieldsAtom, submitSearchAtom } from '../store';

const QueryControl: React.FC<{}> = () => {
  const [query, setQuery] = useAtom(queryAtom);
  const [queryField, setQueryField] = useAtom(queryFieldAtom);
  const queryParams = new URLSearchParams(location.search);
  const queryParam = queryParams.get('query');
  const resetFields = useSetAtom(resetFieldsAtom);
  const submitSearch = useSetAtom(submitSearchAtom);

  useEffect(() => {
    if (queryParam) {
      submitSearch({ query: queryParam, queryField: 'all'});
    } else if (queryParam !== null) {
      setQuery(queryParam)
    }
  }, [queryParam]);
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <TextField
          id="query-input"
          label="Search Query"
          variant="outlined"
          size="small"
          sx={{ marginRight: 2 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth/>
      </Box>
      <FormControl variant="outlined" sx={{ minWidth: 120 }} size="small">
        <InputLabel id="search-field-label">Field</InputLabel>
        <Select
          labelId="search-field-label"
          id="search-field-select"
          value={queryField}
          onChange={(e) => setQueryField(e.target.value)}
          label="Field"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="abstract">Abstract</MenuItem>
          <MenuItem value="authors">Authors</MenuItem>
          {/* <MenuItem value="date">Date</MenuItem> */}
          {/* <MenuItem value="id">Id</MenuItem> */}
          {/* <MenuItem value="keywords">keywords</MenuItem> */}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: "space-between", placeSelf: 'center'  }}>
        {/* <Box sx={{ display: 'flex', justifyContent: "space-between", minWidth: 420, placeSelf: 'center', marginTop: 2  }}> */}
        <Button variant="contained" color='success' onClick={() => submitSearch()}>Search</Button>
        <Button variant="contained" color="warning" onClick={resetFields} sx={{ml:1}}>Reset</Button>
        {/* <Button variant="contained" color="secondary">Clear Results</Button> */}
      </Box>
    </>
  );
}

export default QueryControl;
