import React, { useContext, useEffect, useMemo, useState } from 'react';
import { List, ListItemButton, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';
import { selectedDayAtom } from '~/shared/store'; // Import your Jotai atoms
import { useAtom } from 'jotai';
import { formatDateParts } from '~/shared/utils/dateFormatter';
import { datesListAtom, fetchDatesSidebarDataAtom, openMonthAtom } from './store';
import { styled } from '@mui/system';

const MonthItem = styled(ListItemButton)(({ theme }) => ({
  marginLeft: '.5rem', // Add 1rem margin to the left
  // marginRight: '4rem', // Add 1rem margin to the left
  whiteSpace: 'nowrap',
}));

function DateList(): React.ReactElement {
  const [datesList] = useAtom(datesListAtom); // todo useMemo
  const [selectedDay] = useAtom(selectedDayAtom);
  const [openMonth, setOpenMonth] = useAtom(openMonthAtom);
  const [, fetchData] = useAtom(fetchDatesSidebarDataAtom);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <List sx={{
      overflow: 'auto',
      overflowX: 'hidden',
      // paddingLeft: '8px', 
      // marginLeft: '.2rem', // Add 1rem margin to the left
    }}>
      {datesList.map(({ month, days }) => (
        <div key={month}>
          <MonthItem onClick={() => clickMonth(month)} sx={{ fontWeight: 'bolder' }}>
            <ListItemText primary={month} sx={{ 
              borderBottom: '1px solid rgba(0, 0, 0, 0.3)', 
              paddingBottom: '4px',
              // marginLeft: '16%',
              // textAlign: 'center' 
              // paddingLeft: '.2rem', 
            }}/>
          </MonthItem>
          <Collapse in={openMonth === month} timeout="auto" >
            <List component="div">
              {days.map(day => {
                // const formattedDate = useMemo(() => reformatDate(day.value), [day.value]);
                const [formattedDay, formattedWeekday] = reformatDate(day.value);
                return (
                  <Link to={`/date/${day.value}`} key={'date-' + day.value}>
                    <ListItemButton selected={selectedDay === day.value} >
                      <ListItemText primary={
                        <DateDisplay formattedDay={formattedDay} formattedWeekday={formattedWeekday} />
                      } sx={{ 
                        paddingLeft: '14px',
                      }}/>
                    </ListItemButton>
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

const dayStyle = {
  padding: '4px 16px 4px 0px',
  borderRight: '1px solid rgba(0, 0, 0, 0.4)',
  // marginLeft: '-.8rem',
  whiteSpace: 'nowrap',
  color: 'rgba(232, 230, 227, 0.6)'
};

const weekdayStyle = {
  paddingLeft: '16px',
  whiteSpace: 'nowrap',
};

// Renamed the function to DateDisplay to avoid confusion with JavaScript's Date object
function DateDisplay({
  formattedDay,
  formattedWeekday,
}: {
  formattedDay: string;
  formattedWeekday: string;
}): React.ReactElement {
  return (
    <div> {/* Using a div as a parent container for better semantics */}
      <span style={dayStyle}>
        {formattedDay}
      </span>
      <span style={weekdayStyle}>
        {formattedWeekday}
      </span>
    </div>
  );
}

export default DateList;
