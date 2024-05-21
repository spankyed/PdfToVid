import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CachedIcon from '@mui/icons-material/Cached';
import { atom, useAtom, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import { messagesAtom } from './store';
import * as api from '~/shared/api/fetch';
import { addNewThreadAtom } from '../threads/store';

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

const actions = [
  { name: 'regenerate', icon: <CachedIcon />, color:'#9c27b0' },
  { name: 'delete', icon: <DeleteForeverIcon />, color:'#e53935' },
  { name: 'show', icon: <VisibilityIcon />, color:'#43a047' },
  { name: 'hide', icon: <VisibilityOffIcon />, color:'#fdd835' },
  { name: 'thread', icon: <AltRouteIcon />, color:'#1e88e5' },
];

function Actions({ message }) {
  const [messages, setMessages] = useAtom(messagesAtom);
  const branchThread = useSetAtom(addNewThreadAtom);

  const filters = {
    regenerate: (m) => m.sender === 'assistant',
    show: (m) => m.hidden,
    hide: (m) => !m.hidden,
    // thread: (m) => !m.hidden,
  }

  const filteredActions = actions.filter(action => filters[action.name] ? filters[action.name](message) : true);

  const handlers = {
    // regenerate: async () => {
    //   setMessages(messages.filter(m => m.id !== message.id));
    //   const res = await api.regenerateMessage(message.id)
    // // todo stream new message
    // },
    delete: async () => {
      setMessages(messages.filter(m => m.id !== message.id));
      await api.deleteMessage(message.id)
    },
    show: async () => {
      setMessages(messages.map(m => m.id === message.id ? { ...m, hidden: false } : m));
      await api.toggleHideMessage({
        messageId: message.id,
        state: false,
      });
    },
    hide: async () => {
      setMessages(messages.map(m => m.id === message.id ? { ...m, hidden: true } : m));
      await api.toggleHideMessage({
        messageId: message.id,
        state: true,
      });
    },
    thread: () => {
      branchThread(message.id);
    },
  }

  return (
    <>
      {
        filteredActions.map((action) => (
          <Tooltip title={capitalize(action.name)} key={action.name} placement='top'>
            <IconButton onClick={handlers[action.name]}
              sx={{
                padding: 0,
                mr: 1,
                scale: '.8',
                '&:hover .MuiSvgIcon-root': { color: action.color },
              }}
            >
              {action.icon}
            </IconButton> 
          </Tooltip>
        ))
      }
    </>
  );
}


export default function Message({ message }) {
  console.log('message: ', message);
  const [actionsShowing, showActions] = useState(false);
  const isAssistant = message.sender === 'assistant';
  const isHidden = message.hidden;
  const yellowRGBA = 'rgba(255, 235, 59, 0.1)';
  const opacity = isHidden ? 0.4 : 1;

  return (
    // <Box mb={2} p={2} sx={{ textAlign: 'left' }} className={`${isAssistant ? 'bg-slate-100' : ''}`}>
    <Box
      mb={2}
      p={2}
      sx={{
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        // backgroundColor: isAssistant ? 'rgba(0, 0, 0, 0.1)' : '',
        backgroundColor: isAssistant ? 'rgba(0, 0, 0, 0.1)' : isHidden ? yellowRGBA : '',
      }}
      className=''
      onMouseEnter={() => showActions(true)}
      onMouseLeave={() => showActions(false)}
      >

      {/* <Typography variant="caption">{new Date(message.timestamp).toLocaleString()}</Typography> */}
      <div className='flex items-center'>
        <Tooltip
          title={dayjs(message.timestamp).format('MMM D, YYYY h:mm A')}
          placement='top'>
          <p style={{ fontWeight: '600', color: 'rgba(0, 0, 0, 0.47)', opacity }} className='pr-4  '>
            { isAssistant
            ? 'Assistant'
            : 'You'
            }
          </p>
        </Tooltip>

        {
          actionsShowing &&
          <Actions message={message}/>
        }
      </div>
      <Typography sx={{ opacity }}>
        {message.text}
      </Typography>
    </Box>
  );
};

