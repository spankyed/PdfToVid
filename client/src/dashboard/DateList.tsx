const dates = {
  'July 2023': ['July 1, 2023', 'July 2, 2023', 'July 3, 2023'],
  'August 2023': ['August 1, 2023', 'August 2, 2023', 'August 3, 2023'],
  'September 2023': ['September 1, 2023', 'September 2, 2023', 'September 3, 2023'],
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
    <List>
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
