import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'jotai';
import { theme } from './shared/styles/theme';
import SocketListener from './shared/api/socket-listener';
import Layout from './shared/components/layout';
import Calender from './calender';
import Day from '~/date-entry';
import Entry from '~/paper-entry';
import './shared/styles/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/calender" /> },
      { path: 'calender', element: <Calender /> },
      { path: 'day/:dayId', element: <Day /> },
      { path: 'entry/:entryId', element: <Entry /> },
    ],
  },
  {
    path: '/404',
    element: <div>Not Found</div>,
  },
]);

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Provider>
      <RouterProvider router={router} />
      <SocketListener />
    </Provider>
  </ThemeProvider>
)

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
