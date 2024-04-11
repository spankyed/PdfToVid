import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, TextField, Checkbox, FormControlLabel, FormGroup, Grid, InputAdornment } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { favoriteAtom, viewedAtom, relevancyAtom, comparisonOperatorAtom } from '../store';

const BasicCriteriaControl: React.FC<{}> = () => {
  const [favorite, setFavorite] = useAtom(favoriteAtom);
  const [viewed, setViewed] = useAtom(viewedAtom);
  const [relevancy, setRelevancy] = useAtom(relevancyAtom);
  const [comparisonOperator, setComparisonOperator] = useAtom(comparisonOperatorAtom);

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
            label="Relevancy Score"
            variant="outlined"
            type="number"
            InputProps={{
              inputProps: { min: 0, max: 100 },
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            value={relevancy}
            onChange={(e) => setRelevancy(e.target.value)}
            sx={{ minWidth: 170 }} 
          />
        </FormControl>
      </FormGroup>
    </FormControl>
  );
}

export default BasicCriteriaControl;
