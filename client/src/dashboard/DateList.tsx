const dates = {
  'July': ['July 1,', 'July 2,', 'July 3,'],
  'August': ['August 1,', 'August 2,', 'August 3,'],
  'September': ['September 1,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,', 'September 2,', 'September 3,'],
}
// src/components/DateList.tsx

import React, { useContext, useState } from 'react';
import { List, ListItem, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';

const DateList: React.FC = () => {
  const store = useContext<StoreType>(StoreContext);
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  // Assuming the store has a `dates` property that is an object where each key is a month
  // and the value is an array of date strings for that month
  // const dates = store.dates;

  const handleClick = (month: string) => {
    setOpenMonth(prevMonth => (prevMonth === month ? null : month));
  };

  return (
    <List sx={{ overflow: 'auto' }}>
      {Object.keys(dates).map(month => (
        <div key={month}>
          <ListItem button onClick={() => handleClick(month)} sx={{ fontWeight: 'bolder' }}>
            <ListItemText primary={month} />
          </ListItem>
          <Collapse in={openMonth === month} timeout="auto" unmountOnExit>
            <List component="div" sx={{ paddingLeft: 3 }}>
              {dates[month].map(date => (
                <ListItem button key={date}>
                  <ListItemText primary={date} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
}

export default DateList;
