import React, { useMemo } from 'react';
import { Typography, Box, Badge, styled } from '@mui/material';
import { formatDateParts } from '~/shared/utils/dateFormatter';
import { dateEntryStateAtom } from '../store';
import { useAtom } from 'jotai';

const ScoreBadge = styled(Badge)<{ count: number }>(({ theme, count }) => ({
  '& .MuiBadge-badge': {
    top: 8,
    right: '100%',
    transform: 'translateX(50%)',
    backgroundColor: 'rgb(32, 123, 145)',
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
}));

const PageTitle: React.FC<{ value: string, count: number }> = ({ value, count }) => {
  const [dateEntryState] = useAtom(dateEntryStateAtom);

  // const [formattedDate, weekday] = useMemo(() => {
  const formattedDate = useMemo(() => {
    const [weekday, month, day, year] = formatDateParts(value, {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  
    return `${weekday}, ${month} ${day}, ${year}`;
  }, [value]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <ScoreBadge 
        badgeContent={`${count}`} 
        count={count}
      >
        <Typography variant="h4"
          sx={{
            background: '#FE6B8B',
            color: 'white',
            webkitBackgroundClip: 'text',
            webkitTextFillColor: 'transparent',
            borderBottom: '2px solid #FF8E53',
            boxShadow: '0 3px 5px 2px rgb(76 61 168)',
            padding: '.5em 2em .5em 2em',
            fontWeight: 'bold',
            borderRadius: '5px',
            letterSpacing: '0.0075em',
            // marginTop: '20px',
          }}
        >
          {
            dateEntryState === 'error'
            ? `Error loading date ${value}`
            : formattedDate
          }
          
        </Typography>
      </ScoreBadge>
    </Box>
  );
}

export default PageTitle;
