// src/components/SearchPanel.tsx

import React from 'react';
import { TextField } from '@material-ui/core';

const SearchPanel: React.FC = () => {
  return (
    <TextField label="Search" variant="outlined" fullWidth />
  );
}

export default SearchPanel;
