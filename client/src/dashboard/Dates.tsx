import React, { useContext, useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { StoreContext } from '../index';
import { StoreType } from '../shared/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const DateList: React.FC = observer(() => {
  const store = useContext<StoreType>(StoreContext);
  const { datesList, selectedDay, openMonth, setOpenMonth, selectDay } = store.dashboard;

  const clickMonth = (month: string) => {
    setOpenMonth(openMonth === month ? '' : month);
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
                  <Link to={`/day/${day.value}`}>
                    <ListItem 
                      button 
                      key={day.value}
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
                  </Link>
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
