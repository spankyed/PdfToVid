import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { addMessageAtom, messagesAtom, tokenUsageAtom } from '../store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as api from '~/shared/api/fetch';
import { paperAtom } from '~/paper-entry/store';
import { promptPresetsOpenAtom } from './store';


export const ChatInput = () => {
  const [input, setInput] = useState('');
  const addMessage = useSetAtom(addMessageAtom);
  const [isOpen, setIsOpen] = useAtom(promptPresetsOpenAtom);
  const [inputEnabled, toggleInput] = useState(true);
  const [tokenUsage] = useAtom(tokenUsageAtom);
  const [paper] = useAtom(paperAtom);

  const handleSend = async () => {
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
          text: input
        });
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
      {
        isOpen && <AutofillMenu setInput={setInput} setIsOpen={setIsOpen}/>
      }

      <TextField
        disabled={!inputEnabled}
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
              disabled={!inputEnabled}
              onClick={handleMenuToggle} color="primary" className="menu-toggle-button">
              <MoreVertIcon />
            </IconButton>
          ),
          endAdornment: (
            <>
              <IconButton
                disabled={!inputEnabled}
                onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </>
          ),
        }}
      />

      <Typography variant="caption" mt={1} mb={3} pl={1}>Token usage {tokenUsage.current} / {tokenUsage.max}</Typography>
    </Box>
  );
};

const AutofillMenu = ({ setInput, setIsOpen }) => {
  const autofillMessages = ["Hello, how can I help you?", "Can you provide more details?", "Thank you for reaching out."];

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (message) => {
    setInput(message);
    handleClose();
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const isDescendantOfMenuToggle = (target) => {
        return target.classList.contains('menu-toggle-button') || target.closest('.menu-toggle-button') != null;
      };

      if (!event.target.closest('#autofill-menu') && !isDescendantOfMenuToggle(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <Box
      id="autofill-menu"
      position="absolute"
      zIndex="modal"
      width="100%"
      bgcolor="background.paper"
      boxShadow={3}
      // top="-140px"
      top="-8.5rem"
      left="0"
      sx={{
        borderRight: '1px solid rgba(57, 61, 64, .3)',
        borderLeft: '1px solid rgba(57, 61, 64, .3)',
        borderTop: '1px solid rgba(57, 61, 64, .3)',
      }}
    >
      <List>
        {autofillMessages.map((message, index) => (
          <ListItem key={index} button onClick={() => handleSelect(message)}>
            <Typography>{message}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
