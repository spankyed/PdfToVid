import React from 'react';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAtom } from 'jotai';
import Dates from './dates';
import { sidebarOpenAtom } from './store';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import ListItemButton from '@mui/material/ListItemButton'; // Import ListItemButton
import { colors } from '~/shared/styles/theme';

const NavItem = styled(ListItemButton)(({ theme }) => ({
  marginLeft: '.5rem', // Add 1rem margin to the left
}));

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen] = useAtom(sidebarOpenAtom);

  return (
    <Box sx={{
      paddingTop: '1rem', // Add 1rem margin to the left
      width: isSidebarOpen ? 250 : 0,
      transition: 'width .3s ease',
      height: '100vh',
      bgcolor: 'background.paper',
      overflow: 'hidden',
      backgroundColor: colors.sidebar,
      // display: 'flex',
      // flexDirection: 'column',
    }}>
      <List component="nav" >
        <NavItem onClick={() => navigate('search')}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Search" />
        </NavItem>
        <NavItem onClick={() => navigate('analytics')}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </NavItem>
        <NavItem onClick={() => navigate('calender')}>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Calendar" />
        </NavItem>

        <Divider 
        sx={{
          marginTop: '1rem', // Add 1rem margin to the left
          // marginBottom: '1rem', // Add 1rem margin to the left
        }}
        />
        
        {/* <ListSubheader component="div" id="dates-subheader"
        sx={{
          marginLeft: '.5rem', // Add 1rem margin to the left
          marginTop: '1rem', // Add 1rem margin to the left
          marginBottom: '-.5rem', // Add 1rem margin to the left
        }}
        >
          DATES
        </ListSubheader> */}

      </List>
      <Dates />
    </Box>
  );
}

export default Sidebar;
