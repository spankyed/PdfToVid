import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { LearnTab } from './prompts';
import { ReviewTab } from './review';
import { useAtom } from 'jotai';
import { paperAtom } from '~/paper-entry/store';

const MockEntry = {
  videoTitle: 'AI Brainstorm, Process Mining Revolution, Business Superpowers Unleashed!',
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
}

const MainContent = () => {
  const [paper] = useAtom(paperAtom);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Prompts" />
        <Tab label="Analytics" />
        <Tab label="Generate" />
        {/* instead of integrate as separate tab, consider having in review section under meta */}
      </Tabs>
      {tabValue === 0 && <ReviewTab entry={MockEntry} />}
      {tabValue === 1 && <LearnTab entry={MockEntry} />}  {/* prompts*/}
      {tabValue === 2 && <div>empty</div>}
    </Box>
  );
}

export default MainContent;
