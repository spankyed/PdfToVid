// src/components/Layout.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Breadcrumbs, Link, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const height = 'calc(100vh - 65px)'

const Layout: React.FC = () => {
  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)', 
          boxShadow: 'none' ,
          // background: 'linear-gradient(to top right, #1976d2, #63a4ff)',
          // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            AI Labs
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              Home
            </Link>
            <Link color="inherit" href="/about">
              About
            </Link>
            <Typography color="textPrimary">Current Page</Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxHeight: height}}> {/* Adjust the 64px value based on the height of the AppBar */}
        <Outlet />
      </Box>
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, backgroundColor: 'grey.200' }}>
        <Link href="https://www.youtube.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          YouTube
        </Link>
        <Link href="https://www.github.com" target="_blank" rel="noopener" sx={{ margin: 1 }}>
          GitHub
        </Link>
        <Link href="/contact" sx={{ margin: 1 }}>
          Contact
        </Link>
      </Box> */}
    </>
  );
}

export default Layout;
