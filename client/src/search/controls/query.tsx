import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, InputLabel, Box, TextField } from '@mui/material';

const QueryControl: React.FC<{}> = () => {
  const [searchField, setSearchField] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ favorite: false, viewed: false, states: { initial: false, approved: false, generated: false, published: false } });

  const handleCriteriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <TextField id="query-input" label="Search Query" variant="outlined" sx={{ marginRight: 2 }} fullWidth/>
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
          <MenuItem value="id">Id</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="abstract">Abstract</MenuItem>
          <MenuItem value="authors">Authors</MenuItem>
          {/* <MenuItem value="keywords">keywords</MenuItem> */}
        </Select>
      </FormControl>
    </>
  );
}

export default QueryControl;
