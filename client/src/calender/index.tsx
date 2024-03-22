import React, { useContext, useEffect, useRef } from 'react';
import CalenderMain from './components/main';
import './calender.css';
import { useAtom } from 'jotai';
import { isOpenAtom,  } from './components/summary/store';
import { scrollableContainerRefAtom } from './components/main/store';
import PageLayout from '~/shared/components/layout/page-layout';


const Calender: React.FC = () => {
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
        ref={containerRef}
        onScroll={handleScroll}
      >
        <CalenderMain />
      </PageLayout>
  );
}

export default Calender;
