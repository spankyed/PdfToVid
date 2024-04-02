import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Link } from '@mui/material';
import { useAtom } from 'jotai';
import { pdfModalOpen } from '../store';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '~/shared/utils/dateFormatter';

const createAuthorSearchURL = (authorName) => {
  const [lastName, firstName] = authorName.split(' ');
  if (!firstName || !lastName) return '#';
  const query = `${lastName},+${firstName.charAt(0)}`;
  return `https://arxiv.org/search/cs?searchtype=author&query=${query}`;
};

const DateAuthorsPdf: React.FC<{ date?: string, authors: string[] }> = ({ date, authors }) => {
  const navigate = useNavigate();
  const [, setOpen] = useAtom(pdfModalOpen);

  const handleOpen = () => setOpen(true);

  const onDateClick = date => e => {
    navigate(`/date/${date}`);
  }

  const formattedDate = formatDate(date || '', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
      { date && (
          <Typography variant="subtitle1" color="textSecondary" onClick={onDateClick(date)}
          style={{ cursor: 'pointer' }}>{formattedDate}</Typography>
        )
      }
      <Box sx={{ maxWidth: '80%' }}>
        {authors.map((author, index) => (
          <React.Fragment key={index}>
            <Link href={createAuthorSearchURL(author)} color="primary" underline="hover" target="_blank">
              {author}
            </Link>
            {index < authors.length - 1 ? ', ' : ''}
          </React.Fragment>
        ))}
      </Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>View PDF</Button>
    </Box>
  )
};

export default DateAuthorsPdf;
