import React, { useEffect, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { addMessageAtom, messagesAtom } from './store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function MessageList () {
  const messages = useAtomValue(messagesAtom);

  return (
    <Box p={2} sx={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }} flexDirection="column">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <ChatInput />
    </Box>
  );
};

const Message = ({ message }) => {
  return (
    <Box mb={2} sx={{ textAlign: 'left' }}>
      <Typography variant="subtitle1">{message.text}</Typography>
      <Typography variant="caption">{new Date(message.timestamp).toLocaleString()}</Typography>
    </Box>
  );
};

const ChatInput = () => {
  const [input, setInput] = useState('');
  const addMessage = useSetAtom(addMessageAtom);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: Date.now(),
        text: input,
        timestamp: new Date().toISOString()
      };
      addMessage(newMessage);
      setInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid form submission or newline in textfield
      handleSend();
    }
  };

  const handleMenuOpen = (event) => {
    setIsOpen(true);
  };

  return (
    <Box display="flex" position="relative" mt={2} alignItems="center">
      {
        isOpen && <AutofillMenu setInput={setInput} setIsOpen={setIsOpen}/>
      }

      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        placeholder="Type a message"
        InputProps={{
          endAdornment: (
            <>
              <IconButton onClick={handleSend}>
                <SendIcon />
              </IconButton>
              <IconButton onClick={handleMenuOpen} color="primary">
                <MoreVertIcon />
              </IconButton>
            </>
          ),
        }}
      />

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
      if (!event.target.closest('#autofill-menu')) {
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
