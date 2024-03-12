import React, { useContext, useEffect, useMemo, useState } from 'react';
import { List, ListItem, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';
import { datesListAtom, selectedDayAtom, openMonthAtom } from '../../../shared/state'; // Import your Jotai atoms
import { useAtom } from 'jotai';
import { formatDateParts } from '~/shared/utils/dateFormatter';

function DateList(): React.ReactElement {
  // const store = useContext<StoreType>(StoreContext);
  // const { datesList, selectedDay, openMonth, setOpenMonth, selectDay } = store.calender;

  const [datesList] = useAtom(datesListAtom);
  const [selectedDay] = useAtom(selectedDayAtom);
  const [openMonth, setOpenMonth] = useAtom(openMonthAtom);

  const clickMonth = (month: string) => {
    setOpenMonth(openMonth === month ? '' : month);
  };

  function reformatDate(inputDate: string): string[] {
    return formatDateParts(inputDate, {
      weekday: 'long',
      day: '2-digit',
    });
  }

  return (
    <List sx={{ overflow: 'auto' }}>
      {datesList.map(({ month, days }) => (
        <div key={month}>
          <ListItem button onClick={() => clickMonth(month)} sx={{ fontWeight: 'bolder' }}>
            <ListItemText primary={month} sx={{ 
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)', 
              paddingBottom: '4px',
              // marginLeft: '16%',
              // textAlign: 'center' 
              paddingLeft: '8%', 
            }}/>
          </ListItem>
          <Collapse in={openMonth === month} timeout="auto" >
            <List component="div">
              {days.map(day => {
                // const formattedDate = useMemo(() => reformatDate(day.value), [day.value]);
                const [formattedDay, formattedWeekday] = reformatDate(day.value);
                return (
                  <Link to={`/day/${day.value}`} key={'date-' + day.value}>
                    <ListItem 
                      button 
                      selected={selectedDay === day.value}
                    >
                      <ListItemText primary={
                        <>
                          <span style={{ 
                            padding: '4px 8px 4px 0px',
                            borderRight: '1px solid rgba(0, 0, 0, 0.4)' 
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
}

export default DateList;
