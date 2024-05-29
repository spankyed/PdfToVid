import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, TextField, Checkbox, FormControlLabel, FormGroup, Grid, InputAdornment, Button } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { favoriteAtom, viewedAtom, relevancyAtom, comparisonOperatorAtom } from '../store';

const BasicCriteriaControl: React.FC<{}> = () => {
  const [favorite, setFavorite] = useAtom(favoriteAtom);
  const [viewed, setViewed] = useAtom(viewedAtom);
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
    <FormControl component="fieldset" variant="standard">
      {/* <FormLabel component="legend">Basic criteria</FormLabel> */}
      <Grid container spacing={1} justifyContent="flex-end" sx={{ minWidth: '25rem', marginBottom: 2 }}>
        <Grid item xs={6} >
          <FormControlLabel
            control={
              <Checkbox checked={favorite} onChange={(e) => setFavorite(e.target.checked)} name="favorite" />
            }
            label={
              <span>
                Starred <StarOutlinedIcon color="warning" style={{ marginLeft: '8px' }} />
              </span>
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox checked={viewed} onChange={(e) => setViewed(e.target.checked)} name="viewed" />
            }
            label={
              <span>
                Viewed <VisibilityIcon color="info" style={{ marginLeft: '15px' }} />
              </span>
            }
          />
        </Grid>
      </Grid>
      <FormGroup>
        <FormControl sx={{marginTop: 2, display:'flex', flexDirection: 'row' }} variant="outlined">
        <Select
            labelId="comparison-field-label"
            id="comparison-field-select"
            value={comparisonOperator}
            sx={{ marginRight: 2 }}
            onChange={(e) => setComparisonOperator(e.target.value)}
          >
            <MenuItem value="≥">≥</MenuItem>
            <MenuItem value="≤">≤</MenuItem>
          </Select>
          <TextField
            id="relevancy-score-input"
            label={<span style={{ color: '#9e9e9e' }}>Relevancy</span>}
            variant="outlined"
            type="number"
            InputProps={{
              inputProps: { min: 0, max: 100 },
              endAdornment: <InputAdornment position="end" sx={{ ml: 1}}>%</InputAdornment>
            }}
            value={relevancy}
            onChange={clampRelevancyScore}
            sx={{ minWidth: 170 }} 
          />
        </FormControl>
      </FormGroup>
    </FormControl>
  );
}

export default BasicCriteriaControl;
