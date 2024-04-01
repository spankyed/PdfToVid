import React, { useState } from 'react';
import { Typography, Box, Button, Link } from '@mui/material';
import { styled } from '@mui/material';
import PageLayout from '~/shared/components/layout/page-layout';
import './paper-entry.css';
import EntryTabs from './tabs';
import { useAtom } from 'jotai';
import { pdfModalOpen } from './store';
import PdfModal from './pdf/modal';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '~/shared/utils/dateFormatter';

const EntryTitleStyled = styled(Typography)(({ theme }) => ({
  // textAlign: 'center',
  fontWeight: 600,
  background: 'rgba(0, 0, 0, 0.5)', // Black with 50% opacity
  padding: theme.spacing(1), // You can adjust the padding as needed
  borderRadius: theme.shape.borderRadius, // Makes the corners rounded
  // color: theme.palette.secondary.main, // or any color you prefer
  textShadow: '2px 2px 4px #00000040',
  maxWidth: 'fit-content',
  position: 'relative', // Ensures the title overlays the background
  zIndex: 1, // Places the title above the background component
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(2),
  // background: 'linear-gradient(135deg, #222222 50%, #B4191C 50%)',
  background: 'linear-gradient(135deg, #B4191C 50%, #222222 50%)',
  // background: 'linear-gradient(to right, #B4191C 50%, #222222 50%)',
  // background: 'linear-gradient(to right, #222222 50%, #B4191C 50%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
}));

const Entry = {
  title: "Enhancing Trust in LLM-Based AI Automation Agents: New Considerations and Future Challenges",
  videoTitle: 'AI Brainstorm, Process Mining Revolution, Business Superpowers Unleashed!',
  abstract: "Trust in AI agents has been extensively studied in the literature, resulting in significant advancements in our understanding of this field. However, the rapid advancements in Large Language Models (LLMs) and the emergence of LLM-based AI agent frameworks pose new challenges and opportunities for further research. In the field of process automation, a new generation of AI-based agents has emerged, enabling the execution of complex tasks. At the same time, the process of building automation has become more accessible to business users via user-friendly no-code tools and training mechanisms. This paper explores these new challenges and opportunities, analyzes the main aspects of trust in AI agents discussed in existing literature, and identifies specific considerations and challenges relevant to this new generation of automation agents. We also evaluate how nascent products in this category address these considerations. Finally, we highlight several challenges that the research community should address in this evolving landscape.",
  thumbnailLarge: "https://picsum.photos/200/300",
  thumbnailSmall1: "https://picsum.photos/200/300",
  thumbnailSmall2: "https://picsum.photos/200/300",
  keywords: ["Keywords", "Keywords", "Keywords"],
  description: "Description",
  videoScript: `Imagine you're driving a car. The car represents your business, and the journey represents your business processes. Now, traditionally, to navigate the journey, you'd need to understand maps, road signs, and maybe even some complex GPS equipment. This is like the traditional process mining - it's powerful, but it requires specific knowledge and skills.

  Now, imagine if your car had an advanced GPS system where you could just tell it where you want to go in plain language, and it would understand and guide you there. Not only that, but it could also understand complex requests like "find a route with the least traffic" or "find a route that passes by a gas station and a Chinese restaurant". This is what the AI in this research is doing for process mining. It's making it as easy to use as telling your GPS where you want to go.
  
  But there's more. This GPS isn't perfect. Sometimes it might not understand your request, or it might get confused by unusual road layouts. So, the researchers have developed a system to handle these situations, to correct errors, and to learn from them. This is like the AI's ability to handle complex queries, to generate meaningful responses, and to learn from its mistakes.
  
  So, in a nutshell, this research is about turning the complex map of process mining into an easy-to-use GPS system that anyone in your business can use to navigate your business processes.`,
  prompts: [
    {
      question: "What is the main idea of this research?",
      answer: "The main idea of this research is to make process mining as easy to use as a GPS system."
    },
    {
      question: "What is the main idea of this research?",
      answer: "The main idea of this research is to make process mining as easy to use as a GPS system."
    },
    {
      question: "What is the main idea of this research?",
      answer: "The main idea of this research is to make process mining as easy to use as a GPS system."
    },
  ],
  date: '2024-03-27',
  authors: ["Author One", "Author Two", "Author Three"], // Example authors
}

const PaperEntryPage: React.FC<{}> = () => {
  return (
    <PageLayout padding={3}>
      <Box display="flex" justifyContent="center" flexDirection="column" marginBottom={3}>
        <DateAndAuthors date={Entry.date} authors={Entry.authors} />
        <EntryTitle title={Entry.title} />
        <Typography variant="body1" paragraph>{Entry.abstract}</Typography>
      </Box>
      <EntryTabs entry={Entry} />

      <PdfModal />

    </PageLayout>
  );
}

const EntryTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <GradientBackground>
      <EntryTitleStyled variant="h4" gutterBottom>
        {title}
      </EntryTitleStyled>
    </GradientBackground>
  );
};

const createAuthorSearchURL = (authorName) => {
  const [lastName, firstName] = authorName.split(' ');
  if (!firstName || !lastName) return '#';
  const query = `${lastName},+${firstName.charAt(0)}`;
  return `https://arxiv.org/search/cs?searchtype=author&query=${query}`;
};

const DateAndAuthors: React.FC<{ date: string, authors: string[] }> = ({ date, authors }) => {
  const navigate = useNavigate();
  const [, setOpen] = useAtom(pdfModalOpen);

  const handleOpen = () => setOpen(true);

  
  const onDateClick = date => e => {
    navigate(`/date/${date}`);
  }

  const formattedDate = formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
  <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
    <Typography variant="subtitle1" color="textSecondary" onClick={onDateClick(date)}
      style={{ cursor: 'pointer' }}>{formattedDate}</Typography>
    <Box>
      {authors.map((author, index) => (
        <React.Fragment key={index}>
          <Link href={createAuthorSearchURL(author)} color="primary" underline="hover" target="_blank">
            {author}
          </Link>
          {index < authors.length - 1 ? ', ' : ''}
        </React.Fragment>
      ))}
    </Box>
    <Button variant="contained" color="primary" onClick={handleOpen}>View PDF</Button>
  </Box>
)};

export default PaperEntryPage;
