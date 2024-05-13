import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from '@mui/material';
import ChatOptions from './options';
import DocumentSection from './document';
import MessageList from './messages';
import { scrollableContainerRefAtom } from '../store';
import { useAtom } from 'jotai';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionActions } from '@mui/material';

// todo show video prompts, allow editing prompt (will update globally)
// dont ask again button

export default function ChatTab() {
  return (
    <Box sx={{ marginTop: 2, mb: 1 }}>
      <ChatOptions />
      <DocumentSection />
      <MessageList />
    </Box>
  );
}
