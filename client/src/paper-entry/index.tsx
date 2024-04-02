import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import PageLayout from '~/shared/components/layout/page-layout';
import EntryTabs from './components/tabs';
import { useAtom } from 'jotai';
import { fetchPaperAtom, paperAtom } from './store';
import PdfModal from './components/pdf/modal';
import { useParams } from 'react-router-dom';
import DateAuthorsPdf from './components/date-authors-pdf';
import PaperTitle from './components/title';
import './paper-entry.css';

const orEmpty = (value: string | undefined) => value || '';

const PaperEntryPage: React.FC<{}> = () => {
  let { paperId } = useParams<{ paperId: string }>();
  paperId = orEmpty(paperId);

  const [, fetchData] = useAtom(fetchPaperAtom);
  const [paper] = useAtom(paperAtom);
  const authors = paper?.authors.split(';').map(p => p.trim()) || [];

  useEffect(() => {
    fetchData(paperId);
  }, [fetchData]);
  
  return (
    <PageLayout padding={3}>
      <Box display="flex" justifyContent="center" flexDirection="column" marginBottom={3}>
        <DateAuthorsPdf date={paper?.date} authors={authors} />
        <PaperTitle title={paper?.title} />
        <Typography variant="body1" paragraph>
          {orEmpty(paper?.abstract)}
        </Typography>
      </Box>

      <EntryTabs entry={{}} />

      <PdfModal urlId={paper?.id}/>
    </PageLayout>
  );
}

export default PaperEntryPage;
