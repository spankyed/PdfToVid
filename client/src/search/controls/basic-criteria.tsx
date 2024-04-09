import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, FormControl, TextField, Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

const BasicCriteriaControl: React.FC<{}> = () => {
  const [relevancyScore, setRelevancyScore] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({ favorite: false, viewed: false, states: { initial: false, approved: false, generated: false, published: false } });

  const handleCriteriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [event.target.name]: event.target.checked });
  };

  return (
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
  );
}

export default BasicCriteriaControl;
