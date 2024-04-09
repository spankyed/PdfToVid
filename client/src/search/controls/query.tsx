import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, InputLabel, Box, TextField } from '@mui/material';
import { queryAtom, queryFieldAtom } from '../store';

const QueryControl: React.FC<{}> = () => {
  const [query, setQuery] = useAtom(queryAtom);
  const [queryField, setQueryField] = useAtom(queryFieldAtom);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <TextField
          id="query-input"
          label="Search Query"
          variant="outlined"
          sx={{ marginRight: 2 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth/>
      </Box>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
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
    </>
  );
}

export default QueryControl;
