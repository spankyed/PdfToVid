import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CachedIcon from '@mui/icons-material/Cached';
import { atom, useAtom, useSetAtom } from 'jotai';
import dayjs from 'dayjs';

const actions = [
  { icon: <CachedIcon />, name: 'Regenerate' },
  { icon: <DeleteForeverIcon />, name: 'Delete' },
  // { icon: <VisibilityOffIcon />, name: 'Show' },
  { icon: <VisibilityOffIcon />, name: 'Hide' },
  { icon: <AltRouteIcon sx={{ mr: 1 }} />, name: 'Thread' },
];

function Actions() {
  return (
    <>
      {
        actions.map((action) => (
          <Tooltip title={action.name} key={action.name} placement='top'>
            <IconButton onClick={() => console.log(action.name)} sx={{ padding: 0, mr: 1, scale: '.8' }}>
              {action.icon}
            </IconButton> 
          </Tooltip>
        ))
      }
    </>
  );
}

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

export default function Message({ message }) {
  const [actionsShowing, showActions] = useState(false);
  const isAssistant = message.sender === 'assistant';

  return (
    // <Box mb={2} p={2} sx={{ textAlign: 'left' }} className={`${isAssistant ? 'bg-slate-100' : ''}`}>
    <Box
      mb={2} p={2} sx={{ textAlign: 'left', whiteSpace: 'pre-wrap' }} className=''
      onMouseEnter={() => showActions(true)}
      onMouseLeave={() => showActions(false)}
      >

      {/* <Typography variant="caption">{new Date(message.timestamp).toLocaleString()}</Typography> */}
      <div className='flex items-center'>
        <Tooltip title={dayjs(message.timestamp).format('MMM D, YYYY h:mm A')} placement='top'>
          <p style={{ fontWeight: '600', color: 'rgba(0, 0, 0, 0.47)' }} className='pr-4  '>
            {capitalize(message.sender)}
          </p>
        </Tooltip>

        {
          actionsShowing &&
          <Actions />
        }
      </div>
      <Typography>{message.text}</Typography>
    </Box>
  );
};

