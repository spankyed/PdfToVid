import React, { CSSProperties, useState } from 'react';
import { useAtom } from 'jotai';
import { sidebarOpenAtom } from './store';

type direction = 'top' | 'bottom';
const baseX = -50;
const verticalY = 0.125;
const verticalRotate = 0;
const arrowY = 0.2;
const arrowRotate = 25;

const invert = value => value * (-1);
const transformString = (y, rotate) => `translateX(${baseX}%) translateY(${y}rem) rotate(${rotate}deg)`

const transformValues = {
  top: {
    open: transformString(invert(verticalY), verticalRotate),
    hover: transformString(invert(arrowY), arrowRotate),
    closed: transformString(invert(arrowY), invert(arrowRotate)),
  },
  bottom: {
    open: transformString(verticalY, verticalRotate),
    hover: transformString(arrowY, invert(arrowRotate)),
    closed: transformString(arrowY, arrowRotate),
  },
};

function SidebarToggleButton() {
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const [isHovering, setIsHovering] = useState(false);

  const barBaseStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    width: '0.25rem',
    height: '0.75rem',
    backgroundColor: 'grey',
    transition: 'transform 0.5s ease',
    borderRadius: '9999px', // Fully rounded ends, similar to rounded-full in Tailwind
  };

  const getStyle = (position: direction): CSSProperties => {
    const state = isHovering && isSidebarOpen ? 'hover' : isSidebarOpen ? 'open' : 'closed';
    return { ...barBaseStyle, transform: transformValues[position][state] };
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '30px 1rem',
        cursor: 'pointer',
        zIndex: 1201,
      }}
      onClick={() => setSidebarOpen(!isSidebarOpen)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={getStyle('top')}></div>
      <div style={getStyle('bottom')}></div>
    </div>
  );
}

export default SidebarToggleButton;