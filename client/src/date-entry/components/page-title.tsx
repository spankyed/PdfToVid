import React, { useMemo } from 'react';
import { Typography, Box, Badge, styled } from '@mui/material';
import { formatDateParts } from '~/shared/utils/dateFormatter';
import { getColorShade } from '~/shared/utils/getColorShade';

const ScoreBadge = styled(Badge)<{ count: number }>(({ theme, count }) => ({
  '& .MuiBadge-badge': {
    top: 8,
    right: '100%',
    transform: 'translateX(50%)',
    backgroundColor: getColorShade(count / 90),
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
}));

const PageTitle: React.FC<{ date: string, count: number }> = ({ date, count }) => {
  // const [formattedDate, weekday] = useMemo(() => {
    const formattedDate = useMemo(() => {
      const [weekday, month, day, year] = formatDateParts(date, {
        weekday: 'long',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    
      return `${weekday}, ${month} ${day}, ${year}`;
    }, [date]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginBottom={1}>
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
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            padding: '.5em 2em .5em 2em',
            fontWeight: 'bold',
            borderRadius: '5px',
            letterSpacing: '0.0075em',
            marginTop: '20px',
          }}
        >
          {formattedDate}
        </Typography>
      </ScoreBadge>
    </Box>
  );
}

export default PageTitle;
