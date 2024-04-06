import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
// import SearchIcon from '@mui/icons-material/Search';
import { useParams } from 'react-router-dom'; // Import useParams
import { dateEntryModelAtom, dateEntryStateAtom, fetchPapersByDateAtom, resetDateEntryStatusAtom, scrapePapersDateEntryAtom, scrapingStateAtom, setPapersAtom } from './store';
import PageTitle from './components/page-title';
import MainTabs from './components/main';
import PageLayout from '~/shared/components/layout/page-layout';
import ResetState from '~/shared/components/date/reset';
import ScrapeStatus from '~/shared/components/date/scrape-status';
import SocketListener from '~/shared/api/socket-listener';

function DateEntryPage(): React.ReactElement {
  let { dateId } = useParams<{ dateId: string }>();
  dateId = dateId || '';

  const [, fetchData] = useAtom(fetchPapersByDateAtom);
  const [datePage] = useAtom(dateEntryModelAtom);
  const setPageState = useSetAtom(dateEntryStateAtom);

  useEffect(() => {
    fetchData(dateId);
    return () => {
      setPageState('loading');
    }
  }, []);

  const { papers } = datePage;

  return (
    <PageLayout padding={3} style={{ marginTop: 3, margin: '0 auto'}}>
      <PageTitle date={dateId} count={papers.length} />
      <RenderByState
        dateId={dateId}
        pageModel={datePage}
      />
    </PageLayout>
  );
}

function RenderByState({ dateId, pageModel }) {
  const [state] = useAtom(dateEntryStateAtom);
  const [scrapeStatus, setScrapeStatus] = useAtom(scrapingStateAtom);
  const setPageState = useSetAtom(dateEntryStateAtom);
  const setPapers = useSetAtom(setPapersAtom);

  const handleDateStatusUpdate = ({ key, status: newStatus, data }) => {
    setScrapeStatus(newStatus);
    if (newStatus === 'complete') {
      setPapers(data);
      if (data.length === 0) {
        setPageState('unexpected');
      } else {
        setPageState('complete');
      }
    }
  };

  switch (state) {
    case 'loading':
      return <MainTabs isLoading={true} />;
    case 'error':
      return <div>Error: Date Not Found</div>;
    case 'unexpected':
      return <div><ResetState date={dateId} resetStatusAtom={resetDateEntryStatusAtom} /></div>;
    case 'pending':
      return (
        <>
          <ScrapeStatus status={scrapeStatus} date={dateId} scrapeAtom={scrapePapersDateEntryAtom}/>
          <SocketListener eventName="date_status" handleEvent={handleDateStatusUpdate} />
        </>
      )
    case 'complete':
    default:
      return <MainTabs papers={pageModel.papers} />;
  }
}

export default DateEntryPage;
