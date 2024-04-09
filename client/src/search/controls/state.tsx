import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, FormLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';

const StateControl: React.FC<{}> = () => {
  const [searchCriteria, setSearchCriteria] = useState({ favorite: false, viewed: false, states: { initial: false, approved: false, generated: false, published: false } });

  const handleCriteriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria({ ...searchCriteria, [event.target.name]: event.target.checked });
  };

  return (
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
  );
}

export default StateControl;
