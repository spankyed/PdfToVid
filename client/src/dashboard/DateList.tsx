
const dates = {
  'July 2023': ['Mon, Jul 01', 'Tue, Jul 02', 'Wed, Jul 03'],
  'August 2023': ['Mon, Aug 01', 'Tue, Aug 02', 'Wed, Aug 03'],
  'September 2023': ['Mon, Sep 01', 'Tue, Sep 02', 'Wed, Sep 03', 'Thu, Sep 04', 'Fri, Sep 05', 'Sat, Sep 06', 'Sun, Sep 07', 'Mon, Sep 08', 'Tue, Sep 09', 'Wed, Sep 10', 'Thu, Sep 11', 'Fri, Sep 12', 'Sat, Sep 13', 'Sun, Sep 14', 'Mon, Sep 15', 'Tue, Sep 16', 'Wed, Sep 17', 'Thu, Sep 18', 'Fri, Sep 19', 'Sat, Sep 20', 'Sun, Sep 21', 'Mon, Sep 22', 'Tue, Sep 23', 'Wed, Sep 24', 'Thu, Sep 25', 'Fri, Sep 26', 'Sat, Sep 27', 'Sun, Sep 28', 'Mon, Sep 29', 'Tue, Sep 30'],
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
