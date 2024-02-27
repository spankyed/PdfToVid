import React, { useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Breadcrumbs, Box, Link as MLink} from '@mui/material';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { atomWithLocation } from 'jotai-location'
import { useAtom } from 'jotai';

const height = 'calc(100vh - 65px)';

const locationAtom = atomWithLocation()

const BreadcrumbComponent: React.FC<{ currentPath: string, breadcrumbs: any[] }> = ({ currentPath, breadcrumbs }) => {
  if (currentPath === '/papers') return null;
  

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

const Layout: React.FC = observer(() => {
  const [location, setLoc] = useAtom(locationAtom)

  const currentPath = location.pathname || '';
  const generateBreadcrumbs = () => {
    const parts = currentPath.split("/").filter(Boolean);
    return parts.map(part => (part.charAt(0).toUpperCase() + part.slice(1)));
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <>
      <AppBar position="sticky" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link color="inherit" to="/">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant="h6" component="div" sx={{ borderRadius: '10%', padding: '2px 5px', border: '2px solid white' }}>
                AI
              </Typography>
              <Typography variant="h6" component="div" sx={{ padding: '4px 4px' }}>
                Labs
              </Typography>
            </div>
          </Link>
          <BreadcrumbComponent currentPath={currentPath} breadcrumbs={breadcrumbs} />
        </Toolbar>
      </AppBar>
      <Box sx={{ maxHeight: height }}>
        <Outlet />
      </Box>
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: 'grey.200' }}>
        <MLink href="https://www.youtube.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          YouTube
        </MLink>
        <MLink href="https://www.github.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          GitHub
        </MLink>
        <MLink href="/contact" sx={{ margin: 1 }}>
          Contact
        </MLink>
      </Box> */}
    </>
  );
});

export default Layout;
