import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Tooltip } from '@mui/material';
import { atom, useAtom, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import Actions from './actions';

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

