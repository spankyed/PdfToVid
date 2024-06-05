import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, Tooltip } from '@mui/material';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import dayjs from 'dayjs';
import Actions from './actions';
import { paperAtom } from '~/paper-entry/store';
import { selectedThreadsAtom } from '../threads/store';
import { colors } from '~/shared/styles/theme';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './message.css';

export default function Message({ message }) {
  const paper = useAtomValue(paperAtom);
  const selectedThreads = useAtomValue(selectedThreadsAtom);
  const currThread = selectedThreads[paper!.id];
  const isBranchMessage = message.parentId && currThread?.messageId === message.parentId;

  const [actionsShowing, showActions] = useState(false);
  const isAssistant = message.role === 'assistant';
  const isHidden = message.hidden;
  const yellowRGBA = 'rgba(255, 235, 59, 0.1)';
  const blueRGBA = colors.palette.background.paper;
  const opacity = isHidden ? 0.4 : 1;

  return (
    <Box
      mb={2}
      p={2}
      pt={1}
      sx={{
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        backgroundColor:
          isBranchMessage ? blueRGBA :
          isHidden ? yellowRGBA :
          isAssistant ? 'rgba(0, 0, 0, 0.1)' : '',
        borderTop: isBranchMessage ? '4px solid rgba(255, 255, 255, 0.2)' : 'none',
        borderLeft: isAssistant ? '4px solid rgba(255, 255, 255, 0.2)' : 'none' 
      }}
      onMouseEnter={() => showActions(true)}
      onMouseLeave={() => showActions(false)}
    >
      <div className='flex items-center'>
        <Tooltip
          title={dayjs(message.timestamp).format('MMM D, YYYY h:mm A')}
          placement='top'
        >
          <p
            style={{
              backgroundColor: 'rgba(55, 55, 55, 0.1)',
              borderRadius: 4,
              fontWeight: '600',
              color: isAssistant ? colors.palette.primary.light : 'white',
              // color: isAssistant ? colors.palette.primary.light : 'rgba(255, 255, 255, 0.65)',
              opacity,
            }}
            className='px-2 py-1 mb-1 mr-2'
          >
            {isAssistant ? 'Assistant' : 'You'}
          </p>
        </Tooltip>
        {actionsShowing && !message.stream && <Actions message={message} />}
      </div>
      <Box sx={{ opacity, display: 'flex', flexDirection: 'column' }}>
        <ReactMarkdown
          skipHtml={true}
          remarkPlugins={[remarkGfm]}
          components={{
            h3: ({ node, ...props }) => <div><h3 className="custom-h3" {...props} /></div>,
            p: ({ node, ...props }) => <div className="custom-p" {...props} />,
            ul: ({ children }) => <ul className="custom-list-ul">{children}</ul>,
            ol: ({ children }) => <ol className="custom-list-ol">{children}</ol>,
            li: ({ children }) => <li className="custom-list-item">{children}</li>
          }}
        >
          {message.text}
        </ReactMarkdown>
      </Box>
    </Box>
  );
}

