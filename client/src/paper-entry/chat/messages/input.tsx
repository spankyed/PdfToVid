import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as api from '~/shared/api/fetch';
import { paperAtom } from '~/paper-entry/store';
import { inputAtom, promptPresetsOpenAtom, addMessageAtom, messagesAtom, tokenUsageAtom } from './store';
import { chatStateAtom, selectedThreadsAtom } from '../store';

export const ChatInput = () => {
  const [input, setInput] = useAtom(inputAtom);
  const addMessage = useSetAtom(addMessageAtom);
  const [isOpen, setIsOpen] = useAtom(promptPresetsOpenAtom);
  const [inputEnabled, toggleInput] = useState(true);
  const paper = useAtomValue(paperAtom);
  const selectedThreads = useAtomValue(selectedThreadsAtom);
  const chatState = useAtomValue(chatStateAtom);
  const notReady = chatState !== 'ready';

  const handleSend = async () => {
    if (chatState !== 'ready') {
      return;
    }

    if (input.trim()) {
      const newMessage = {
        id: Date.now(),
        text: input,
        timestamp: new Date().toISOString(),
        sender: 'you'
      };
      addMessage(newMessage);
      setInput('');

      toggleInput(false);

      try {
        const response = await api.sendMessage({
          paperId: paper?.id,
          threadId: selectedThreads[paper!.id],
          text: input
        });
        console.log('send message res', response);
        // const { tokenUsage: newTokenUsage } = response.data;
        // tokenUsage.current = newTokenUsage;
      } catch (error) {
        console.error("Failed to send message", error);
      }

      setTimeout(() => {
        toggleInput(true);
      }, 5000);

      // todo set loading state and disable button

    }
  };

  const handleKeyPress = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid form submission or newline in textfield
      handleSend();
    }
  };

  const handleMenuToggle = (event) => {
    setIsOpen(!isOpen);
  };

  return (
    <Box display="flex" position="relative" flexDirection={'column'}>


      <TextField
        disabled={!inputEnabled || notReady}
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        placeholder="Type a message"
        InputProps={{
          sx: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
          startAdornment: (
            <IconButton
              disabled={!inputEnabled || notReady}
              onClick={handleMenuToggle} color="primary" className="menu-toggle-button">
              <MoreVertIcon />
            </IconButton>
          ),
          endAdornment: (
            <>
              <IconButton
                disabled={!inputEnabled || notReady}
                onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </>
          ),
        }}
      />

      <TokenUsage />
    </Box>
  );
};

const TokenUsage = () => {
  const tokenUsage = useAtomValue(tokenUsageAtom);

  return (
    <Typography variant="caption" mt={1} mb={3} pl={1}>Token usage {tokenUsage.current} / {tokenUsage.max}</Typography>
  );
}