import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { addMessageAtom, messagesAtom, tokenUsageAtom } from './store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { scrollableContainerRefAtom } from '../store';

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

const Message = ({ message }) => {
  const isAssistant = message.sender === 'assistant';
  return (
    // <Box mb={2} p={2} sx={{ textAlign: 'left' }} className={`${isAssistant ? 'bg-slate-100' : ''}`}>
    <Box mb={2} p={2} sx={{ textAlign: 'left', whiteSpace: 'pre-wrap' }} className='border'>
      {/* <Typography variant="caption">{new Date(message.timestamp).toLocaleString()}</Typography> */}
      <Typography>{message.text}</Typography>
    </Box>
  );
};

const ChatInput = () => {
  const [input, setInput] = useState('');
  const addMessage = useSetAtom(addMessageAtom);
  const [isOpen, setIsOpen] = React.useState(false);
  const [tokenUsage] = useAtom(tokenUsageAtom);

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
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
        placeholder="Type a message"
        InputProps={{
          sx: {  borderTopLeftRadius: 0, borderTopRightRadius: 0 },
          startAdornment: (
            <IconButton onClick={handleMenuToggle} color="primary" className="menu-toggle-button">
              <MoreVertIcon />
            </IconButton>
          ),
          endAdornment: (
            <>
              <IconButton onClick={handleSend}>
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
