import React from 'react';
import {  Typography, Breadcrumbs } from '@mui/material';
import {  useNavigate } from 'react-router-dom';

const BreadcrumbComponent: React.FC<{ currentPath: string, breadcrumbs: any[] }> = ({ currentPath, breadcrumbs }) => {
  if (currentPath === '/calender') return null;
  

  // const [loc, setLoc] = useAtom(locationAtom)


  const navigate = useNavigate();

  function reformatDate(inputDate) {
    const [year, month, day] = inputDate.split('-');
    return `${month}-${day}-${year}`;
  }

  function formatBreadcrumb(breadcrumb) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD
    if (datePattern.test(breadcrumb)) {
      return reformatDate(breadcrumb);
    }
    return breadcrumb;
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" color='inherit' sx={{ 
      opacity: 0.75,
      '& > *': {
        fontSize: '0.9rem', // slightly reduce font size for subtlety
        fontWeight: '500',  // medium weight for better readability
      },
      '& .MuiTypography-root': {
        color: 'inherit',   // ensure the last breadcrumb also inherits color
      }
    }}>
      {breadcrumbs.map((breadcrumb, index) => {
        const formattedBreadcrumb = formatBreadcrumb(breadcrumb);
        return index !== breadcrumbs.length - 1 ? (
          <span onClick={() => navigate(-1)} color="inherit" key={formattedBreadcrumb} style={{ cursor: 'pointer' }}>
            {formattedBreadcrumb}
          </span>
        ) : (
          <Typography key={formattedBreadcrumb}>
            {formattedBreadcrumb}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbComponent;
