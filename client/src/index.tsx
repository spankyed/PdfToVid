import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'jotai';
import { theme } from './shared/styles/theme';
import Layout from './shared/components/layout';
import CalendarPage from './calendar';
import DateEntryPage from '~/date-entry';
import PaperEntryPage from '~/search';
import './shared/styles/index.css';
import SearchPage from '~/search';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/calendar" /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'date/:dateId', element: <DateEntryPage /> },
      { path: 'paper/:paperId', element: <PaperEntryPage /> },
    ],
  },
  {
    path: '/404',
    element: <div>Not Found</div>, // TODO: Create a 404 page
  },
]);

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
)

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
