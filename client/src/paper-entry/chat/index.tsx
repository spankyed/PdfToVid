import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ChatHeader from './header';
import DocumentSection from './document';
import MessageList from './messages';

// todo show video prompts, allow editing prompt (will update globally)
// dont ask again button


export default function ChatTab() {

  return (
    <Box sx={{ marginTop: 3, mb: 1 }}>
      <ChatHeader />
      <DocumentSection />
      <MessageList />
    </Box>
  );
}
