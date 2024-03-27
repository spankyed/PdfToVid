import React, { useContext, useEffect, useRef } from 'react';
import CalendarMain from './components/main';
import './calendar.css';
import { useAtom } from 'jotai';
import { isOpenAtom,  } from './components/summary/store';
import { scrollableContainerRefAtom } from './components/main/store';
import PageLayout from '~/shared/components/layout/page-layout';


const Calendar: React.FC = () => {
  const [, setScrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

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

  return (
      <PageLayout
        padding={2}
        compact={false}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <CalendarMain />
      </PageLayout>
  );
}

export default Calendar;
