import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

// todo show video prompts, allow editing prompt (will update globally)
// dont ask again button

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

export default function ChatTab() {


  return (
    <Box sx={{ marginTop: 3, mb: 1 }}>
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


function ChatMessage({ message }) {
  // todo press ctrl to select
  // if message is long, show "read more" button if not last message in chat
  return (
    <div>
      <p>{message.text}</p>
    </div>
  );
}
function Document({ message }) {
  // todo press ctrl to select
  return (
    <div>
      <p>{message.text}</p>
    </div>
  );
}