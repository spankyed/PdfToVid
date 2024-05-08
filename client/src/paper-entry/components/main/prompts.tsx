import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

const mockPrompts = [
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

export const LearnTab = () => {
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
    <Box sx={{ marginTop: 3 }}>
      {mockPrompts.map((prompt: { question: string, answer: string }, index: number) => (
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
    </Box>
  );
}
