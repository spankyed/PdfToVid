import React from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material';

const EntryTitleStyled = styled(Typography)(({ theme }) => ({
  // textAlign: 'center',
  fontWeight: 600,
  background: 'rgba(0, 0, 0, 0.5)', // Black with 50% opacity
  padding: theme.spacing(1), // You can adjust the padding as needed
  borderRadius: theme.shape.borderRadius, // Makes the corners rounded
  // color: theme.palette.secondary.main, // or any color you prefer
  textShadow: '2px 2px 4px #00000040',
  maxWidth: 'fit-content',
  position: 'relative', // Ensures the title overlays the background
  zIndex: 1, // Places the title above the background component
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(2),
  minHeight: '5rem',
  // background: 'linear-gradient(135deg, #222222 50%, #B4191C 50%)',
  background: 'linear-gradient(135deg, #B4191C 50%, #222222 50%)',
  // background: 'linear-gradient(to right, #B4191C 50%, #222222 50%)',
  // background: 'linear-gradient(to right, #222222 50%, #B4191C 50%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
}));

const PaperTitle: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <GradientBackground>
      { title && (
        <EntryTitleStyled variant="h4" gutterBottom>
          {title}
        </EntryTitleStyled>
        )
      }
    </GradientBackground>
  );
};

export default PaperTitle;
