import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';
import PageLayout from '~/shared/components/layout/page-layout';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { fetchPaperAtom, pageStateAtom, paperAtom, scrollableContainerRefAtom } from './store';
import PdfModal from './pdf/modal';
import { useParams } from 'react-router-dom';
import DateAuthorsPdf from './header/date-authors-pdf';
import PaperTitle from './header/title';
import './paper-entry.css';
import { updatePaperAtom } from '~/shared/store';
import ContentTab from './content';
import ChatTab from './chat';

const orEmpty = (value: string | undefined) => value || '';

const PaperEntryPage = () => {
  let { paperId } = useParams<{ paperId: string }>();
  paperId = orEmpty(paperId);

  const [, setScrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [, fetchData] = useAtom(fetchPaperAtom);
  const [paper] = useAtom(paperAtom);
  const [pageState, setPageState] = useAtom(pageStateAtom);
  const updatePaper = useSetAtom(updatePaperAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollableContainerRef(containerRef);
  }, [setScrollableContainerRef]);

  useEffect(() => {
    const handlePaperUpdate = (event) => {
      const { id, changes } = event.detail;
      const { field, value } = changes;

      updatePaper({ paperAtom, id, field, newValue: value })
    }

    window.addEventListener('paperUpdate', handlePaperUpdate);

    return () => {
      setPageState('loading');
      window.removeEventListener('paperUpdate', handlePaperUpdate);
    };
  }, []);
  
  useEffect(() => {
    fetchData(paperId);
  }, [fetchData]);
  
  return (
    <PageLayout
      ref={containerRef}
      padding={3} >
      {
        pageState === 'error'
        ? <PaperTitle title={`Error Loading Paper ${paperId}`} id={null}/>
        : (
        <>
          <Box display="flex" justifyContent="center" flexDirection="column" marginBottom={1}>
            <DateAuthorsPdf paper={paper} />
            <PaperTitle title={paper?.title} id={paper?.id}/>
            <Typography variant="body1" paragraph>
              {orEmpty(paper?.abstract)}
            </Typography>
          </Box>

          <TabSection />

          <PdfModal paperId={paper?.id}/>
        </>
        )
      }
    </PageLayout>
  );
}

const TabSection = () => {
  const paper = useAtomValue(paperAtom);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Chat" />
        <Tab label="Content" />
        {/* <Tab label="Analytics" /> */}
        {/* todo add "Integrate" tab to apply and implement research into projects */}
      </Tabs>
      {tabValue === 0 && <ChatTab />}  {/* prompts*/}
      {tabValue === 1 && <ContentTab />}
      {/* {tabValue === 2 && <div>empty</div>} */}
    </Box>
  );
}

export default PaperEntryPage;
