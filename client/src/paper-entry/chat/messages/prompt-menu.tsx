import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSetAtom, useAtom, useAtomValue } from 'jotai';
import { promptPresetsOpenAtom, inputAtom, promptOptionsAtom } from './store';

const PromptMenu = () => {
  const autofillMessages = useAtomValue(promptOptionsAtom);
  const setIsOpen = useSetAtom(promptPresetsOpenAtom);
  const setInput = useSetAtom(inputAtom);

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
    <div id="autofill-menu" className='absolute w-full z-50 left-0 bottom-0'>
      <AddPrompt />

      <Box
        width="100%"
        bgcolor="background.paper"
        boxShadow={3}
        sx={{
          maxHeight: '300px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          borderRight: '1px solid rgba(57, 61, 64, .3)',
          borderLeft: '1px solid rgba(57, 61, 64, .3)',
          borderTop: '1px solid rgba(57, 61, 64, .3)',
        }}
      >

        <List>
          {autofillMessages.map((message, index) => (
            <ListItem key={index} button onClick={() => handleSelect(message)}
              sx={{ borderBottom: index === autofillMessages.length - 1 ? 'none' : '1px solid rgba(57, 61, 64, .3)'}}
            >
              <Typography>{message}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
};

function AddPrompt(){
  const [autofillMessages, setAutofillMessages] = useAtom(promptOptionsAtom);
  const [newPrompt, setNewPrompt] = useState("");
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  
  const handleAddNewPrompt = () => {
    if (newPrompt.trim()) {
      setAutofillMessages([ newPrompt.trim(), ...autofillMessages]);
      setNewPrompt("");
      setIsAddingPrompt(false);
    }
  };

  const handleKeyPress = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid form submission or newline in textfield
      handleAddNewPrompt();
    }
  };
  return (
    <div>

      {
      isAddingPrompt
        ? (
          <Box display="flex" alignItems="center" bgcolor="background.paper">
            <TextField
              autoFocus
              multiline
              label="New Prompt"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              fullWidth
              onKeyDown={handleKeyPress}
              InputProps={{
                sx: { borderRadius: 0, borderBottom: 'none' },
                endAdornment: (
                  <IconButton
                    onClick={handleAddNewPrompt}
                  >
                    <AddIcon />
                  </IconButton>
                )
              }}

            />
          </Box>
          )
        : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsAddingPrompt(!isAddingPrompt)}
            startIcon={<AddIcon />}
            sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 0}}
          >
            Add New Prompt
          </Button>
          )
      }
    </div>
  );
}

export default PromptMenu;