import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
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
import getDaysInMonth from '~/shared/utils/getDaysInMonth';
import DoneIcon from '@mui/icons-material/Done';

function DateList(): React.ReactElement {
  const [datesRows] = useAtom(datesRowsAtom); // todo useMemo
  console.log('datesRows: ', datesRows);
  const [, fetchSidebarData] = useAtom(fetchDatesSidebarDataAtom);
  const container = useRef(null);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

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
        <Month key={month} month={month} dates={dates} container={container} />
      ))}
    </List>
  );
}

function Month({ month, dates, container }) {
  const [allComplete, setAllComplete] = useState(false);
  const daysInMonth = useMemo(() => getDaysInMonth(month), [month]);

  useEffect(() => {
    const allComplete = dates.every(date => date.status === 'complete');

    console.log('daysInMonth: ', {daysInMonth, datesCount: dates.length, allComplete});
    if (dates.length == daysInMonth && allComplete) {
      setAllComplete(true);
    }
  }, [dates]);

  const [selectedDate] = useAtom(selectedDateAtom);
  const [openMonth, setOpenMonth] = useAtom(openMonthAtom);
  const [lastOpenMonth, setLastOpenMonth] = useAtom(lastOpenMonthAtom);
  const [, loadMonth] = useAtom(calendarLoadMonthAtom);
  const [, setCalendarState] = useAtom(calendarStateAtom);
  const collapseRefs = useRef({}); // Step 1: Create refs object
  const location = useLocation();

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
      const date = dates[0]?.value;

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
    <div key={month} ref={el => collapseRefs.current[month] = el}>
      <MonthItem onClick={() => clickMonth(month)} sx={{ fontWeight: 'bolder' }}>
        <ListItemText
          primary={
            <span style={{ fontWeight: '600', color: 'rgba(232, 230, 227, 0.85)' }} className="flex justify-between">
              {month}
              {
                allComplete
                ? <DoneIcon sx={{ color: 'green'}}/>
                : null
              }
            </span>
          }
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
                    <DateDisplay formattedDate={formattedDate} formattedWeekday={formattedWeekday} count={date.count}/>
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
  )
}

const MonthItem = styled(ListItemButton)(({ theme }) => ({
  // marginLeft: '.5rem', // Add 1rem margin to the left
  // marginRight: '4rem', // Add 1rem margin to the left
  whiteSpace: 'nowrap',
  borderBottom: '1px solid rgba(140, 130, 115, 0.22)', 
}));

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
  count
}: {
  formattedDate: string;
  formattedWeekday: string;
  count: number | undefined;
}): React.ReactElement {
  return (
    <div style={{position: 'relative'}}> {/* Using a div as a parent container for better semantics */}
      <span style={dateStyle}>
        {formattedDate}
      </span>
      <span style={weekdayStyle}>
        {formattedWeekday}
      </span>
      {
        count && (
          <span style={{
            padding: '.3rem',
            position: 'absolute',
            right: '0',
            whiteSpace: 'nowrap',
            opacity: 0.4,
            borderRadius: '30%',
            fontSize: '.8em',
            marginTop: '-.2rem',
            marginRight: '-.2rem',
            // marginLeft: '.2rem',
            // backgroundColor: 'rgba(76, 61, 168, .3)',
            // border: '1px solid rgba(0, 0, 0, 0.3)',
            // backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}>
            {count}
          </span>
        )
      }

    </div>
  );
}

export default DateList;
