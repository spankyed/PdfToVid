import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { scrollableContainerRefAtom } from '../../store';
import Message from './message';
import { ChatInput } from './input';
import { promptPresetsOpenAtom, messagesAtom } from './store';
import PromptMenu from './prompt-menu';
import { chatStateAtom } from '../store';
import CircularProgress from '@mui/material/CircularProgress';

export default function MessageList () {
  const promptPresetsOpen = useAtomValue(promptPresetsOpenAtom);
  const messages = useAtomValue(messagesAtom);
  const [scrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const chatState = useAtomValue(chatStateAtom);
  const isLoading = chatState === 'loading';
  const isError = chatState === 'error';

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
      <div className='relative'>
        {(promptPresetsOpen || isLoading) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1,
            }}
          />
        )}
        {
          isError && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                zIndex: 1,
              }}
            />
          )
        }
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
          {
            isLoading 
            ? <Loader />
            : <>
                {messages.slice().reverse().map((message) => (
                  <Message key={message.id} message={message} />
                ))}
              </>
            
          }
        </Box>

        {
          promptPresetsOpen && <PromptMenu/>
        }
      </div>
      <ChatInput />
    </>
  );
};

function Loader () {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
}
