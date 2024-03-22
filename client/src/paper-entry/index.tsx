import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, Grid, Select, 
  MenuItem, Checkbox, TextField, Button, TextareaAutosize, CardMedia, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material';
import PageLayout from '~/shared/components/layout/page-layout';

// EntryTitle Component
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

const EntryTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <GradientBackground>
      <EntryTitleStyled variant="h4" gutterBottom>
        {title}
      </EntryTitleStyled>
    </GradientBackground>
  );
};

// EntryAbstract Component
const EntryAbstract: React.FC<{ abstract: string }> = ({ abstract }) => {
  return <Typography variant="body1" paragraph>{abstract}</Typography>;
}

// EntryTabs Component
const EntryTabs: React.FC<{ entry: any }> = ({ entry }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleChange}>
        <Tab label="Generate" />
        <Tab label="Prompts" />
        <Tab label="Analytics" />
        {/* instead of integrate as separate tab, consider having in review section under meta */}
      </Tabs>
      {tabValue === 0 && <ReviewTab entry={entry} />}
      {tabValue === 1 && <LearnTab entry={entry} />}  {/* prompts*/}
      {tabValue === 2 && <div>empty</div>}
    </Box>
  );
}

// ReviewTab Component
const ReviewTab: React.FC<{ entry: any }> = ({ entry }) => {
  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Metadata</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Metadata Level Content */}
          <Box>
            <TextField fullWidth label="Video Title" value={entry.videoTitle} sx={{ marginTop: 3}}/>
            <TextField fullWidth label="Keywords" value={entry.keywords} multiline sx={{ marginTop: 3, marginBottom: 3}} />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={entry.description}
              sx={{ marginTop: 3}}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Video</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Video Level Content */}
          <Box>
            <TextField
              fullWidth
              label="Script"
              multiline
              minRows={5}
              variant="outlined"
              value={entry.videoScript}
              sx={{ marginTop: 3}}
            />
            {/* Video Player Component */}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Thumbnail</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Thumbnail Level Content */}
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={6} container justifyContent="center">
              <Box maxWidth="1280px" width="100%">
                <CardMedia
                  component="img"
                  image={entry.thumbnailLarge}
                  alt="Large Thumbnail"
                  style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                />
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                  <Select defaultValue={'white'}>
                    <MenuItem value="white">White</MenuItem>
                    <MenuItem value="black">Black</MenuItem>
                    {/* Add more colors if needed */}
                  </Select>
                  {/* <Checkbox /> */}
                  <FormControlLabel control={<Checkbox />} label="Seminal?" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} container direction="column" spacing={2}>
              <Grid item container justifyContent="center">
                <Box maxWidth="640px" width="100%">
                  <Button>Reroll</Button>
                  <CardMedia
                    component="img"
                    image={entry.thumbnailSmall1}
                    alt="Small Thumbnail 1"
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                  />
                  <TextField fullWidth label="Description"/>
                </Box>
              </Grid>
              <Grid item container justifyContent="center">
                <Box maxWidth="640px" width="100%">
                  <Button>Reroll</Button>
                  <CardMedia
                    component="img"
                    image={entry.thumbnailSmall2}
                    alt="Small Thumbnail 2"
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                  />
                  <TextField fullWidth label="Description"/>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

const LearnTab: React.FC<{ entry: any }> = ({ entry }) => {
  // todo show video prompts, allow editing prompt (will update globally)
    // dont ask again button
  const [editablePromptIndex, setEditablePromptIndex] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    if (editablePromptIndex === index) {
      setEditablePromptIndex(null); // Toggle off editing if clicked on the same prompt
    } else {
      setEditablePromptIndex(index); // Set the current prompt to be editable
    }
  };

  return (
    <PageLayout style={{ marginTop: 3 }}>
      {entry.prompts.map((prompt: { question: string, answer: string }, index: number) => (
        <Box key={index} marginBottom={2} sx={{ marginTop: 4 }}>
          <Box display="flex" alignItems="center" marginBottom={1}>
            <input 
              type="text" 
              value={prompt.question} 
              readOnly={editablePromptIndex !== index} 
              style={{ flex: 1, marginRight: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <Button onClick={() => handleEditClick(index)}>Edit</Button>
          </Box>
          <p>{prompt.answer}</p>
        </Box>
      ))}
      <Button sx={{ marginTop: 3 }}>Add New Prompt</Button>
    </PageLayout>
  );
}



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
  ]
}


const PaperEntryPage: React.FC<{}> = () => {
  return (
    <Box padding={3}>
      <Box display="flex" justifyContent="center" flexDirection="column" marginBottom={3}>
        <EntryTitle title={Entry.title} />
        <EntryAbstract abstract={Entry.abstract} />
      </Box>
      <EntryTabs entry={Entry} />
    </Box>
  );
}

export default PaperEntryPage;
