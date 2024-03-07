import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Fade, Badge } from '@mui/material';
import { styled } from '@mui/system';
import { createPortal } from 'react-dom';
import { getColorShade } from '../utils/getColorShade';

interface TooltipProps {
  children: React.ReactElement;
  title: string;
  score: number;
}

const TooltipPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '400px',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
  transition: 'opacity 0.2s ease-in-out',
}));

const ScoreBadge = styled(Badge)<{ score: number }>(({ theme, score }) => ({
  '& .MuiBadge-badge': {
    top: -8,
    right: '50%',
    transform: 'translateX(50%)',
    backgroundColor: getColorShade(score),
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    padding: '4px 8px',
  },
}));


const CustomTooltip: React.FC<TooltipProps> = ({ children, title, score }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLElement>) => {
    // const relatedTarget = event.relatedTarget as HTMLElement;
    // if (!tooltipRef.current?.contains(relatedTarget)) {
      setIsOpen(false);
    // }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && anchorEl && tooltipRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const padding = -8;

      let left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      let top = anchorRect.top - tooltipRect.height - padding;

      if (left < 0) {
        left = 0;
      } else if (left + tooltipRect.width > windowWidth) {
        left = windowWidth - tooltipRect.width;
      }

      if (top < 0) {
        top = anchorRect.bottom + padding;
      }

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${top}px`;
    }
  }, [isOpen, anchorEl]);


  return (
    <>
      {React.cloneElement(children, {
        onMouseOver: handleMouseOver,
        onMouseOut: handleMouseOut,
      })}
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              zIndex: 9999,
            }}
          >
            <Fade in={isOpen} timeout={200}>
              <ScoreBadge 
                badgeContent={`${(score * 100).toFixed(2)}%`} 
                score={score}
              >
                <TooltipPaper>
                  <Typography variant="body2">{title}</Typography>
                </TooltipPaper>
              </ScoreBadge>
            </Fade>
          </div>,
          document.body
        )}
    </>
  );
};

export default CustomTooltip;