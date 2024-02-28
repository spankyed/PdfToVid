import { RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './index.css';
import { Provider } from 'jotai';

import React from 'react';
import Day from '~/day';
import Entry from '~/entry';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './layout';
import Dashboard from './dashboard';
import './index.css';
import SocketListener from './shared/store/listeners-hook';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/papers" /> },
      { path: 'papers', element: <Dashboard /> },
      { path: 'day/:dayId', element: <Day /> },
      { path: 'entry/:entryId', element: <Entry /> },
    ],
  },
  {
    path: '/404',
    element: <div>Not Found</div>,
  },
]);
const theme = createTheme({
  typography: {
    // fontFamily: 'Courier New, monospace',
  },
});

const App: React.FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <Provider>
        <RouterProvider router={router} />
        <SocketListener />
      </Provider>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);




