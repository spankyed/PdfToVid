import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Button, Grid, TextField } from '@mui/material';
import { searchKeywordAtom } from '../store';
import { useAtom } from 'jotai';
// import { Paper, StoreType } from '~/shared/store';
// import SearchIcon from '@mui/icons-material/Search';

const SearchAndActions: React.FC<{ showingTable: boolean }> = ({ showingTable }) => {
  const [, setSearchKeyword] = useAtom(searchKeywordAtom);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection="row" gap={2} 
      style={{ 
        marginTop: '2em', 
        marginBottom: '2em', 
        marginRight: showingTable ? '2em' : '6em',
      }}
    >
      <Box sx={{ width: '70%' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange} // Add onChange handler here
        />
      </Box>
    </Box>
  );
}

export default SearchAndActions;
