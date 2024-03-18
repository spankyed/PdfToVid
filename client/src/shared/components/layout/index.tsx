import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { atomWithLocation } from 'jotai-location'
import { useAtom } from 'jotai';
import Breadcrumb from './breadcrumb';
import Sidebar from './sidebar';
import SidebarToggleButton from './sidebar/toggle';
import { colors } from '~/shared/styles/theme';

const height = 'calc(100vh - 65px)';

const locationAtom = atomWithLocation()

function Layout(): React.ReactElement {
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
              <Typography variant="h6" component="div" sx={{
                borderRadius: '10%', padding: '2px 7px', border: '2px solid white'
              }}>
                AI
              </Typography>
              <Typography variant="h6" component="div" sx={{ padding: '4px 4px' }}>
                Labs
              </Typography>
            </div>
          </Link>
          <Breadcrumb currentPath={currentPath} breadcrumbs={breadcrumbs} />
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        maxHeight: height,
        transition: 'all 0.5s ease-in-out',
        backgroundColor: colors.main,
      }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <SidebarToggleButton/>
          <Outlet />
        </Box>
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
};

export default Layout;
