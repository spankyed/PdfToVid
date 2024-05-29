import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, TextField, Checkbox, FormControlLabel, FormGroup, Grid, InputAdornment, Button, Box, IconButton } from '@mui/material';
import { favoriteAtom, viewedAtom, relevancyAtom, comparisonOperatorAtom } from '../store';

const RelevancyCriteria: React.FC<{}> = () => {
  const [relevancy, setRelevancy] = useAtom(relevancyAtom);
  const [comparisonOperator, setComparisonOperator] = useAtom(comparisonOperatorAtom);

  const clampRelevancyScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      newValue = Math.max(0, Math.min(100, newValue));

      setRelevancy(newValue.toString());
    } else {
      setRelevancy('');
    }
  };

  return (
    <FormControl variant="outlined">
      <TextField
        // color='secondary'
        id="relevancy-score-input"
        label={<span style={{ color: '#9e9e9e' }}>Relevancy</span>}
        variant="outlined"
        type="number"
        placeholder='0'
        InputProps={{
          inputProps: { min: 0, max: 100 },
          sx: { textAlign: 'right'},
          startAdornment: (
            <IconButton
              sx={{
                color: 'white',
                // backgroundColor: '#9e9e9e',
                boxShadow: 'none',
                padding: 2.2,
                height: '1em',
                maxWidth: '1em',
                minWidth: '1em',
                mr: 2,
                fontSize: '1.2rem',
              }}
              onClick={(e) => setComparisonOperator(comparisonOperator === '≥' ? '≤': '≥')}
            >
              {comparisonOperator}
            </IconButton>
          ),
          endAdornment: <InputAdornment position="end" sx={{ ml: 1}}>%</InputAdornment>
        }}
        value={relevancy}
        onChange={clampRelevancyScore}
        sx={{ minWidth: 170 }} 
      />
    </FormControl>
  );
}

export default RelevancyCriteria;
