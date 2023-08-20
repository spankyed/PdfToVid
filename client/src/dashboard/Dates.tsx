
const dates = {
  'July 2023': ['Mon, Jul 01', 'Tue, Jul 02', 'Wed, Jul 03'],
  'August 2023': ['Mon, Aug 01', 'Tue, Aug 02', 'Wed, Aug 03'],
  'September 2023': ['Mon, Sep 01', 'Tue, Sep 02', 'Wed, Sep 03', 'Thu, Sep 04', 'Fri, Sep 05', 'Sat, Sep 06', 'Sun, Sep 07', 'Mon, Sep 08', 'Tue, Sep 09', 'Wed, Sep 10', 'Thu, Sep 11', 'Fri, Sep 12', 'Sat, Sep 13', 'Sun, Sep 14', 'Mon, Sep 15', 'Tue, Sep 16', 'Wed, Sep 17', 'Thu, Sep 18', 'Fri, Sep 19', 'Sat, Sep 20', 'Sun, Sep 21', 'Mon, Sep 22', 'Tue, Sep 23', 'Wed, Sep 24', 'Thu, Sep 25', 'Fri, Sep 26', 'Sat, Sep 27', 'Sun, Sep 28', 'Mon, Sep 29', 'Tue, Sep 30'],
}
// src/components/DateList.tsx

import React, { useContext, useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';
import { observer } from 'mobx-react-lite';

const DateList: React.FC = observer(() => {
  const store = useContext<StoreType>(StoreContext);
  const { datesList, selectedDay, openMonth, setOpenMonth, selectDay } = store.dashboard;

  const clickMonth = (month: string) => {
    setOpenMonth(openMonth === month ? '' : month);
  };

  const clickDay = (day: string) => {
    // todo navigate to day page
    // selectDay(day);
  };

  function reformatDate(inputDate: string): string[] {
    const date = new Date(inputDate);
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit'
    });
  
    return formatted.split(' ');
  }

  return (
    <List sx={{ overflow: 'auto' }}>
      {datesList.map(({ month, days }) => (
        <div key={month}>
          <ListItem button onClick={() => clickMonth(month)} sx={{ fontWeight: 'bolder' }}>
            <ListItemText primary={month} sx={{ 
              borderBottom: '1px solid', 
              paddingBottom: '4px',
              // marginLeft: '16%',
              // textAlign: 'center' 
              paddingLeft: '8%', 
            }}/>
          </ListItem>
          <Collapse in={openMonth === month} timeout="auto" >
            <List component="div">
              {days.map(day => {
                const [formattedDay, formattedWeekday] = reformatDate(day.value);
                return (
                  <ListItem 
                    button 
                    key={day.value}
                    onClick={() => clickDay(day.value)}
                    selected={selectedDay === day.value}
                  >
                    <ListItemText primary={
                      <>
                        <span style={{ 
                          padding: '4px 8px 4px 0px',
                          borderRight: '1px solid black' 
                        }}>
                          {formattedDay}
                        </span>
                        <span style={{ paddingLeft: '8px' }}>
                          {formattedWeekday}
                        </span>
                      </>
                    } sx={{ 
                      paddingLeft: '14%',
                    }}/>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
})

export default DateList;
