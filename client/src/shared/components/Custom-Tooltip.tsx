import React, { useState, useRef, useEffect } from 'react';
import { Paper, Popper, Typography, Fade } from '@mui/material';
import { styled } from '@mui/system';

interface TooltipProps {
  children: React.ReactElement;
  title: string;
}

const TooltipPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '400px',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Translucent black background
  color: theme.palette.common.white, // White text color
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  transition: 'opacity 0.2s ease-in-out',
}));

const CustomTooltip: React.FC<TooltipProps> = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popperRef.current && !popperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        placement="top"
        ref={popperRef}
        modifiers={[
          {
            name: 'preventOverflow',
            options: {
              altBoundary: true,
              padding: 8,
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <TooltipPaper>
              <Typography variant="body2">{title}</Typography>
            </TooltipPaper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default CustomTooltip;