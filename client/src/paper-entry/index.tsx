import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import PageLayout from '~/shared/components/layout/page-layout';
import EntryTabs from './components/tabs';
import { useAtom, useSetAtom } from 'jotai';
import { fetchPaperAtom, pageStateAtom, paperAtom } from './store';
import PdfModal from './components/pdf/modal';
import { useParams } from 'react-router-dom';
import DateAuthorsPdf from './components/date-authors-pdf';
import PaperTitle from './components/title';
import './paper-entry.css';
import { updatePaperAtom } from '~/shared/store';

const orEmpty = (value: string | undefined) => value || '';

const PaperEntryPage: React.FC<{}> = () => {
  let { paperId } = useParams<{ paperId: string }>();
  paperId = orEmpty(paperId);

  const [, fetchData] = useAtom(fetchPaperAtom);
  const [paper] = useAtom(paperAtom);
  const [pageState, setPageState] = useAtom(pageStateAtom);
  const updatePaper = useSetAtom(updatePaperAtom);

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
    <PageLayout padding={3}>
      {
        pageState === 'error'
        ? <PaperTitle title={`Error Loading Paper ${paperId}`} id={null}/>
        : (
        <>
          <Box display="flex" justifyContent="center" flexDirection="column" marginBottom={3}>
            <DateAuthorsPdf paper={paper} />
            <PaperTitle title={paper?.title} id={paper?.id}/>
            <Typography variant="body1" paragraph>
              {orEmpty(paper?.abstract)}
            </Typography>
          </Box>

          <EntryTabs entry={{}} />

          <PdfModal urlId={paper?.id}/>
        </>
        )
      }
    </PageLayout>
  );
}

export default PaperEntryPage;
