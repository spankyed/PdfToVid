import React, { useMemo } from 'react';
import { Typography, Box, Badge, styled } from '@mui/material';
import { formatDateParts } from '~/shared/utils/dateFormatter';
import { dateEntryStateAtom } from '../store';
import { useAtom } from 'jotai';
import { colors } from '~/shared/styles/theme';

const ScoreBadge = styled(Badge)<{ count: number }>(({ theme, count }) => ({
  '& .MuiBadge-badge': {
    // top: 8,
    top: '50%',
    // left: '0',
    right: '100%',
    // transform: 'translateX(50%)',
    // backgroundColor: 'rgb(32, 123, 145)',
    backgroundColor: colors.palette.secondary.main,
    // backgroundColor: colors.palette.background.paper,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    width: '2rem',
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
        max={999}
        
      >
        <Typography variant="h4"
          sx={{
            background: colors.palette.background.paper,
            // background: colors.palette.secondary.main,
            // borderBottom: '2px solid #FF8E53',
            // boxShadow: `0 3px 5px 2px ${colors.primary}`,
            padding: '.5em 2em .5em 2em',
            // border: `2px solid white`,
          // fontWeight: 'bold',
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
