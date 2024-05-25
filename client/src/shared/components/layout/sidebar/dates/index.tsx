import React, { useContext, useEffect, useRef, useState } from 'react';
import { List, ListItemButton, ListItemText, ListSubheader, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';
import { selectedDateAtom } from '~/shared/store'; // Import your Jotai atoms
import { useAtom } from 'jotai';
import { formatDateParts } from '~/shared/utils/dateFormatter';
import { datesRowsAtom, fetchDatesSidebarDataAtom, lastOpenMonthAtom, openMonthAtom } from './store';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom';
import { calendarLoadMonthAtom, calendarStateAtom } from '~/calendar/store';
import { scrollToElement } from '~/shared/utils/scrollPromise';

const MonthItem = styled(ListItemButton)(({ theme }) => ({
  // marginLeft: '.5rem', // Add 1rem margin to the left
  // marginRight: '4rem', // Add 1rem margin to the left
  whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(140, 130, 115, 0.22)', 
}));

function DateList(): React.ReactElement {
  const [datesRows] = useAtom(datesRowsAtom); // todo useMemo
  const [selectedDate] = useAtom(selectedDateAtom);
  const [openMonth, setOpenMonth] = useAtom(openMonthAtom);
  const [lastOpenMonth, setLastOpenMonth] = useAtom(lastOpenMonthAtom);
  const [, fetchSidebarData] = useAtom(fetchDatesSidebarDataAtom);
  const [, loadMonth] = useAtom(calendarLoadMonthAtom);
  const [, setCalendarState] = useAtom(calendarStateAtom);
  const collapseRefs = useRef({}); // Step 1: Create refs object
  const container = useRef(null);

  const location = useLocation();


  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  const clickMonth = (month: string) => {
    setOpenMonth(openMonth === month ? '' : month);
  };

  const handleMonthOpen = async (month: string) => {
    const element = collapseRefs.current[month];
    const onCalendarPage = location.pathname.startsWith('/calendar');
    const monthChanged = lastOpenMonth !== month;

    if (onCalendarPage && monthChanged) {
      setCalendarState('loading');
    }
    
    if (element) {
      // todo load month data first, after adding scrollPromise queue
      await scrollToElement({
        element,
        container,
        options: { behavior: 'smooth', block: 'start' },
        method:'scrollIntoView',
      })
    }

    if (!monthChanged) {
      return;
    }

    setLastOpenMonth(month);

    if (onCalendarPage) {
      const date = datesRows.find(d => d.month === month)?.dates[0]?.value;

      loadMonth(date)
    }
  }

  function reformatDate(inputDate: string): string[] {
    return formatDateParts(inputDate, {
      weekday: 'long',
      day: '2-digit',
    });
  }

  return (
    <List 
      ref={container}
      sx={{
      overflow: 'auto',
      overflowX: 'hidden',
      // backgroundColor: colors.main,
      flexGrow: 1,
      // paddingLeft: '8px', 
      // marginLeft: '.2rem', // Add 1rem margin to the left
    }}>
      {datesRows.map(({ month, dates }) => (
        <div key={month} ref={el => collapseRefs.current[month] = el}>
          <MonthItem onClick={() => clickMonth(month)} sx={{ fontWeight: 'bolder' }}>
            <ListItemText
              primary={<span style={{ fontWeight: '600', color: 'rgba(232, 230, 227, 0.85)' }}>{month}</span>}
              sx={{ 
                // borderBottom: '1px solid rgba(0, 0, 0, 0.3)', 
                paddingBottom: '4px',
                // textAlign: 'center',
                marginLeft: '5%',
                // paddingLeft: '.2rem', 
                color: 'rgba(232, 230, 227, 0.1)',
              }}
            />
          </MonthItem>
          <Collapse in={openMonth === month} timeout="auto" onEntered={() => handleMonthOpen(month)}>
            <List component="div">
              {dates.map(date => {
                // const formattedDate = useMemo(() => reformatDate(date.value), [date.value]);
                const [formattedDate, formattedWeekday] = reformatDate(date.value);
                return (
                  <Link to={`/date/${date.value}`} key={'date-' + date.value}>
                    <ListItemButton selected={selectedDate === date.value} >
                      <ListItemText primary={
                        <DateDisplay formattedDate={formattedDate} formattedWeekday={formattedWeekday} />
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

const dateStyle = {
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
  formattedDate,
  formattedWeekday,
}: {
  formattedDate: string;
  formattedWeekday: string;
}): React.ReactElement {
  return (
    <div> {/* Using a div as a parent container for better semantics */}
      <span style={dateStyle}>
        {formattedDate}
      </span>
      <span style={weekdayStyle}>
        {formattedWeekday}
      </span>
    </div>
  );
}

export default DateList;
