import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as api from '~/shared/api/fetch';
import { paperAtom } from '~/paper-entry/store';
import { inputAtom, promptPresetsOpenAtom, sendMessageAtom, messagesAtom, tokenUsageAtom, inputEnabledAtom } from './store';
import { chatStateAtom } from '../store';
import { selectedThreadsAtom } from '../threads/store';

export const ChatInput = () => {
  const [input, setInput] = useAtom(inputAtom);
  const sendMessage = useSetAtom(sendMessageAtom);
  const [isOpen, setIsOpen] = useAtom(promptPresetsOpenAtom);
  const inputEnabled = useAtomValue(inputEnabledAtom);
  const paper = useAtomValue(paperAtom);
  const selectedThreads = useAtomValue(selectedThreadsAtom);
  const chatState = useAtomValue(chatStateAtom);
  const notReady = chatState !== 'ready';
  // const setInputRef = useSetAtom(inputRefAtom);

  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   setInputRef(inputRef);
  // }, [setInputRef]);

  const handleSend = async () => {
    if (chatState !== 'ready') {
      return;
    }

    if (input.trim()) {
      sendMessage({
        text: input,
        paperId: paper!.id,
        threadId: selectedThreads[paper!.id]?.id,
      });
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
        // ref={inputRef}
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
  const [tokenUsage, setTokenUsage] = useAtom(tokenUsageAtom);
  const messages = useAtomValue(messagesAtom);
  const chatState = useAtomValue(chatStateAtom);
  useEffect(() => {
    const newTokenUsage = messages.reduce((acc, message) => acc + (message.text.length / 4), 0);
    const totalTokensRounded = Math.round(tokenUsage.document + newTokenUsage);

    if (tokenUsage.total === totalTokensRounded) {
      return;
    } 

    setTokenUsage(prev => ({ ...prev, total: totalTokensRounded }))
  }, [tokenUsage, messages]);

  return (
    <Typography variant="caption" mt={1} mb={3} pl={1}>Token estimate {chatState !== 'ready' ? 0 : tokenUsage.total} / {tokenUsage.max}</Typography>
  );
}