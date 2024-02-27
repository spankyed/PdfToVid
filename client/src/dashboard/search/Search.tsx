// src/components/SearchPanel.tsx

import React, { useContext } from 'react';
import { TextField, Box, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';

const SearchPanel: React.FC = () => {
  // const [searchData, setSearchData] = useAtom(searchDataAtom);
  // const searchResults = store.searchResults;

  
  const result = {
    title: 'Testing GPT-4 with Wolfram Alpha an...',
    date: '2021-10-01',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
  }
  const searchResults = new Array(10).fill(result);

  return (
    <>
      <Button 
        sx={{ 
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.43',
          letterSpacing: '0.01071em',
          width: '100%',
          borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
          borderRadius: '0px', 
          marginTop: '3px',
        }}
        disabled
      >
        <Link to="/search" style={{ textDecoration: 'none', display: 'block'}}>
          Advanced Search
        </Link>
      </Button>
      <TextField 
        label="Search" 
        variant='filled' 
        fullWidth 
        sx={{ 
          borderRadius: '0px', 
          // marginLeft: '8%', 
          // '& input': { paddingLeft: '16px' } 
        }} 
        
        size='medium'
      />

      <Box sx={{ }}>
        {searchResults.map(result => (
          <Card key={result.title} sx={{ borderRadius: 0, borderBottom: '1px solid rgba(0, 0, 0, 0.3)' }}>
            <CardContent>
              <Typography variant='subtitle2' color="text.secondary">{result.date}</Typography>
              <Typography variant="h6">{result.title}</Typography>
              <Typography variant="body1">{result.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

    </>
  );
}

export default SearchPanel;