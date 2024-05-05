import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Button, InputBase, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import Sidebar from './sidebar';
import SidebarToggleButton from './sidebar/toggle';
import { colors } from '~/shared/styles/theme';
import MenuIcon from '@mui/icons-material/Menu';
import { sidebarOpenAtom } from './sidebar/store';
import { NotificationManager } from '../notification';

const height = 'calc(100vh - 65px)';

function Layout(): React.ReactElement {
  return (
    <>
      <AppBar position="sticky" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TitleArea />

          <SearchInput />
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

      <NotificationManager />
    </>
  );
};

function TitleArea() {
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom); // Assuming you have a setter function for the sidebar open state

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open);
  };

  return (
    <div style={{ display: 'flex', marginLeft: '.4rem', width: '230px'}}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </IconButton>
      <Link color="inherit" to="/calendar">
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
    </div>
  );
}

function SearchInput(){
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const queryParams = new URLSearchParams({ query: searchValue });
    const searchParamsString = queryParams.toString();
    const newUrl = `/search?${searchParamsString}`;

    navigate(newUrl);
    console.log('Searching for:', searchValue);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex' }}> {/* Form submission */}
      <TextField
          id="query-input"
          label="Keyword"
          variant="outlined"
          value={searchValue}
          size="small"
          onChange={handleSearchInputChange}
          sx={{
            mr: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
          fullWidth/>
      <Button
        type="submit"
        variant="contained"
        color="success"
        sx={{ mt: '-.3rem' }}
      >
        Search
      </Button>
    </form>
  );
}

export default Layout;
