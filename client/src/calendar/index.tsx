import React, { useContext, useEffect, useRef } from 'react';
import CalendarMain from './components/main';
import './calendar.css';
import { useAtom, useSetAtom } from 'jotai';
import { isSummaryOpenAtom } from '../shared/components/paper/tile/summary/store';
import { calendarModelAtomBase, scrollableContainerRefAtom } from './store';
import PageLayout from '~/shared/components/layout/page-layout';
import SocketListener from '~/shared/api/socket-listener';

const Calendar: React.FC = () => {
  const [, setScrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [isOpen, setIsOpen] = useAtom(isSummaryOpenAtom);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollableContainerRef(containerRef);
  }, [setScrollableContainerRef]);


  const handleScroll = () => {
    // Logic to close the summary popover on scroll
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const setCalendarModelBase = useSetAtom(calendarModelAtomBase);

  const handleDateStatusUpdate = ({ key, status: newStatus, data }) => {
    setCalendarModelBase((prevModel) => {
      const updatedModel = prevModel.map((item) => {
        if (item.date.value === key) {
          return {
            ...item,
            date: { ...item.date, status: newStatus },
            papers: newStatus === 'complete' ? data : item.papers,
          };
        }
        return item;
      });
      return updatedModel;
    });
  };

  return (
      <PageLayout
        padding={2}
        compact={false}
        ref={containerRef}
        onScroll={handleScroll}
        className="calendar"
      >
        <CalendarMain />
        <SocketListener eventName="date_status" handleEvent={handleDateStatusUpdate} />
      </PageLayout>
  );
}

export default Calendar;
