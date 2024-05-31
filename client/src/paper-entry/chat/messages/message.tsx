import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Tooltip } from '@mui/material';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import Actions from './actions';
import { paperAtom } from '~/paper-entry/store';
import { selectedThreadsAtom } from '../threads/store';
import { colors } from '~/shared/styles/theme';

export default function Message({ message }) {
  // const paper = useAtomValue(paperAtom);
  // const selectedThreads = useAtomValue(selectedThreadsAtom);
  // const currThread = selectedThreads[paper!.id];
  const isBranchMessage = false;

  const [actionsShowing, showActions] = useState(false);
  const isAssistant = message.role === 'assistant';
  const isHidden = message.hidden;
  const yellowRGBA = 'rgba(255, 235, 59, 0.1)';
  const blueRGBA = colors.palette.background.paper;
  // const blueRGBA = 'rgba(33, 150, 243, 0.3)';
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
        backgroundColor:
          isBranchMessage ? blueRGBA :
          isHidden ? yellowRGBA :
          isAssistant ? 'rgba(0, 0, 0, 0.1)' : '',
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
          <p style={{
            fontWeight: '600',
            color: isAssistant ? colors.palette.secondary.light : 'rgba(255, 255, 255, 0.65)',
            opacity
          }} className='pr-4  pb-1'>
            { isAssistant
            ? 'Assistant'
            : 'You'
            }
          </p>
        </Tooltip>

        {
          actionsShowing && !message.stream &&
          <Actions message={message}/>
        }
      </div>
      <Typography sx={{ opacity }}>
        {message.text}
      </Typography>
    </Box>
  );
};

