import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import ChatOptions from './options';
import DocumentSection from './document';
import MessageList from './messages';
import { scrollableContainerRefAtom } from '../store';
import { useAtom } from 'jotai';

// todo show video prompts, allow editing prompt (will update globally)
// dont ask again button


export default function ChatTab() {
  return (
    <Box sx={{ marginTop: 3, mb: 1 }}>
      <ChatOptions />
      <DocumentSection />
      <MessageList />
    </Box>
  );
}
