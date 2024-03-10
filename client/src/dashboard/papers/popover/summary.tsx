import React, { useEffect } from 'react';
import { Paper, Typography, Fade, Badge } from '@mui/material';
import { styled } from '@mui/system';
import { getColorShade } from '../../../shared/utils/getColorShade';
import { useAtom } from 'jotai';
import { anchorElAtom, isOpenAtom, popoverTargetAtom, tooltipRefAtom } from './store';
import { createPortal } from 'react-dom';


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

const CustomTooltip: React.FC = () => {
  const [isOpen] = useAtom(isOpenAtom);
  const [anchorEl] = useAtom(anchorElAtom);
  const [tooltipRef, setTooltipRefAtom] = useAtom(tooltipRefAtom);
  const [paper] = useAtom(popoverTargetAtom);
  let { abstract, relevancy: score } = paper || { relevancy: 0 };

  const windowHeight = window.innerHeight - 100;
  abstract = slice(abstract, windowHeight) + '...'

  const tooltipRefCallback = (node: HTMLDivElement | null) => {
    setTooltipRefAtom(node);
  };
  
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    if (isOpen && anchorEl && tooltipRef) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const tooltipRect = tooltipRef.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const padding = -8;

      let left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      let topSpot = anchorRect.top - tooltipRect.height - padding;
      let bottomSpot = anchorRect.bottom + padding;
      let top;

      if (left < 0) {
        left = 0;
      } else if (left + tooltipRect.width > windowWidth) {
        left = windowWidth - tooltipRect.width;
      }

      const cantFitAbove = topSpot < 0;
      const cantFitBelow = bottomSpot + tooltipRect.height > windowHeight;
      if (cantFitAbove) {
        if (cantFitBelow) {
          const overHalfWayDown = (anchorRect.top + anchorRect.height / 2) > windowHeight / 2;
          top = overHalfWayDown ? 0 - padding : bottomSpot;
        } else {
          top = bottomSpot;
        }
      } else {
        top = topSpot;
      }

      tooltipRef.style.left = `${left}px`;
      tooltipRef.style.top = `${top}px`;
    }
  }, [isOpen, anchorEl, tooltipRef]);


  return (
    <>
      {isOpen &&
        <div
          ref={tooltipRefCallback}
          style={{
            position: 'absolute',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <Fade in={isOpen} timeout={200}>
            <ScoreBadge 
              badgeContent={`${(score * 100).toFixed(2)}%`} 
              score={score}
            >
              <TooltipPaper>
                <Typography variant="body2">{abstract}</Typography>
              </TooltipPaper>
            </ScoreBadge>
          </Fade>
        </div>
      }
    </>
  );
};

export default CustomTooltip;

function slice (str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) : str;
}



