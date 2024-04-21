import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { FormControl, Box, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dateEndAtom, dateStartAtom } from '../store';

const BatchControls: React.FC<{ papers?: Paper[]; isLoading?: boolean; placeholderRows?: number }> = ({
  papers = [],
  isLoading = false,
  placeholderRows = 5
}) => {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Trash" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#simple-list">
            <ListItemText primary="Spam" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}

export default BatchControls;
