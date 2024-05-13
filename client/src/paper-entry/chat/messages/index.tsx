import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { messagesAtom } from '../store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { scrollableContainerRefAtom } from '../../store';
import Message from './message';
import { ChatInput } from './input';

export default function MessageList () {
  const messages = useAtomValue(messagesAtom);
  const [scrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  
  useEffect(() => {
    const scrollableElement = scrollableContainerRef?.current;

    if (!scrollableElement) {
      return;
    }
    // scroll to bottom
    setTimeout(() => {
      scrollableElement.scrollTo({ top: scrollableElement.scrollHeight, behavior: 'smooth' });
    }, 200);
    }, [scrollableContainerRef]); 

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          // flexDirection: 'column',
          flexDirection: 'column-reverse',
          width: '100%',
          height: '420px',
          // flexGrow: 1,
          maxHeight: '500px',
          overflowY: 'auto',
          borderRight: '1px solid rgba(57, 61, 64, .3)',
          borderLeft: '1px solid rgba(57, 61, 64, .3)',
          // overflowAnchor: 'none',
        }}
      >
        {messages.slice().reverse().map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </Box>
      <ChatInput />
    </>
  );
};
