// src/components/DateList.tsx

import React, { useContext } from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { StoreContext } from '../index';
import { StoreType } from '../store';

const DateList: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);

  // Assuming the store has a `dates` property that is an array of date strings
  const dates = store.dates;

  return (
    <List>
      {dates.map(date => (
        <ListItem button key={date}>
          <ListItemText primary={date} />
        </ListItem>
      ))}
    </List>
  );
}

export default DateList;
