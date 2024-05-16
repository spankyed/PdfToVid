import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Button, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useSetAtom, useAtom, useAtomValue } from 'jotai';
import { promptPresetsOpenAtom, inputAtom, promptOptionsAtom } from './store';

const PromptMenu = () => {
  const [promptPresets, setPromptPresets] = useAtom(promptOptionsAtom);
  const setIsOpen = useSetAtom(promptPresetsOpenAtom);
  const setInput = useSetAtom(inputAtom);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (prompt) => {
    setInput(prompt);
    handleClose();
  };

  const removePrompt = index => (event) => {
    event.stopPropagation();

    setPromptPresets(promptPresets.filter((_, i) => i !== index));
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
          {promptPresets.map((prompt, index) => (
            <ListItem
              key={index}
              onClick={() => handleSelect(prompt)}
              sx={{
                borderBottom: index === promptPresets.length - 1 ? 'none' : '1px solid rgba(57, 61, 64, .3)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{prompt.text}</Typography>
              <Tooltip title="Remove">
                <IconButton onClick={removePrompt(index)}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
};

function AddPrompt(){
  const [promptPresets, setPromptPresets] = useAtom(promptOptionsAtom);
  const [newPrompt, setNewPrompt] = useState("");
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  
  const handleAddNewPrompt = () => {
    if (newPrompt.trim()) {
      setPromptPresets([ { text: newPrompt.trim() }, ...promptPresets]);
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